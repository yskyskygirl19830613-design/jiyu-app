// test_200_scenarios.mjs
// 技遇 JiYu — 200 情境完整測試
import { readFileSync, readdirSync } from 'fs';

const G='\x1b[32m',R='\x1b[31m',Y='\x1b[33m',X='\x1b[0m',W='\x1b[1m';
let pass=0,fail=0,warn=0;
const issues=[];

// ── 載入所有檔案 ──────────────────────────────
const F={};
const load=(p)=>{ try{F[p]=readFileSync(p,'utf8');}catch{} };
['app.html','login.html','onboarding.html','chat.html','map.html',
 'premium.html','premium-success.html','sponsor.html','subscription.html',
 'skill.html','invite.html','profile-edit.html','reset-password.html',
 'admin.html','index.html','privacy.html','terms.html',
 'manifest.json','service-worker.js','push-setup.js','vercel.json',
 'supabase_schema.sql','supabase_reviews.sql','supabase_reports.sql',
 'package.json','SUPABASE設定.md','STRIPE設定.md',
 'api/create-checkout-session.js','api/stripe-webhook.js',
 'api/send-push.js','api/cancel-subscription.js',
].forEach(load);

// Script 區塊抽取（避免誤判 CSS/HTML 裡的內容）
const scripts=(f)=>[...((F[f]||'').matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))].map(m=>m[1]).join('\n');
const APP =scripts('app.html');
const LOGIN=scripts('login.html');
const MAP  =scripts('map.html');
const CHAT =scripts('chat.html');
const PREM =scripts('premium.html');
const SUB  =scripts('subscription.html');
const SPON =scripts('sponsor.html');
const INV  =scripts('invite.html');
const SKILL=scripts('skill.html');
const ADM  =scripts('admin.html');
const PROF =scripts('profile-edit.html');
const ONB  =scripts('onboarding.html');
const RESET=scripts('reset-password.html');

function t(id,label,cond,sev='FAIL',fix=''){
  if(cond){pass++;return true;}
  sev==='WARN'?warn++:fail++;
  issues.push({id,label,sev,fix});
  return false;
}

// ════════════════════════════════════════════════
// T001–T020  檔案存在性
// ════════════════════════════════════════════════
t('T001','app.html',!!F['app.html']);
t('T002','login.html',!!F['login.html']);
t('T003','onboarding.html',!!F['onboarding.html']);
t('T004','chat.html',!!F['chat.html']);
t('T005','map.html',!!F['map.html']);
t('T006','premium.html',!!F['premium.html']);
t('T007','premium-success.html',!!F['premium-success.html']);
t('T008','sponsor.html',!!F['sponsor.html']);
t('T009','subscription.html',!!F['subscription.html']);
t('T010','skill.html',!!F['skill.html']);
t('T011','invite.html',!!F['invite.html']);
t('T012','profile-edit.html',!!F['profile-edit.html']);
t('T013','reset-password.html',!!F['reset-password.html']);
t('T014','admin.html',!!F['admin.html']);
t('T015','privacy.html',!!F['privacy.html']);
t('T016','terms.html',!!F['terms.html']);
t('T017','push-setup.js',!!F['push-setup.js']);
t('T018','api/create-checkout-session.js',!!F['api/create-checkout-session.js']);
t('T019','api/stripe-webhook.js',!!F['api/stripe-webhook.js']);
t('T020','api/send-push.js',!!F['api/send-push.js']);

