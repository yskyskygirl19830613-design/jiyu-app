// push-setup.js
// 技遇 — Web Push 通知設定
// 在 app.html 的 DOMContentLoaded 後呼叫 initPushNotifications()

const VAPID_PUBLIC_KEY = 'YOUR_VAPID_PUBLIC_KEY'; // 用 npx web-push generate-vapid-keys 產生

// ── 初始化推播通知 ────────────────────────────
async function initPushNotifications(sb, userId) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

  const reg = await navigator.serviceWorker.ready;

  // 檢查現有訂閱
  const existing = await reg.pushManager.getSubscription();
  if (existing) {
    await saveSubscription(sb, userId, existing);
    return;
  }

  // 第一次：靜默等待用戶動作觸發（不主動彈出）
  window._pushReady = { sb, userId, reg };
}

// ── 請求通知權限（在有意義的時機呼叫，例如交換完成時）──
async function requestPushPermission() {
  if (!window._pushReady) return false;
  const { sb, userId, reg } = window._pushReady;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return false;

  try {
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
    await saveSubscription(sb, userId, sub);
    return true;
  } catch (e) {
    console.error('Push 訂閱失敗:', e);
    return false;
  }
}

async function saveSubscription(sb, userId, sub) {
  await sb.from('push_subscriptions').upsert({
    user_id:      userId,
    endpoint:     sub.endpoint,
    p256dh:       btoa(String.fromCharCode(...new Uint8Array(sub.getKey('p256dh')))),
    auth:         btoa(String.fromCharCode(...new Uint8Array(sub.getKey('auth')))),
    updated_at:   new Date().toISOString(),
  }, { onConflict: 'user_id' });
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}
