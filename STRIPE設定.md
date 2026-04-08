# 技遇 Premium 收費設定指南

## 架構說明

```
用戶點「升級」
    ↓
前端呼叫 /api/create-checkout-session
    ↓
Vercel API 建立 Stripe Checkout Session
    ↓
用戶在 Stripe 頁面完成付款
    ↓
Stripe 送 Webhook 到 /api/stripe-webhook
    ↓
Vercel API 更新 Supabase profiles.is_premium = true
    ↓
用戶回到 premium-success.html
```

---

## Step 1 — 建立 Stripe 帳號

1. 去 https://stripe.com 註冊（免費）
2. 進入 Dashboard，切換到 **Test mode**（先測試）
3. 左側選單 → **Products** → **Add product**
   - 名稱：技遇 Premium
   - 建立兩個 Price：
     - 月繳：NT$99 / month（recurring）→ 複製 Price ID（`price_xxx`）
     - 年繳：NT$708 / year（recurring）→ 複製 Price ID

---

## Step 2 — 取得 Stripe 金鑰

Dashboard → Developers → API Keys：
- `Publishable key`（前端用，pk_test_xxx）
- `Secret key`（後端用，sk_test_xxx）⚠️ 不要外露

---

## Step 3 — 設定 Vercel 環境變數

在 Vercel 專案 → Settings → Environment Variables 加入：

| 變數名稱 | 值 |
|---------|-----|
| `STRIPE_SECRET_KEY` | sk_test_xxx |
| `STRIPE_WEBHOOK_SECRET` | whsec_xxx（下面取得）|
| `SUPABASE_URL` | https://xxx.supabase.co |
| `SUPABASE_SERVICE_KEY` | eyJxxx（service_role key）|

---

## Step 4 — 設定 Stripe Webhook

Dashboard → Developers → Webhooks → Add endpoint：

- URL：`https://你的app.vercel.app/api/stripe-webhook`
- 監聽事件：
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`

複製 **Signing secret**（whsec_xxx）→ 填入 Vercel 環境變數

---

## Step 5 — 更新前端設定

打開 `premium.html`，填入：

```javascript
const STRIPE_MONTHLY_PRICE = 'price_月繳ID';
const STRIPE_YEARLY_PRICE  = 'price_年繳ID';
const API_BASE = 'https://你的app.vercel.app';
```

---

## Step 6 — 更新 Supabase Schema

到 Supabase SQL Editor 執行 `supabase_schema.sql`（已包含 Premium 欄位）

---

## Step 7 — 在 app.html 加入 Premium 限制

在發布技能的函式裡加入判斷：

```javascript
// 檢查免費版限制
async function checkFreeLimit() {
  const { data: profile } = await sb.from('profiles')
    .select('is_premium').eq('id', currentUser.id).single();

  if (profile?.is_premium) return true; // Premium 無限制

  // 計算本月申請次數
  const startOfMonth = new Date();
  startOfMonth.setDate(1); startOfMonth.setHours(0,0,0,0);
  const { count } = await sb.from('swaps')
    .select('*', { count: 'exact', head: true })
    .eq('requester_id', currentUser.id)
    .gte('created_at', startOfMonth.toISOString());

  if (count >= 5) {
    showToast('免費版每月限 5 次申請');
    setTimeout(() => window.location.href = 'premium.html', 1500);
    return false;
  }
  return true;
}

// 在 applySwap() 最前面加：
// if (!await checkFreeLimit()) return;
```

---

## Step 8 — 測試流程

1. 用 Stripe 測試卡號：`4242 4242 4242 4242`，到期日任意未來日期，CVC 任意 3 碼
2. 完成付款後確認 Supabase profiles 的 `is_premium` 變成 `true`
3. 確認 premium-success.html 正常顯示

測試取消訂閱：Dashboard → Customers → 找到測試用戶 → Cancel subscription

---

## 正式上線前

把所有設定從 Test mode 換成 Live mode：
- Stripe Dashboard 右上角切換到 **Live mode**
- 重新取得 Live 的 Secret key 和 Webhook secret
- 更新 Vercel 環境變數
- 重新建立 Live 版的 Webhook endpoint

---

## 收費金流（台灣）

Stripe 在台灣的手續費：
- 國內信用卡：約 2.9% + NT$10
- 國際卡：約 3.9% + NT$10
- 每月 NT$99 實際到手約 NT$86

每個月記得到 Stripe Dashboard → Payouts 確認提款時程（通常 T+2 工作天）