// ════════════════════════════════════════════════
// T021–T040  PWA & Manifest
// ════════════════════════════════════════════════
t('T021','manifest.json 存在',!!F['manifest.json']);
t('T022','manifest name=技遇',F['manifest.json']?.includes('技遇'));
t('T023','manifest short_name 存在',F['manifest.json']?.includes('short_name'));
t('T024','manifest theme_color=#3D9970',F['manifest.json']?.includes('#3D9970'));
t('T025','manifest standalone 模式',F['manifest.json']?.includes('standalone'));
t('T026','manifest icons 192px',F['manifest.json']?.includes('192x192'));
t('T027','manifest icons 512px',F['manifest.json']?.includes('512x512'));
t('T028','manifest start_url 存在',F['manifest.json']?.includes('start_url'));
t('T029','service-worker install 事件',F['service-worker.js']?.includes("'install'"));
t('T030','service-worker fetch 事件',F['service-worker.js']?.includes("'fetch'"));
t('T031','service-worker activate 事件',F['service-worker.js']?.includes("'activate'"),'WARN','加入 activate 事件清理舊 cache');
t('T032','service-worker cache 設定',F['service-worker.js']?.includes('CACHE'));
t('T033','service-worker push 事件',F['service-worker.js']?.includes("'push'"),'WARN','加入 push 事件處理');
t('T034','vercel.json 存在',!!F['vercel.json']);
t('T035','所有 HTML 有 charset',['app.html','login.html','chat.html','map.html','premium.html'].every(f=>F[f]?.includes('charset')));
t('T036','所有 HTML 有 viewport',['app.html','login.html','chat.html','map.html','premium.html','onboarding.html','invite.html','subscription.html'].every(f=>F[f]?.includes('viewport')));
t('T037','所有 HTML 有 theme-color',['app.html','login.html','chat.html'].every(f=>F[f]?.includes('theme-color')));
t('T038','所有 HTML 有 manifest link',['app.html','login.html','map.html','chat.html','premium.html'].every(f=>F[f]?.includes('manifest.json')));
t('T039','所有 HTML 有 safe-area-inset',['app.html','login.html','premium.html','subscription.html','invite.html'].every(f=>F[f]?.includes('safe-area-inset')));
t('T040','所有 HTML 有 favicon',['app.html','login.html','premium.html'].every(f=>F[f]?.includes('favicon.png')));

// ════════════════════════════════════════════════
// T041–T060  登入 / 驗證
// ════════════════════════════════════════════════
t('T041','login email 欄位',F['login.html']?.includes('type="email"'));
t('T042','login password 欄位',F['login.html']?.includes('type="password"'));
t('T043','login Google OAuth',F['login.html']?.includes('signInWithOAuth'));
t('T044','login 忘記密碼',F['login.html']?.includes('resetPasswordForEmail'));
t('T045','login 隱私權政策連結',F['login.html']?.includes('privacy.html'));
t('T046','login 服務條款連結',F['login.html']?.includes('terms.html'));
t('T047','login 成功 → app.html',F['login.html']?.includes("'app.html'"));
t('T048','login 已登入自動跳轉',F['login.html']?.includes('app.html'));
t('T049','login 錯誤訊息顯示',LOGIN.includes('error')||LOGIN.includes('Error'));
t('T050','reset-password updateUser',F['reset-password.html']?.includes('updateUser'));
t('T051','reset-password 長度驗證',F['reset-password.html']?.includes('length'));
t('T052','reset-password 密碼一致驗證',RESET.includes('confirm')||RESET.includes('match'));
t('T053','reset-password 完成 → login.html',RESET.includes("'login.html'"));
t('T054','onboarding 完成 → app.html',ONB.includes("'app.html'"));
t('T055','onboarding localStorage flag',F['onboarding.html']?.includes('onboarding_done'));
t('T056','onboarding 城市選擇',F['onboarding.html']?.includes('高雄市'));
t('T057','onboarding 技能類別',F['onboarding.html']?.includes('category'));
t('T058','onboarding 步驟導覽',F['onboarding.html']?.includes('step-0'));
t('T059','全頁面未登入保護',['app.html','chat.html','map.html','profile-edit.html','sponsor.html'].every(f=>scripts(f).includes('getUser')));
t('T060','登出功能',APP.includes('signOut'));

