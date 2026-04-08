// api/cancel-subscription.js
// Vercel Serverless — 取消 Stripe 訂閱

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const sb = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: '缺少 userId' });

  const { data: profile } = await sb.from('profiles')
    .select('subscription_id').eq('id', userId).single();

  if (!profile?.subscription_id) {
    return res.status(400).json({ error: '找不到訂閱 ID' });
  }

  try {
    // 設定期末取消（不立即終止，讓用戶用到期日）
    await stripe.subscriptions.update(profile.subscription_id, {
      cancel_at_period_end: true,
    });

    await sb.from('profiles').update({
      subscription_status: 'canceled',
    }).eq('id', userId);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
