// service-worker.js
// SkillSwap PWA — 離線快取 + 背景更新策略

const CACHE_NAME = 'skillswap-v1';

// 安裝時預先快取的靜態資源
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

// ── 安裝：預快取靜態資源 ──────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ── 啟動：清除舊版快取 ────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ── 攔截請求：Cache First + Network Fallback ──────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // API 請求：永遠走網路（不快取動態資料）
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkOnly(request));
    return;
  }

  // 地圖 tile、外部資源：網路優先，失敗才用快取
  if (url.hostname !== location.hostname) {
    event.respondWith(networkFirst(request));
    return;
  }

  // 靜態資源：快取優先，背景更新（Stale While Revalidate）
  event.respondWith(staleWhileRevalidate(request));
});

// ── 策略函式 ──────────────────────────────────────

async function networkOnly(request) {
  try {
    return await fetch(request);
  } catch {
    return new Response(JSON.stringify({ error: '目前沒有網路連線' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached ?? new Response('離線中', { status: 503 });
  }
}

async function staleWhileRevalidate(request) {
  const cache  = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const networkPromise = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);

  return cached ?? await networkPromise ?? new Response('', { status: 503 });
}

// ── Push 通知（配對成功） ─────────────────────────
self.addEventListener('push', event => {
  // 解析 payload
  let payload = {};
  try { payload = event.data?.json() ?? {}; } catch { payload.body = event.data?.text() || ''; }

  const data = event.data?.json() ?? {};
  const title   = data.title   ?? '技能交換';
  const options = {
    body:    data.body   ?? '你有新的配對通知',
    icon:    '/icon-192.png',
    badge:   '/icon-192.png',
    vibrate: [100, 50, 100],
    data:    { url: data.url ?? '/' },
    actions: [
      { action: 'view',    title: '查看' },
      { action: 'dismiss', title: '稍後' },
    ],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  const url = event.notification.data?.url ?? '/';
  event.waitUntil(clients.openWindow(url));
});
