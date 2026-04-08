// api/create-checkout-session.js
// Vercel Serverless — 建立 Stripe Checkout Session
// 支援：subscription（Premium 訂閱）和 payment（精選置頂一次性付款）

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    priceId, userId, email, successUrl, cancelUrl,
    mode = 'subscription',   // 'subscription' | 'payment'
    metadata = {}
  } = req.body;

  if (!priceId || !userId || !email)
    return res.status(400).json({ error: '缺少必要參數' });

  try {
    const sessionConfig = {
      mode,                                  // ← 支援一次性付款
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url:  cancelUrl,
      metadata:    { userId, ...metadata },
      locale:      'zh',
      allow_promotion_codes: true,
    };

    // 訂閱模式才加 7 天試用
    if (mode === 'subscription') {
      sessionConfig.subscription_data = {
        metadata: { userId },
        trial_period_days: 7,
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
};