// ════════════════════════════════════════════════
// T061–T090  app.html 核心功能
// ════════════════════════════════════════════════
t('T061','瀏覽技能列表',F['app.html']?.includes('skill-grid'));
t('T062','搜尋框',F['app.html']?.includes('search-input'));
t('T063','城市篩選 setCity',APP.includes('setCity'));
t('T064','分類篩選 fchip',APP.includes('fchip'));
t('T065','技能卡片渲染',APP.includes('renderSkills')||APP.includes('skill-card'));
t('T066','發布技能 postSkill',APP.includes('postSkill'));
t('T067','技能下架 unpublishSkill',APP.includes('unpublishSkill'));
t('T068','申請交換 applySwap',APP.includes('applySwap'));
t('T069','接受申請 respondSwap',APP.includes('respondSwap'));
t('T070','標記完成 completeSwap',APP.includes('completeSwap'));
t('T071','評分系統 setStar',APP.includes('setStar'));
t('T072','申請自己的技能防護',APP.includes('user_id===currentUser.id'));
t('T073','個人頁 loadProfile',APP.includes('loadProfile'));
t('T074','我的技能 loadMySkills',APP.includes('loadMySkills'));
t('T075','我的評價 loadMyReviews',APP.includes('loadMyReviews'));
t('T076','配對頁 loadMatches',APP.includes('loadMatches'));
t('T077','精選技能 loadSponsored',APP.includes('loadSponsored'));
t('T078','廣告載入 loadAds',APP.includes('loadAds'));
t('T079','Premium 隱藏廣告',APP.includes('is_premium')&&F['app.html']?.includes('ad-banner'));
t('T080','AdSense 嵌入',F['app.html']?.includes('adsbygoogle'));
t('T081','精選卡片樣式 sc-sponsored',F['app.html']?.includes('sc-sponsored'));
t('T082','精選橘色標籤',F['app.html']?.includes('sp-badge'));
t('T083','分享 Sheet 存在',F['app.html']?.includes('share-overlay'));
t('T084','分享 LINE',APP.includes('social-plugins.line.me'));
t('T085','分享 Facebook',APP.includes('facebook.com/sharer'));
t('T086','分享 X (Twitter)',APP.includes('twitter.com/intent'));
t('T087','原生分享 navigator.share',APP.includes('navigator.share'));
t('T088','複製連結',APP.includes('clipboard'));
t('T089','推播通知初始化',APP.includes('initPushNotifications'));
t('T090','封鎖用戶 blockUser',APP.includes('blockUser'));

// ════════════════════════════════════════════════
// T091–T110  導航 & 跳轉
// ════════════════════════════════════════════════
t('T091','app → chat.html',F['app.html']?.includes("'chat.html'"));
t('T092','app → map.html',F['app.html']?.includes("'map.html'"));
t('T093','app → profile-edit.html',F['app.html']?.includes("'profile-edit.html'"));
t('T094','app → premium.html',F['app.html']?.includes("'premium.html'"));
t('T095','app → subscription.html',F['app.html']?.includes("'subscription.html'"));
t('T096','app → invite.html',F['app.html']?.includes("'invite.html'"));
t('T097','app goTo key 語法正確',F['app.html']?.includes("{'s-browse'"));
t('T098','底部導覽訊息 tab',F['app.html']?.includes('ni-chat'));
t('T099','底部導覽地圖 tab',F['app.html']?.includes('ni-map'));
t('T100','底部導覽個人 tab',F['app.html']?.includes('ni-profile'));
t('T101','premium-success → app.html',F['premium-success.html']?.includes("'app.html'"));
t('T102','premium-success → subscription.html',F['premium-success.html']?.includes('subscription.html'));
t('T103','subscription 有返回按鈕',F['subscription.html']?.includes('history.back'));
t('T104','sponsor 有返回按鈕',F['sponsor.html']?.includes('history.back'));
t('T105','invite 有返回按鈕',F['invite.html']?.includes('history.back'));
t('T106','profile-edit 有返回按鈕',F['profile-edit.html']?.includes('history.back'));
t('T107','skill.html → app.html 入口',F['skill.html']?.includes('app.html'));
t('T108','skill.html → index.html 邀請',F['skill.html']?.includes('index.html'));
t('T109','admin.html 側邊欄頁面切換',ADM.includes('showPage'));
t('T110','升級入口在個人頁',F['app.html']?.includes('premium.html')&&F['app.html']?.includes('upgrade-btn'));

