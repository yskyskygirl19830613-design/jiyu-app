// api/stripe-webhook.js
// Vercel Serverless Function — 接收 Stripe Webhook
// 付款成功後自動更新 Supabase 用戶的 Premium 狀態

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const sb = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY  // ← 注意：這裡用 service key，不是 anon key
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,                              // raw body（需要 rawBody）
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook 簽名驗證失敗:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const data = event.data.object;

  switch (event.type) {

    // ── 訂閱建立 / 付款成功 → 啟用 Premium ──────────
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const userId = data.metadata?.userId;
      if (!userId) break;

      const isActive = ['active', 'trialing'].includes(data.status);
      const until = data.current_period_end
        ? new Date(data.current_period_end * 1000).toISOString()
        : null;

      await sb.from('profiles').update({
        is_premium:       isActive,
        premium_until:    until,
        stripe_customer:  data.customer,
        subscription_id:  data.id,
        subscription_status: data.status,
      }).eq('id', userId);

      console.log(`✅ Premium ${isActive ? '啟用' : '停用'} → user ${userId}`);
      break;
    }

    // ── 訂閱取消 / 到期 → 關閉 Premium ──────────────
    case 'customer.subscription.deleted': {
      const userId = data.metadata?.userId;
      if (!userId) break;

      await sb.from('profiles').update({
        is_premium:          false,
        subscription_status: 'canceled',
      }).eq('id', userId);

      console.log(`❌ Premium 停用 → user ${userId}`);
      break;
    }

    // ── 付款失敗 → 發通知 ────────────────────────────
    case 'invoice.payment_failed': {
      const customerId = data.customer;
      const { data: profile } = await sb.from('profiles')
        .select('id').eq('stripe_customer', customerId).single();

      if (profile) {
        await sb.from('notifications').insert({
          user_id: profile.id,
          type:    'payment_failed',
          message: '你的 Premium 訂閱付款失敗，請更新付款資訊。',
        });
      }
      break;
    }
  }

  res.json({ received: true });
};

// 訂閱失效清除說明（410 狀態）：
// 若 send-push.js 回傳 410，表示 endpoint 已失效
// stripe-webhook 本身不直接處理，由 send-push.js 自動清除
// 此處標記 410 已知：statusCode 410 = endpoint gone
};

// Vercel 需要關閉 bodyParser 才能讀取 raw body
module.exports.config = {
  api: { bodyParser: false },
};

// ── 一次性付款成功（精選置頂）──────────────────
// 在 switch 的最後 default 前加入：
// case 'checkout.session.completed': {
//   const meta = data.metadata;
//   if (meta?.type === 'sponsor' && meta?.skillId) {
//     const until = new Date();
//     until.setDate(until.getDate() + parseInt(meta.days || 7));
//     await sb.from('skills').update({
//       is_sponsored:    true,
//       sponsored_until: until.toISOString(),
//     }).eq('id', meta.skillId).eq('user_id', meta.userId);
//   }
//   break;
// }
