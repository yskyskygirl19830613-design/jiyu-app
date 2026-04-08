// api/send-push.js
// Vercel Serverless — 發送 Web Push 通知
// 當有新申請、新訊息、配對成功時呼叫

const webpush = require('web-push');
const { createClient } = require('@supabase/supabase-js');

webpush.setVapidDetails(
  'mailto:' + process.env.ADMIN_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const sb = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { userId, title, body, url, type } = req.body;
  if (!userId || !title) return res.status(400).json({ error: '缺少參數' });

  // 取得用戶的 push 訂閱
  const { data: sub } = await sb.from('push_subscriptions')
    .select('*').eq('user_id', userId).single();

  if (!sub) return res.json({ sent: false, reason: '用戶未訂閱通知' });

  const payload = JSON.stringify({
    title,
    body,
    url:   url || '/',
    icon:  '/icon-192.png',
    badge: '/icon-192.png',
    data:  { type },
  });

  try {
    await webpush.sendNotification({
      endpoint: sub.endpoint,
      keys: { p256dh: sub.p256dh, auth: sub.auth },
    }, payload);

    // 存通知紀錄
    await sb.from('notifications').insert({
      user_id: userId, type, message: body, is_read: false,
    });

    res.json({ sent: true });
  } catch (err) {
    // 訂閱失效，清除
    if (err.statusCode === 410) {
      await sb.from('push_subscriptions').delete().eq('user_id', userId);
    }
    res.status(500).json({ error: err.message });
  }
};