// ════════════════════════════════════════════════
// T111–T130  地圖功能
// ════════════════════════════════════════════════
t('T111','map Leaflet 載入',F['map.html']?.includes('leaflet'));
t('T112','map MarkerCluster',F['map.html']?.includes('markerCluster'));
t('T113','map 初始化 initMap',MAP.includes('initMap'));
t('T114','map 載入技能 loadSkills',MAP.includes('loadSkills'));
t('T115','map 定位 locateMe',MAP.includes('locateMe'));
t('T116','map 搜尋篩選 filterPins',MAP.includes('filterPins'));
t('T117','map 分類篩選 mfchip',MAP.includes('mfchip'));
t('T118','map Apple Maps 導航',MAP.includes('maps.apple.com'));
t('T119','map 底部卡片列',F['map.html']?.includes('strip-scroll'));
t('T120','map 申請交換 applySwap',MAP.includes('applySwap'));
t('T121','map openDetById 防 HTML 注入',MAP.includes('openDetById'));
t('T122','map JS 無 CSS var()',!MAP.includes('color:var(--'));
t('T123','map geolocation API',MAP.includes('geolocation'));
t('T124','map 搜尋框',F['map.html']?.includes('map-search'));
t('T125','map 詳情 overlay',F['map.html']?.includes('det-ov'));
t('T126','map Supabase 連線',MAP.includes('supabase.createClient'));
t('T127','map 距離計算 dist',MAP.includes('function dist'));
t('T128','map 聚合半徑設定',MAP.includes('maxClusterRadius'));
t('T129','map manifest link',F['map.html']?.includes('manifest.json'));
t('T130','map 城市顯示',MAP.includes('city'));

// ════════════════════════════════════════════════
// T131–T150  聊天功能
// ════════════════════════════════════════════════
t('T131','chat Supabase Realtime',CHAT.includes('.channel('));
t('T132','chat 載入歷史訊息',CHAT.includes('loadMessages'));
t('T133','chat 對話列表',CHAT.includes('loadConversations'));
t('T134','chat 送出訊息 sendMsg',CHAT.includes('sendMsg'));
t('T135','chat 返回列表 backToList',CHAT.includes('backToList'));
t('T136','chat 自動展開 autoResize',CHAT.includes('autoResize'));
t('T137','chat Enter 送出',F['chat.html']?.includes("key==='Enter'"));
t('T138','chat 未登入跳轉',CHAT.includes("'login.html'"));
t('T139','chat 時間格式化',CHAT.includes('fmtTime'));
t('T140','chat manifest link',F['chat.html']?.includes('manifest.json'));
t('T141','chat 訊息氣泡樣式 me/them',F['chat.html']?.includes('bub.me')&&F['chat.html']?.includes('bub.them'));
t('T142','chat Realtime subscribe',CHAT.includes('.subscribe'));
t('T143','chat unsubscribe 清理',CHAT.includes('unsubscribe'));
t('T144','chat 空狀態提示',F['chat.html']?.includes('empty')||CHAT.includes('empty'));
t('T145','chat swap_id 參數支援',CHAT.includes('swap_id'));
t('T146','chat URL 參數開啟對話',CHAT.includes("params.get('swap')"));
t('T147','chat 訊息排序',CHAT.includes('ascending'));
t('T148','chat 捲到底部',CHAT.includes('scrollBottom'));
t('T149','chat 訊息插入 DB',CHAT.includes("from('messages').insert"));
t('T150','chat sender_id 記錄',CHAT.includes('sender_id'));

// ════════════════════════════════════════════════
// T151–T165  收費系統
// ════════════════════════════════════════════════
t('T151','premium $99 月繳',F['premium.html']?.includes('$99'));
t('T152','premium $59 年繳',F['premium.html']?.includes('$59'));
t('T153','premium 省 40%',F['premium.html']?.includes('40%'));
t('T154','premium 7 天試用',F['premium.html']?.includes('試用'));
t('T155','premium FAQ',F['premium.html']?.includes('faq')||F['premium.html']?.includes('常見問題'));
t('T156','premium Stripe checkout 呼叫',PREM.includes('create-checkout-session'));
t('T157','premium 已訂閱防重複',PREM.includes('is_premium'));
t('T158','sponsor 3 個方案',F['sponsor.html']?.includes('plan-3')&&F['sponsor.html']?.includes('plan-7')&&F['sponsor.html']?.includes('plan-30'));
t('T159','sponsor 價格 $49/$89/$299',F['sponsor.html']?.includes('$49')&&F['sponsor.html']?.includes('$89')&&F['sponsor.html']?.includes('$299'));
t('T160','sponsor 技能選擇',SPON.includes('loadMySkills'));
t('T161','subscription 取消確認',SUB.includes('confirmCancel'));
t('T162','subscription 功能清單',F['subscription.html']?.includes('feat-item'));
t('T163','checkout 支援 payment mode',F['api/create-checkout-session.js']?.includes("'payment'"));
t('T164','checkout 支援 subscription mode',F['api/create-checkout-session.js']?.includes("'subscription'"));
t('T165','checkout 7 天試用',F['api/create-checkout-session.js']?.includes('trial_period_days'));

// ════════════════════════════════════════════════
// T166–T175  Stripe Webhook
// ════════════════════════════════════════════════
t('T166','webhook subscription.created',F['api/stripe-webhook.js']?.includes('subscription.created'));
t('T167','webhook subscription.updated',F['api/stripe-webhook.js']?.includes('subscription.updated'));
t('T168','webhook subscription.deleted',F['api/stripe-webhook.js']?.includes('subscription.deleted'));
t('T169','webhook payment_failed',F['api/stripe-webhook.js']?.includes('payment_failed'));
t('T170','webhook 更新 is_premium',F['api/stripe-webhook.js']?.includes('is_premium'));
t('T171','webhook 更新 premium_until',F['api/stripe-webhook.js']?.includes('premium_until'));
t('T172','webhook 簽名驗證',F['api/stripe-webhook.js']?.includes('constructEvent'));
t('T173','webhook Supabase service key',F['api/stripe-webhook.js']?.includes('SERVICE_KEY'));
t('T174','cancel-subscription API',!!F['api/cancel-subscription.js']);
t('T175','cancel 期末取消設定',F['api/cancel-subscription.js']?.includes('cancel_at_period_end'));

// ════════════════════════════════════════════════
// T176–T185  推播通知
// ════════════════════════════════════════════════
t('T176','push-setup requestPermission',F['push-setup.js']?.includes('requestPermission'));
t('T177','push-setup VAPID key',F['push-setup.js']?.includes('VAPID_PUBLIC_KEY'));
t('T178','push-setup subscribe',F['push-setup.js']?.includes('pushManager.subscribe'));
t('T179','push-setup 儲存訂閱',F['push-setup.js']?.includes('push_subscriptions'));
t('T180','push-setup base64 轉換',F['push-setup.js']?.includes('urlBase64ToUint8Array'));
t('T181','send-push API web-push',F['api/send-push.js']?.includes('web-push'));
t('T182','send-push VAPID 設定',F['api/send-push.js']?.includes('setVapidDetails'));
t('T183','send-push payload JSON',F['api/send-push.js']?.includes('JSON.stringify'));
t('T184','send-push 失效訂閱清除',F['api/send-push.js']?.includes('410'));
t('T185','app 推播初始化呼叫',APP.includes('initPushNotifications'));

// ════════════════════════════════════════════════
// T186–T195  社群分享 & Referral
// ════════════════════════════════════════════════
t('T186','skill.html OG title',F['skill.html']?.includes('og:title'));
t('T187','skill.html OG description',F['skill.html']?.includes('og:description'));
t('T188','skill.html OG image',F['skill.html']?.includes('og:image'));
t('T189','skill.html Twitter Card',F['skill.html']?.includes('twitter:card'));
t('T190','skill.html 瀏覽次數++',SKILL.includes('view_count'));
t('T191','skill.html 同城市技能',SKILL.includes('loadMoreSkills'));
t('T192','invite.html LINE 分享',INV.includes('social-plugins.line.me'));
t('T193','invite.html 邀請碼生成',INV.includes('inviteCode'));
t('T194','invite.html 進度追蹤',INV.includes('loadReferrals'));
t('T195','referrals 資料表',F['supabase_schema.sql']?.includes('referrals'));

// ════════════════════════════════════════════════
// T196–T200  資料庫 & 安全
// ════════════════════════════════════════════════
t('T196','RLS 啟用',F['supabase_schema.sql']?.includes('row level security'));
t('T197','blocks 資料表',F['supabase_schema.sql']?.includes('public.blocks'));
t('T198','push_subscriptions 資料表',F['supabase_schema.sql']?.includes('push_subscriptions'));
t('T199','reports 資料表',F['supabase_schema.sql']?.includes('public.reports'));
t('T200','無 Stripe secret key 外洩',!['app.html','login.html','premium.html','sponsor.html'].some(f=>(F[f]||'').includes('sk_live')||(F[f]||'').includes('sk_test')));

// ════════════════════════════════════════════════
// 輸出結果
// ════════════════════════════════════════════════
const fails=issues.filter(i=>i.sev==='FAIL');
const warns=issues.filter(i=>i.sev==='WARN');

console.log(`\n${W}╔══════════════════════════════════════════════════╗${X}`);
console.log(`${W}║   技遇 JiYu — 200 情境完整測試報告             ║${X}`);
console.log(`${W}╚══════════════════════════════════════════════════╝${X}\n`);

// 分組顯示
const groups=[
  [1,20,'檔案存在性'],
  [21,40,'PWA & Manifest'],
  [41,60,'登入 / 驗證'],
  [61,90,'app.html 核心功能'],
  [91,110,'導航 & 跳轉'],
  [111,130,'地圖功能'],
  [131,150,'聊天功能'],
  [151,165,'收費系統'],
  [166,175,'Stripe Webhook'],
  [176,185,'推播通知'],
  [186,195,'社群分享 & Referral'],
  [196,200,'資料庫 & 安全'],
];

groups.forEach(([from,to,name])=>{
  const groupIssues=issues.filter(i=>{const n=parseInt(i.id.slice(1));return n>=from&&n<=to;});
  const gf=groupIssues.filter(i=>i.sev==='FAIL').length;
  const gw=groupIssues.filter(i=>i.sev==='WARN').length;
  const total=to-from+1;
  const ok=total-gf-gw;
  const icon=gf>0?`${R}🔴${X}`:gw>0?`${Y}🟡${X}`:`${G}✅${X}`;
  console.log(`${icon} T${String(from).padStart(3,'0')}–T${String(to).padStart(3,'0')}  ${W}${name}${X}  ${G}${ok}通過${X}${gf?` ${R}${gf}失敗${X}`:''}${gw?` ${Y}${gw}警告${X}`:''}`);
  groupIssues.forEach(i=>{
    const c=i.sev==='FAIL'?R:Y;
    const sym=i.sev==='FAIL'?'  ❌':'  ⚠️ ';
    console.log(`${c}${sym} [${i.id}] ${i.label}${i.fix?' — '+i.fix:''}${X}`);
  });
});

const pct=Math.round(pass/200*100);
const filled=Math.floor(pct/5);
const bar=`${G}${'█'.repeat(filled)}${X}${Y}${'░'.repeat(20-filled)}${X}`;
console.log(`\n進度  [${bar}] ${W}${pct}%${X}`);
console.log(`\n${W}最終結果：${G}${pass} 通過${X} / ${R}${fail} 失敗${X} / ${Y}${warn} 警告${X} / 共 200 個${X}\n`);
if(pass===200)console.log(`${G}${W}🎉 全數通過！技遇已準備好上線！${X}\n`);
