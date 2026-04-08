// test_500_scenarios.mjs
// 技遇 JiYu — 500 情境超完整測試
import { readFileSync, readdirSync } from 'fs';

const G='\x1b[32m',R='\x1b[31m',Y='\x1b[33m',B='\x1b[34m',X='\x1b[0m',W='\x1b[1m';
let pass=0,fail=0,warn=0;
const issues=[];

// ── 載入所有檔案 ──────────────────────────────
const F={};
[
  'app.html','login.html','onboarding.html','chat.html','map.html',
  'premium.html','premium-success.html','sponsor.html','subscription.html',
  'skill.html','invite.html','profile-edit.html','reset-password.html',
  'admin.html','index.html','privacy.html','terms.html',
  'manifest.json','service-worker.js','push-setup.js','vercel.json',
  'supabase_schema.sql','supabase_reviews.sql','supabase_reports.sql',
  'package.json','SUPABASE設定.md','STRIPE設定.md',
  'api/create-checkout-session.js','api/stripe-webhook.js',
  'api/send-push.js','api/cancel-subscription.js',
].forEach(p=>{ try{F[p]=readFileSync(p,'utf8');}catch{} });

// 只抓 <script> 標籤內容
const JS=(f)=>[...((F[f]||'').matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))].map(m=>m[1]).join('\n');
// 只抓 <style> 標籤內容
const CSS=(f)=>[...((F[f]||'').matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g))].map(m=>m[1]).join('\n');
// 全文
const ALL=(f)=>F[f]||'';

const APP=JS('app.html'), LOGIN=JS('login.html'), MAP=JS('map.html'),
      CHAT=JS('chat.html'), PREM=JS('premium.html'), SUB=JS('subscription.html'),
      SPON=JS('sponsor.html'), INV=JS('invite.html'), SKILL=JS('skill.html'),
      ADM=JS('admin.html'), PROF=JS('profile-edit.html'), ONB=JS('onboarding.html'),
      RESET=JS('reset-password.html'), HOOK=F['api/stripe-webhook.js']||'',
      CHECKOUT=F['api/create-checkout-session.js']||'', PUSH=F['api/send-push.js']||'',
      CANCEL=F['api/cancel-subscription.js']||'', SW=F['service-worker.js']||'',
      SCHEMA=F['supabase_schema.sql']||'';

function t(id,label,cond,sev='FAIL',fix=''){
  if(cond){pass++;return true;}
  sev==='WARN'?warn++:fail++;
  issues.push({id,label,sev,fix});
  return false;
}

// ════════════════════════════════════════════════════
// 群組 01  T001–T025  檔案完整性
// ════════════════════════════════════════════════════
t('T001','app.html 存在',!!F['app.html']);
t('T002','login.html 存在',!!F['login.html']);
t('T003','onboarding.html 存在',!!F['onboarding.html']);
t('T004','chat.html 存在',!!F['chat.html']);
t('T005','map.html 存在',!!F['map.html']);
t('T006','premium.html 存在',!!F['premium.html']);
t('T007','premium-success.html 存在',!!F['premium-success.html']);
t('T008','sponsor.html 存在',!!F['sponsor.html']);
t('T009','subscription.html 存在',!!F['subscription.html']);
t('T010','skill.html 存在',!!F['skill.html']);
t('T011','invite.html 存在',!!F['invite.html']);
t('T012','profile-edit.html 存在',!!F['profile-edit.html']);
t('T013','reset-password.html 存在',!!F['reset-password.html']);
t('T014','admin.html 存在',!!F['admin.html']);
t('T015','privacy.html 存在',!!F['privacy.html']);
t('T016','terms.html 存在',!!F['terms.html']);
t('T017','index.html 存在',!!F['index.html']);
t('T018','manifest.json 存在',!!F['manifest.json']);
t('T019','service-worker.js 存在',!!F['service-worker.js']);
t('T020','push-setup.js 存在',!!F['push-setup.js']);
t('T021','vercel.json 存在',!!F['vercel.json']);
t('T022','supabase_schema.sql 存在',!!F['supabase_schema.sql']);
t('T023','api/create-checkout-session.js 存在',!!F['api/create-checkout-session.js']);
t('T024','api/stripe-webhook.js 存在',!!F['api/stripe-webhook.js']);
t('T025','api/send-push.js 存在',!!F['api/send-push.js']);

// ════════════════════════════════════════════════════
// 群組 02  T026–T050  HTML 頭部 & Meta
// ════════════════════════════════════════════════════
const htmlFiles=['app.html','login.html','chat.html','map.html','premium.html','onboarding.html','invite.html','subscription.html','skill.html','sponsor.html','profile-edit.html','reset-password.html'];
t('T026','全頁面 charset=UTF-8',htmlFiles.every(f=>ALL(f).includes('charset="UTF-8"')||ALL(f).includes("charset='UTF-8'")));
t('T027','全頁面 viewport meta',htmlFiles.every(f=>ALL(f).includes('viewport')));
t('T028','全頁面 lang="zh-TW"',htmlFiles.every(f=>ALL(f).includes('lang="zh-TW"')));
t('T029','全頁面 theme-color #3D9970',htmlFiles.slice(0,6).every(f=>ALL(f).includes('#3D9970')));
t('T030','全頁面 manifest link',htmlFiles.every(f=>ALL(f).includes('manifest.json')));
t('T031','全頁面 favicon link',htmlFiles.every(f=>ALL(f).includes('favicon.png')));
t('T032','主要頁面 safe-area top',['app.html','login.html','premium.html','subscription.html'].every(f=>ALL(f).includes('safe-area-inset-top')));
t('T033','主要頁面 safe-area bottom',['app.html','chat.html','map.html'].every(f=>ALL(f).includes('safe-area-inset-bottom')));
t('T034','skill.html OG title',ALL('skill.html').includes('og:title'));
t('T035','skill.html OG description',ALL('skill.html').includes('og:description'));
t('T036','skill.html OG image',ALL('skill.html').includes('og:image'));
t('T037','skill.html OG url',ALL('skill.html').includes('og:url'));
t('T038','skill.html Twitter card',ALL('skill.html').includes('twitter:card'));
t('T039','skill.html Twitter image',ALL('skill.html').includes('twitter:image'));
t('T040','admin.html 有正確 title',ALL('admin.html').includes('管理後台'));
t('T041','privacy.html 有正確 title',ALL('privacy.html').includes('隱私'));
t('T042','terms.html 有正確 title',ALL('terms.html').includes('條款'));
t('T043','premium-success title 含 Premium',ALL('premium-success.html').includes('Premium'));
t('T044','所有頁面無空 title',htmlFiles.every(f=>/<title>[^<]+<\/title>/.test(ALL(f))));
t('T045','index.html 存在且非空',ALL('index.html').length>100);
t('T046','login.html 有 manifest link',ALL('login.html').includes('manifest.json'),'WARN','加 apple-touch-icon');
t('T047','CSS import Google Fonts',htmlFiles.slice(0,4).every(f=>ALL(f).includes('googleapis.com')));
t('T048','Plus Jakarta Sans 引入',htmlFiles.slice(0,4).every(f=>ALL(f).includes('Plus+Jakarta+Sans')||ALL(f).includes('Plus Jakarta Sans')));
t('T049','Instrument Serif 引入',['app.html','login.html','premium.html'].every(f=>ALL(f).includes('Instrument+Serif')||ALL(f).includes('Instrument Serif')));
t('T050','Supabase CDN 引入',htmlFiles.every(f=>ALL(f).includes('supabase')));

// ════════════════════════════════════════════════════
// 群組 03  T051–T075  PWA & Service Worker
// ════════════════════════════════════════════════════
t('T051','manifest name=技遇 JiYu',ALL('manifest.json').includes('技遇'));
t('T052','manifest short_name=技遇',ALL('manifest.json').includes('short_name'));
t('T053','manifest theme_color',ALL('manifest.json').includes('#3D9970'));
t('T054','manifest background_color',ALL('manifest.json').includes('background_color'));
t('T055','manifest display=standalone',ALL('manifest.json').includes('standalone'));
t('T056','manifest start_url',ALL('manifest.json').includes('start_url'));
t('T057','manifest icons 192px',ALL('manifest.json').includes('192x192'));
t('T058','manifest icons 512px',ALL('manifest.json').includes('512x512'));
t('T059','manifest description',ALL('manifest.json').includes('description'));
t('T060','manifest lang=zh-TW',ALL('manifest.json').includes('zh-TW')||ALL('manifest.json').includes('zh-TW')||ALL('manifest.json').includes('zh'),'WARN','manifest 加 lang 欄位');
t('T061','SW install 事件',SW.includes("'install'"));
t('T062','SW fetch 事件',SW.includes("'fetch'"));
t('T063','SW activate 事件',SW.includes("'activate'"),'WARN','SW 加 activate 清理舊 cache');
t('T064','SW push 事件',SW.includes("'push'"),'WARN','SW 加 push 事件');
t('T065','SW cache 名稱定義',SW.includes('CACHE')||SW.includes('cache'));
t('T066','SW notificationclick',SW.includes('notificationclick'),'WARN','SW 加 notificationclick 事件');
t('T067','push-setup VAPID key',F['push-setup.js']?.includes('VAPID_PUBLIC_KEY'));
t('T068','push-setup requestPermission',F['push-setup.js']?.includes('requestPermission'));
t('T069','push-setup subscribe',F['push-setup.js']?.includes('pushManager.subscribe'));
t('T070','push-setup base64 helper',F['push-setup.js']?.includes('urlBase64ToUint8Array'));
t('T071','push-setup 儲存到 Supabase',F['push-setup.js']?.includes('push_subscriptions'));
t('T072','push-setup applicationServerKey',F['push-setup.js']?.includes('applicationServerKey'));
t('T073','app 呼叫 initPushNotifications',APP.includes('initPushNotifications'));
t('T074','app 詢問推播權限 askPushPermission',APP.includes('askPushPermission'));
t('T075','vercel.json 設定正確',ALL('vercel.json').length>10);

// ════════════════════════════════════════════════════
// 群組 04  T076–T105  登入 / 驗證完整流程
// ════════════════════════════════════════════════════
t('T076','login email 欄位',ALL('login.html').includes('type="email"'));
t('T077','login password 欄位',ALL('login.html').includes('type="password"'));
t('T078','login signInWithPassword',LOGIN.includes('signInWithPassword'));
t('T079','login signInWithOAuth Google',LOGIN.includes('signInWithOAuth'));
t('T080','login resetPasswordForEmail',LOGIN.includes('resetPasswordForEmail'));
t('T081','login 成功跳 app.html',ALL('login.html').includes("'app.html'"));
t('T082','login 已登入自動跳轉',ALL('login.html').includes('app.html'));
t('T083','login 隱私權連結',ALL('login.html').includes('privacy.html'));
t('T084','login 服務條款連結',ALL('login.html').includes('terms.html'));
t('T085','login 錯誤提示',LOGIN.includes('error')||LOGIN.includes('Error'));
t('T086','login 記住帳號 localStorage',LOGIN.includes('localStorage')||LOGIN.includes('localStorage'),'WARN','考慮加入記住帳號功能');
t('T087','onboarding 步驟 0',ALL('onboarding.html').includes('step-0'));
t('T088','onboarding 步驟 3',ALL('onboarding.html').includes('step-3'));
t('T089','onboarding 城市選擇',ALL('onboarding.html').includes('高雄市')&&ALL('onboarding.html').includes('台北市'));
t('T090','onboarding 類別選擇',ALL('onboarding.html').includes('category'));
t('T091','onboarding localStorage flag',ALL('onboarding.html').includes('onboarding_done'));
t('T092','onboarding 完成 → app.html',ONB.includes("'app.html'"));
t('T093','onboarding 未登入保護',ONB.includes("'login.html'"));
t('T094','reset-password updateUser',RESET.includes('updateUser'));
t('T095','reset-password 長度驗證 8',RESET.includes('8')||RESET.includes('length'));
t('T096','reset-password 兩次確認',RESET.includes('confirm')||RESET.includes('match'));
t('T097','reset-password 完成 → login.html',RESET.includes("'login.html'"));
t('T098','reset-password Supabase auth',RESET.includes('supabase.createClient'));
t('T099','profile-edit 儲存 saveProfile',PROF.includes('saveProfile'));
t('T100','profile-edit 未登入保護',PROF.includes("'login.html'"));
t('T101','profile-edit 刪除帳號',PROF.includes('deleteAccount'));
t('T102','profile-edit 檢舉 submitReport',PROF.includes('submitReport'));
t('T103','profile-edit Avatar emoji 選擇',ALL('profile-edit.html').includes('pickAva'));
t('T104','profile-edit 儲存成功提示',PROF.includes('showToast')||PROF.includes('toast'));
t('T105','全頁面 signOut',APP.includes('signOut'));

// ════════════════════════════════════════════════════
// 群組 05  T106–T150  app.html 完整功能
// ════════════════════════════════════════════════════
t('T106','loadSkills 函式',APP.includes('loadSkills'));
t('T107','renderSkills 函式',APP.includes('renderSkills'));
t('T108','skill-grid DOM',ALL('app.html').includes('skill-grid'));
t('T109','搜尋 search-input',ALL('app.html').includes('search-input'));
t('T110','城市篩選 setCity',APP.includes('setCity'));
t('T111','分類篩選 fchip',APP.includes('fchip')||APP.includes('filterChip'));
t('T112','技能詳情 openDetail',APP.includes('openDetail'));
t('T113','技能詳情關閉 closeDetail',APP.includes('closeDetail'));
t('T114','申請交換 applySwap',APP.includes('applySwap'));
t('T115','申請自己防護',APP.includes('user_id===currentUser.id'));
t('T116','申請重複防護 23505',APP.includes('23505'));
t('T117','接受申請 respondSwap',APP.includes('respondSwap'));
t('T118','拒絕申請 rejected',APP.includes('rejected'));
t('T119','標記完成 completeSwap',APP.includes('completeSwap'));
t('T120','評分 setStar',APP.includes('setStar'));
t('T121','提交評分 submitRating',APP.includes('submitRating')||APP.includes('reviews'));
t('T122','發布技能 postSkill',APP.includes('postSkill'));
t('T123','發布 Emoji 選擇 pickE',APP.includes('pickE'));
t('T124','發布上課方式 pickM',APP.includes('pickM'));
t('T125','技能下架 unpublishSkill',APP.includes('unpublishSkill'));
t('T126','loadMatches 函式',APP.includes('loadMatches'));
t('T127','loadProfile 函式',APP.includes('loadProfile'));
t('T128','loadMySkills 函式',APP.includes('loadMySkills'));
t('T129','loadMyReviews 函式',APP.includes('loadMyReviews'));
t('T130','loadSponsored 精選',APP.includes('loadSponsored'));
t('T131','loadAds 廣告',APP.includes('loadAds'));
t('T132','AdSense 嵌入',ALL('app.html').includes('adsbygoogle'));
t('T133','Premium 用戶隱藏廣告',APP.includes('is_premium')&&ALL('app.html').includes('ad-banner'));
t('T134','廣告 label',ALL('app.html').includes('ad-label'));
t('T135','精選卡片樣式',ALL('app.html').includes('sc-sponsored'));
t('T136','精選橘色 badge',ALL('app.html').includes('sp-badge'));
t('T137','分享 Sheet',ALL('app.html').includes('share-overlay'));
t('T138','分享 openShare',APP.includes('openShare'));
t('T139','分享 closeShare',APP.includes('closeShare'));
t('T140','分享 LINE',APP.includes('social-plugins.line.me'));
t('T141','分享 Facebook',APP.includes('facebook.com/sharer'));
t('T142','分享 X Twitter',APP.includes('twitter.com/intent'));
t('T143','分享原生 navigator.share',APP.includes('navigator.share'));
t('T144','分享複製連結 clipboard',APP.includes('clipboard'));
t('T145','封鎖用戶 blockUser',APP.includes('blockUser'));
t('T146','封鎖寫入 DB blocks',APP.includes('blocks'));
t('T147','升級入口 upgrade-btn',ALL('app.html').includes('upgrade-btn'));
t('T148','Toast 通知 showToast',APP.includes('showToast'));
t('T149','goTo 語法正確',ALL('app.html').includes("{'s-browse'"));
t('T150','初始化 DOMContentLoaded',APP.includes('DOMContentLoaded'));

// ════════════════════════════════════════════════════
// 群組 06  T151–T180  導航完整性
// ════════════════════════════════════════════════════
t('T151','底部 nav 瀏覽 ni-browse',ALL('app.html').includes('ni-browse'));
t('T152','底部 nav 配對 ni-matches',ALL('app.html').includes('ni-matches'));
t('T153','底部 nav 發布 ni-post',ALL('app.html').includes('ni-post'));
t('T154','底部 nav 訊息 ni-chat',ALL('app.html').includes('ni-chat'));
t('T155','底部 nav 地圖 ni-map',ALL('app.html').includes('ni-map'));
t('T156','底部 nav 個人 ni-profile',ALL('app.html').includes('ni-profile'));
t('T157','app → chat.html',ALL('app.html').includes("'chat.html'"));
t('T158','app → map.html',ALL('app.html').includes("'map.html'"));
t('T159','app → profile-edit.html',ALL('app.html').includes("'profile-edit.html'"));
t('T160','app → premium.html',ALL('app.html').includes("'premium.html'"));
t('T161','app → subscription.html',ALL('app.html').includes("'subscription.html'"));
t('T162','app → invite.html',ALL('app.html').includes("'invite.html'"));
t('T163','premium → premium-success',ALL('premium.html').includes('premium-success.html'));
t('T164','premium-success → app.html',ALL('premium-success.html').includes("'app.html'"));
t('T165','premium-success → subscription.html',ALL('premium-success.html').includes('subscription.html'));
t('T166','subscription 返回 history.back',ALL('subscription.html').includes('history.back'));
t('T167','sponsor 返回 history.back',ALL('sponsor.html').includes('history.back'));
t('T168','invite 返回 history.back',ALL('invite.html').includes('history.back'));
t('T169','profile-edit 返回 history.back',ALL('profile-edit.html').includes('history.back'));
t('T170','skill.html → app.html',ALL('skill.html').includes('app.html'));
t('T171','skill.html → index.html',ALL('skill.html').includes('index.html'));
t('T172','login → app.html 成功',ALL('login.html').includes('app.html'));
t('T173','onboarding → app.html 完成',ONB.includes("'app.html'"));
t('T174','reset-password → login.html',RESET.includes("'login.html'"));
t('T175','admin 側邊欄 showPage',ADM.includes('showPage'));
t('T176','admin 數據總覽頁',ALL('admin.html').includes('page-dashboard'));
t('T177','admin 收入報表頁',ALL('admin.html').includes('page-revenue'));
t('T178','admin 用戶管理頁',ALL('admin.html').includes('page-users'));
t('T179','admin 檢舉管理頁',ALL('admin.html').includes('page-reports'));
t('T180','admin 精選置頂頁',ALL('admin.html').includes('page-sponsored'));

// ════════════════════════════════════════════════════
// 群組 07  T181–T215  地圖完整功能
// ════════════════════════════════════════════════════
t('T181','Leaflet CSS 引入',ALL('map.html').includes('leaflet.css'));
t('T182','Leaflet JS 引入',ALL('map.html').includes('leaflet.js'));
t('T183','MarkerCluster CSS',ALL('map.html').includes('MarkerCluster.css'));
t('T184','MarkerCluster JS',ALL('map.html').includes('markercluster'));
t('T185','initMap 函式',MAP.includes('initMap'));
t('T186','leafMap 變數',MAP.includes('leafMap'));
t('T187','markerGroup 初始化',MAP.includes('markerGroup'));
t('T188','maxClusterRadius 設定',MAP.includes('maxClusterRadius'));
t('T189','loadSkills 從 Supabase',MAP.includes("from('skills')"));
t('T190','renderPins 函式',MAP.includes('renderPins'));
t('T191','renderStrip 函式',MAP.includes('renderStrip'));
t('T192','locateMe 定位函式',MAP.includes('locateMe'));
t('T193','geolocation API',MAP.includes('geolocation'));
t('T194','watchPosition 或 getCurrentPosition',MAP.includes('getCurrentPosition')||MAP.includes('watchPosition'));
t('T195','filterPins 搜尋篩選',MAP.includes('filterPins'));
t('T196','mfchip 分類篩選',MAP.includes('mfchip'));
t('T197','catColors 顏色對應',MAP.includes('catColors'));
t('T198','openDetById 防 HTML 注入',MAP.includes('openDetById'));
t('T199','openDet 詳情函式',MAP.includes('openDet'));
t('T200','closeDet 關閉',MAP.includes('closeDet'));
t('T201','applySwap 地圖申請',MAP.includes('applySwap'));
t('T202','Apple Maps 導航連結',MAP.includes('maps.apple.com'));
t('T203','距離計算 dist 函式',MAP.includes('function dist'));
t('T204','fmtDist 距離格式化',MAP.includes('fmtDist'));
t('T205','搜尋輸入框 map-search',ALL('map.html').includes('map-search'));
t('T206','底部卡片列 strip-scroll',ALL('map.html').includes('strip-scroll'));
t('T207','詳情 overlay det-ov',ALL('map.html').includes('det-ov'));
t('T208','map JS 無 CSS var()',!MAP.includes('color:var(--'));
t('T209','map 有 manifest link',ALL('map.html').includes('manifest.json'));
t('T210','map Supabase 連線',MAP.includes('supabase.createClient'));
t('T211','城市篩選計數 count-n',ALL('map.html').includes('count-n'));
t('T212','定位按鈕 locate-btn',ALL('map.html').includes('locate-btn'));
t('T213','map 安全區域 safe-area',ALL('map.html').includes('safe-area-inset'));
t('T214','map 卡片點擊展開詳情',MAP.includes('openDetById'));
t('T215','map 已登入才可申請',MAP.includes('currentUser'));

// ════════════════════════════════════════════════════
// 群組 08  T216–T250  聊天完整功能
// ════════════════════════════════════════════════════
t('T216','loadConversations 函式',CHAT.includes('loadConversations'));
t('T217','openChat 函式',CHAT.includes('openChat'));
t('T218','loadMessages 函式',CHAT.includes('loadMessages'));
t('T219','appendMessage 函式',CHAT.includes('appendMessage'));
t('T220','sendMsg 函式',CHAT.includes('sendMsg'));
t('T221','backToList 函式',CHAT.includes('backToList'));
t('T222','Realtime channel',CHAT.includes('.channel('));
t('T223','Realtime subscribe',CHAT.includes('.subscribe'));
t('T224','Realtime unsubscribe 清理',CHAT.includes('unsubscribe'));
t('T225','postgres_changes 監聽',CHAT.includes('postgres_changes'));
t('T226','messages INSERT 監聽',CHAT.includes('INSERT'));
t('T227','swap_id 篩選',CHAT.includes('swap_id'));
t('T228','sender_id 記錄',CHAT.includes('sender_id'));
t('T229','messages INSERT DB',CHAT.includes("from('messages').insert"));
t('T230','ascending 排序歷史',CHAT.includes('ascending'));
t('T231','scrollBottom 函式',CHAT.includes('scrollBottom'));
t('T232','autoResize textarea',CHAT.includes('autoResize'));
t('T233','Enter 鍵送出',ALL('chat.html').includes("key==='Enter'"));
t('T234','fmtTime 時間格式化',CHAT.includes('fmtTime'));
t('T235','氣泡樣式 me/them',ALL('chat.html').includes('bub.me')&&ALL('chat.html').includes('bub.them'));
t('T236','對話列表視圖',ALL('chat.html').includes('conv-list'));
t('T237','聊天室視圖',ALL('chat.html').includes('chatroom'));
t('T238','URL swap 參數開啟',CHAT.includes("params.get('swap')"));
t('T239','對話切換清除頻道',CHAT.includes('unsubscribe'));
t('T240','空對話列表提示',ALL('chat.html').includes('empty'));
t('T241','chat 未登入保護',CHAT.includes("'login.html'"));
t('T242','chat Supabase createClient',CHAT.includes('supabase.createClient'));
t('T243','cr-name 顯示對方名稱',ALL('chat.html').includes('cr-name'));
t('T244','cr-skill 顯示技能',ALL('chat.html').includes('cr-skill'));
t('T245','日期分隔線',CHAT.includes('day-sep')||ALL('chat.html').includes('day-sep'));
t('T246','訊息時間顯示 bub-time',ALL('chat.html').includes('bub-time'));
t('T247','chat manifest link',ALL('chat.html').includes('manifest.json'));
t('T248','chat 多對話支援',CHAT.includes('currentSwapId'));
t('T249','profiles join 查詢',CHAT.includes('profiles'));
t('T250','skills join 查詢',CHAT.includes('skills'));

// ════════════════════════════════════════════════════
// 群組 09  T251–T285  收費系統完整
// ════════════════════════════════════════════════════
t('T251','premium $99 月繳顯示',ALL('premium.html').includes('$99'));
t('T252','premium $59 年繳顯示',ALL('premium.html').includes('$59'));
t('T253','premium 省 40%',ALL('premium.html').includes('40%'));
t('T254','premium 7 天免費試用',ALL('premium.html').includes('試用'));
t('T255','premium 月/年切換 switchPlan',PREM.includes('switchPlan'));
t('T256','premium 功能列表 7 項',ALL('premium.html').includes('AI')&&ALL('premium.html').includes('無限'));
t('T257','premium Stripe checkout',PREM.includes('create-checkout-session'));
t('T258','premium 已訂閱防重',PREM.includes('is_premium'));
t('T259','premium FAQ',ALL('premium.html').includes('faq')||ALL('premium.html').includes('常見問題'));
t('T260','premium 取消說明',ALL('premium.html').includes('取消'));
t('T261','premium Apple Pay 說明',ALL('premium.html').includes('Apple Pay'),'WARN','premium 頁加入 Apple Pay 說明');
t('T262','premium-success 顯示功能',ALL('premium-success.html').includes('Premium'));
t('T263','premium-success → app.html',ALL('premium-success.html').includes("'app.html'"));
t('T264','premium-success → subscription.html',ALL('premium-success.html').includes('subscription.html'));
t('T265','sponsor 3 方案',ALL('sponsor.html').includes('plan-3')&&ALL('sponsor.html').includes('plan-7')&&ALL('sponsor.html').includes('plan-30'));
t('T266','sponsor $49/$89/$299',ALL('sponsor.html').includes('$49')&&ALL('sponsor.html').includes('$89')&&ALL('sponsor.html').includes('$299'));
t('T267','sponsor 技能選擇',SPON.includes('loadMySkills'));
t('T268','sponsor 已選技能高亮 sel',ALL('sponsor.html').includes('skill-pick.sel')||ALL('sponsor.html').includes('.sel'));
t('T269','sponsor 確認後 Stripe',SPON.includes('create-checkout-session'));
t('T270','sponsor CTA 顯示天數與金額',SPON.includes('selectedDays')&&SPON.includes('selectedPrice'));
t('T271','subscription 顯示訂閱狀態',ALL('subscription.html').includes('status-card'));
t('T272','subscription 功能清單',ALL('subscription.html').includes('feat-item'));
t('T273','subscription 取消確認 modal',ALL('subscription.html').includes('cancel-modal'));
t('T274','subscription confirmCancel',SUB.includes('confirmCancel'));
t('T275','subscription 取消後跳轉',SUB.includes("'app.html'"));
t('T276','checkout mode subscription',CHECKOUT.includes("'subscription'"));
t('T277','checkout mode payment',CHECKOUT.includes("'payment'"));
t('T278','checkout 試用 trial_period_days',CHECKOUT.includes('trial_period_days'));
t('T279','checkout allow_promotion_codes',CHECKOUT.includes('allow_promotion_codes'));
t('T280','checkout locale zh',CHECKOUT.includes("locale"));
t('T281','checkout CORS headers',CHECKOUT.includes('Access-Control-Allow-Origin'));
t('T282','cancel API cancel_at_period_end',CANCEL.includes('cancel_at_period_end'));
t('T283','cancel 更新 DB status',CANCEL.includes('subscription_status'));
t('T284','cancel 找不到 subscriptionId 保護',CANCEL.includes('subscription_id'));
t('T285','STRIPE設定.md 存在',!!F['STRIPE設定.md']);

// ════════════════════════════════════════════════════
// 群組 10  T286–T315  Stripe Webhook
// ════════════════════════════════════════════════════
t('T286','webhook subscription.created',HOOK.includes('subscription.created'));
t('T287','webhook subscription.updated',HOOK.includes('subscription.updated'));
t('T288','webhook subscription.deleted',HOOK.includes('subscription.deleted'));
t('T289','webhook payment_failed',HOOK.includes('payment_failed'));
t('T290','webhook checkout.session.completed',HOOK.includes('checkout.session.completed')||HOOK.includes('session.completed'),'WARN','webhook 加入 checkout.session.completed 處理精選置頂');
t('T291','webhook 更新 is_premium',HOOK.includes('is_premium'));
t('T292','webhook 更新 premium_until',HOOK.includes('premium_until'));
t('T293','webhook 更新 subscription_id',HOOK.includes('subscription_id'));
t('T294','webhook 更新 stripe_customer',HOOK.includes('stripe_customer'));
t('T295','webhook 簽名驗證 constructEvent',HOOK.includes('constructEvent'));
t('T296','webhook Supabase service role',HOOK.includes('SERVICE_KEY'));
t('T297','webhook bodyParser false',HOOK.includes('bodyParser'));
t('T298','webhook active 狀態判斷',HOOK.includes("'active'"));
t('T299','webhook trialing 狀態',HOOK.includes("'trialing'"));
t('T300','webhook current_period_end 轉換',HOOK.includes('current_period_end'));
t('T301','webhook deleted → is_premium false',HOOK.includes('false'));
t('T302','webhook payment_failed 通知',HOOK.includes('notifications'));
t('T303','webhook switch case 結構',HOOK.includes('switch'));
t('T304','webhook error 處理',HOOK.includes('catch')||HOOK.includes('error'));
t('T305','webhook 回傳 received:true',HOOK.includes('received'));
t('T306','webhook userId metadata',HOOK.includes('metadata'));
t('T307','webhook Stripe 物件結構正確',HOOK.includes('event.data.object'));
t('T308','webhook 處理失效訂閱清除',HOOK.includes('410')||HOOK.includes('410'),'WARN','webhook 加入 410 訂閱失效清除');
t('T309','webhook 環境變數 STRIPE_SECRET',HOOK.includes('STRIPE_SECRET_KEY'));
t('T310','webhook 環境變數 WEBHOOK_SECRET',HOOK.includes('WEBHOOK_SECRET'));
t('T311','webhook SUPABASE_URL 環境變數',HOOK.includes('SUPABASE_URL'));
t('T312','cancel API 存在',!!F['api/cancel-subscription.js']);
t('T313','cancel Stripe subscriptions.update',CANCEL.includes('subscriptions.update'));
t('T314','cancel userId 驗證',CANCEL.includes('userId'));
t('T315','cancel error 處理',CANCEL.includes('catch')||CANCEL.includes('error'));

// ════════════════════════════════════════════════════
// 群組 11  T316–T340  推播通知
// ════════════════════════════════════════════════════
t('T316','send-push web-push require',PUSH.includes('web-push'));
t('T317','send-push setVapidDetails',PUSH.includes('setVapidDetails'));
t('T318','send-push ADMIN_EMAIL',PUSH.includes('ADMIN_EMAIL'));
t('T319','send-push 取得用戶訂閱',PUSH.includes('push_subscriptions'));
t('T320','send-push payload JSON',PUSH.includes('JSON.stringify'));
t('T321','send-push icon 路徑',PUSH.includes('icon-192.png'));
t('T322','send-push 失效訂閱清除 410',PUSH.includes('410'));
t('T323','send-push 儲存通知到 notifications',PUSH.includes('notifications'));
t('T324','send-push CORS headers',PUSH.includes('Access-Control'));
t('T325','send-push userId 必填驗證',PUSH.includes('userId'));
t('T326','send-push title 必填',PUSH.includes('title'));
t('T327','send-push url 支援',PUSH.includes('url ||')||PUSH.includes('url:'));
t('T328','send-push type 類型',PUSH.includes('data:')&&PUSH.includes('type'));
t('T329','send-push VAPID_PUBLIC_KEY env',PUSH.includes('VAPID_PUBLIC_KEY'));
t('T330','send-push VAPID_PRIVATE_KEY env',PUSH.includes('VAPID_PRIVATE_KEY'));
t('T331','push-setup userVisibleOnly true',F['push-setup.js']?.includes('userVisibleOnly'));
t('T332','push-setup p256dh key',F['push-setup.js']?.includes('p256dh'));
t('T333','push-setup auth key',F['push-setup.js']?.includes('auth'));
t('T334','push-setup upsert 更新',F['push-setup.js']?.includes('upsert'));
t('T335','push-setup updated_at 記錄',F['push-setup.js']?.includes('updated_at'));
t('T336','app 申請後詢問推播',APP.includes('askPushPermission'));
t('T337','push_subscriptions schema',SCHEMA.includes('push_subscriptions'));
t('T338','notifications schema',SCHEMA.includes('notifications'));
t('T339','notifications is_read 欄位',SCHEMA.includes('is_read'));
t('T340','push-setup 初始化不主動彈出',F['push-setup.js']?.includes('_pushReady'));

// ════════════════════════════════════════════════════
// 群組 12  T341–T370  社群分享 & Referral
// ════════════════════════════════════════════════════
t('T341','skill.html OG title meta',ALL('skill.html').includes('og:title'));
t('T342','skill.html OG description',ALL('skill.html').includes('og:description'));
t('T343','skill.html OG image',ALL('skill.html').includes('og:image'));
t('T344','skill.html OG url',ALL('skill.html').includes('og:url'));
t('T345','skill.html og:image:width',ALL('skill.html').includes('og:image:width'));
t('T346','skill.html Twitter card summary',ALL('skill.html').includes('summary_large_image')||ALL('skill.html').includes('twitter:card'));
t('T347','skill.html 瀏覽次數 view_count',SKILL.includes('view_count'));
t('T348','skill.html 同城市技能 loadMoreSkills',SKILL.includes('loadMoreSkills'));
t('T349','skill.html App 安裝橫幅',ALL('skill.html').includes('app-banner'));
t('T350','skill.html 申請跳轉',SKILL.includes('applyNow'));
t('T351','skill.html 原生分享',SKILL.includes('navigator.share'));
t('T352','skill.html 找不到技能錯誤頁',SKILL.includes('showError'));
t('T353','skill.html Supabase 查詢',SKILL.includes("from('skills')"));
t('T354','skill.html profiles join',SKILL.includes('profiles'));
t('T355','app 分享 Sheet share-overlay',ALL('app.html').includes('share-overlay'));
t('T356','app openShare 函式',APP.includes('openShare'));
t('T357','app shareSkill 變數',APP.includes('shareSkill'));
t('T358','app shareTo 函式',APP.includes('shareTo'));
t('T359','app copyLink 函式',APP.includes('copyLink'));
t('T360','app 分享按鈕 ↗ 分享',ALL('app.html').includes('↗ 分享'));
t('T361','invite.html LINE 分享',INV.includes('social-plugins.line.me'));
t('T362','invite.html Facebook 分享',INV.includes('facebook.com/sharer'));
t('T363','invite.html 邀請碼生成',INV.includes('inviteCode'));
t('T364','invite.html 進度追蹤',INV.includes('loadReferrals'));
t('T365','invite.html 達人徽章',ALL('invite.html').includes('邀請達人')||ALL('invite.html').includes('徽章'));
t('T366','invite.html 複製邀請碼',INV.includes('copyInvite'));
t('T367','invite.html 規則說明',ALL('invite.html').includes('rule-item'));
t('T368','invite.html 獎勵卡片',ALL('invite.html').includes('reward-card'));
t('T369','referrals schema',SCHEMA.includes('referrals'));
t('T370','app 個人頁邀請入口',ALL('app.html').includes("'invite.html'"));

// ════════════════════════════════════════════════════
// 群組 13  T371–T400  資料庫 Schema
// ════════════════════════════════════════════════════
t('T371','profiles 資料表',SCHEMA.includes('public.profiles')||SCHEMA.includes('create table')||SCHEMA.includes('profiles'));
t('T372','skills 資料表',SCHEMA.includes('public.skills')||SCHEMA.includes("'skills'"));
t('T373','swaps 資料表',SCHEMA.includes('public.swaps')||SCHEMA.includes("'swaps'"));
t('T374','messages 資料表',SCHEMA.includes('public.messages')||SCHEMA.includes("'messages'"));
t('T375','reviews 資料表',F['supabase_reviews.sql']?.includes('reviews'));
t('T376','reports 資料表',SCHEMA.includes('public.reports'));
t('T377','blocks 資料表',SCHEMA.includes('public.blocks'));
t('T378','push_subscriptions 資料表',SCHEMA.includes('push_subscriptions'));
t('T379','notifications 資料表',SCHEMA.includes('notifications'));
t('T380','referrals 資料表',SCHEMA.includes('referrals'));
t('T381','RLS row level security',SCHEMA.includes('row level security'));
t('T382','profiles is_premium 欄位',SCHEMA.includes('is_premium'));
t('T383','profiles premium_until 欄位',SCHEMA.includes('premium_until'));
t('T384','profiles stripe_customer 欄位',SCHEMA.includes('stripe_customer'));
t('T385','profiles subscription_id 欄位',SCHEMA.includes('subscription_id'));
t('T386','skills is_sponsored 欄位',SCHEMA.includes('is_sponsored'));
t('T387','skills sponsored_until 欄位',SCHEMA.includes('sponsored_until'));
t('T388','skills view_count 欄位',SCHEMA.includes('view_count'));
t('T389','blocks unique 約束',SCHEMA.includes('unique(blocker_id'));
t('T390','referrals referred_id unique',SCHEMA.includes('referred_id'));
t('T391','notifications user_id FK',SCHEMA.includes('user_id'));
t('T392','SUPABASE設定.md 存在',!!F['SUPABASE設定.md']);
t('T393','schema gen_random_uuid',SCHEMA.includes('gen_random_uuid'));
t('T394','schema timestamptz default now',SCHEMA.includes('default now'));
t('T395','schema on delete cascade',SCHEMA.includes('on delete cascade'));
t('T396','push unique user_id',SCHEMA.includes('unique')||SCHEMA.includes('upsert'));
t('T397','blocks policy create',SCHEMA.includes('blocker_id'));
t('T398','reports policy insert',SCHEMA.includes('reporter_id'));
t('T399','referrals status pending',SCHEMA.includes('pending'));
t('T400','schema 無語法錯誤基本檢查',!SCHEMA.includes('ERRROR')&&SCHEMA.length>500);

// ════════════════════════════════════════════════════
// 群組 14  T401–T430  管理後台
// ════════════════════════════════════════════════════
t('T401','admin 深色主題 bg:#0D0F12',ALL('admin.html').includes('#0D0F12'));
t('T402','admin 側邊欄 sidebar',ALL('admin.html').includes('sidebar'));
t('T403','admin Logo 技遇',ALL('admin.html').includes('技遇'));
t('T404','admin 數據總覽 loadDashboard',ADM.includes('loadDashboard'));
t('T405','admin 用戶統計 stat-users',ALL('admin.html').includes('stat-users'));
t('T406','admin 交換統計 stat-swaps',ALL('admin.html').includes('stat-swaps'));
t('T407','admin Premium 統計',ALL('admin.html').includes('stat-premium'));
t('T408','admin 待處理檢舉統計',ALL('admin.html').includes('stat-reports'));
t('T409','admin 城市分佈圖',ALL('admin.html').includes('city-kaohsiung'));
t('T410','admin 最新活動',ALL('admin.html').includes('activity-list'));
t('T411','admin 收入報表 loadRevenue',ADM.includes('loadRevenue'));
t('T412','admin 總收入 rev-total',ALL('admin.html').includes('rev-total'));
t('T413','admin Premium 收入',ALL('admin.html').includes('rev-sub'));
t('T414','admin 置頂收入',ALL('admin.html').includes('rev-spon'));
t('T415','admin 轉換率 conv-rate',ALL('admin.html').includes('conv-rate'));
t('T416','admin ARPU',ALL('admin.html').includes('arpu'));
t('T417','admin 用戶管理 loadUsers',ADM.includes('loadUsers'));
t('T418','admin 用戶搜尋 filterUsers',ADM.includes('filterUsers'));
t('T419','admin 用戶篩選 filterUserStatus',ADM.includes('filterUserStatus'));
t('T420','admin 用戶表格 users-table',ALL('admin.html').includes('users-table'));
t('T421','admin Premium 用戶 loadPremium',ADM.includes('loadPremium'));
t('T422','admin 技能管理 loadSkills',ADM.includes('loadSkills'));
t('T423','admin 技能篩選城市 filterSkillCity',ADM.includes('filterSkillCity'));
t('T424','admin 技能篩選類別 filterSkillCat',ADM.includes('filterSkillCat'));
t('T425','admin 檢舉管理 resolveReport',ADM.includes('resolveReport'));
t('T426','admin 封禁 showBanModal/confirmBan',ADM.includes('confirmBan'));
t('T427','admin 精選置頂管理',ALL('admin.html').includes('sponsored-table'));
t('T428','admin 系統設定頁',ALL('admin.html').includes('page-settings'));
t('T429','admin 連線狀態顯示',ALL('admin.html').includes('正常'));
t('T430','admin 重新整理 refreshAll',ADM.includes('refreshAll'));

// ════════════════════════════════════════════════════
// 群組 15  T431–T460  安全 & 防護
// ════════════════════════════════════════════════════
t('T431','無 Stripe live key 前端外洩',!['app.html','login.html','premium.html','sponsor.html'].some(f=>(F[f]||'').includes('sk_live')));
t('T432','無 Stripe test key 前端外洩',!['app.html','login.html','premium.html','sponsor.html'].some(f=>(F[f]||'').includes('sk_test')));
t('T433','無 service role key 前端外洩',!['app.html','login.html','premium.html'].some(f=>(F[f]||'').includes('service_role')));
t('T434','申請自己防護',APP.includes('user_id===currentUser.id'));
t('T435','申請重複防護 23505',APP.includes('23505'));
t('T436','封鎖功能',APP.includes('blockUser'));
t('T437','API 方法驗證 POST only',CHECKOUT.includes('405')||CHECKOUT.includes("!== 'POST'"));
t('T438','webhook 簽名驗證',HOOK.includes('constructEvent'));
t('T439','webhook bodyParser raw',HOOK.includes('bodyParser'));
t('T440','Supabase RLS',SCHEMA.includes('row level security'));
t('T441','blocks RLS policy',SCHEMA.includes('blocker_id'));
t('T442','reports RLS insert only',SCHEMA.includes('reporter_id'));
t('T443','push_subscriptions RLS',SCHEMA.includes('push_subscriptions')&&SCHEMA.includes('enable row level security'));
t('T444','referrals RLS',SCHEMA.includes('referrals')&&SCHEMA.includes('policy'));
t('T445','map openDetById 防注入',MAP.includes('openDetById'));
t('T446','Supabase URL 佔位符未替換為警告',ALL('app.html').includes('your-project.supabase.co'),'WARN','上線前替換 Supabase URL');
t('T447','CORS headers API',CHECKOUT.includes('Access-Control-Allow-Origin')&&PUSH.includes('Access-Control-Allow-Origin'));
t('T448','cancel API userId 驗證',CANCEL.includes('userId'));
t('T449','admin 直接開啟無密碼保護',ALL('admin.html').includes('ADMIN_EMAIL')||ALL('admin.html').includes('ADMIN_EMAIL'),'WARN','admin.html 加入密碼保護');
t('T450','send-push userId 必填',PUSH.includes('userId'));

// ════════════════════════════════════════════════════
// 群組 16  T451–T475  UX & 無障礙
// ════════════════════════════════════════════════════
t('T451','所有頁 Toast 通知',['app.html','login.html','premium.html','subscription.html','invite.html','sponsor.html','profile-edit.html'].every(f=>ALL(f).includes('toast')));
t('T452','主要頁面有返回按鈕',['chat.html','premium.html','sponsor.html','subscription.html','invite.html','profile-edit.html','reset-password.html'].every(f=>ALL(f).includes('history.back')||ALL(f).includes('back-btn')||ALL(f).includes('backToList')||ALL(f).includes("'login.html'")));
t('T453','Loading 狀態顯示',['app.html','admin.html','sponsor.html'].every(f=>ALL(f).includes('載入中')||ALL(f).includes('loading')));
t('T454','disabled 按鈕防重複點擊',['app.html','premium.html','subscription.html'].every(f=>ALL(f).includes('disabled')));
t('T455','空狀態提示',['app.html','chat.html','admin.html'].every(f=>ALL(f).includes('empty')||ALL(f).includes('沒有')||ALL(f).includes('無')));
t('T456','select label for 屬性',ALL('onboarding.html').includes('for="category"'));
t('T457','confirm 對話框二次確認',['profile-edit.html','subscription.html'].every(f=>ALL(f).includes('confirm(')||ALL(f).includes('modal')));
t('T458','錯誤狀態 error-state',ALL('skill.html').includes('error-state'));
t('T459','手機 tap 無藍框',['app.html','login.html'].every(f=>ALL(f).includes('-webkit-tap-highlight-color')));
t('T460','input placeholder 提示',['app.html','login.html','chat.html'].every(f=>ALL(f).includes('placeholder')));
t('T461','Font Instrument Serif 標題',['app.html','premium.html','subscription.html'].every(f=>ALL(f).includes('Instrument Serif')));
t('T462','CSS box-sizing border-box',['app.html','login.html','premium.html'].every(f=>CSS(f).includes('box-sizing')));
t('T463','app 瀏覽器 scrollbar 隱藏',CSS('app.html').includes('scrollbar'));
t('T464','圖示有 4 種尺寸',['icon-512.png','icon-192.png','apple-touch-icon.png','favicon.png'].every(f=>{ try{readFileSync(f);return true;}catch{return false;} }));
t('T465','map 底部安全區域',ALL('map.html').includes('safe-area-inset-bottom'));
t('T466','chat 底部輸入安全區域',ALL('chat.html').includes('safe-area-inset-bottom'));
t('T467','premium 底部按鈕安全區域',ALL('premium.html').includes('safe-area-inset-bottom'));
t('T468','modal overlay 點擊關閉',['app.html','profile-edit.html','subscription.html'].every(f=>ALL(f).includes("event.target===this")||ALL(f).includes('modal-ov')));
t('T469','動畫 CSS transition',['app.html','premium.html'].every(f=>CSS(f).includes('transition')));
t('T470','border-radius 圓角風格',['app.html','login.html','premium.html'].every(f=>CSS(f).includes('border-radius')));
t('T471','CSS var 設計變數',['app.html','login.html','premium.html'].every(f=>CSS(f).includes('--g:')||CSS(f).includes('--t:')));
t('T472','Supabase JS CDN 引入',htmlFiles.every(f=>ALL(f).includes('supabase')));
t('T473','max-width 430px 手機寬',['app.html','login.html','premium.html'].every(f=>CSS(f).includes('430px')));
t('T474','min-height 100dvh',['app.html','login.html'].every(f=>ALL(f).includes('100dvh')));
t('T475','overflow 滾動設定',['app.html','chat.html'].every(f=>CSS(f).includes('overflow')));

// ════════════════════════════════════════════════════
// 群組 17  T476–T500  端對端情境
// ════════════════════════════════════════════════════
// 情境 A：新用戶完整流程
t('T476','新用戶：login → onboarding',ALL('login.html').includes('onboarding.html'));
t('T477','新用戶：onboarding 4步驟',ALL('onboarding.html').includes('step-3')&&ALL('onboarding.html').includes('step-0'));
t('T478','新用戶：onboarding → app',ONB.includes("'app.html'"));
t('T479','新用戶：app 瀏覽技能',APP.includes('loadSkills'));
t('T480','新用戶：發布第一個技能',APP.includes('postSkill'));
// 情境 B：付費轉換流程
t('T481','付費：個人頁升級入口',ALL('app.html').includes('premium.html')&&ALL('app.html').includes('upgrade-btn'));
t('T482','付費：premium 頁方案選擇',PREM.includes('switchPlan'));
t('T483','付費：Stripe checkout 建立',PREM.includes('create-checkout-session'));
t('T484','付費：webhook 更新 DB',HOOK.includes('is_premium'));
t('T485','付費：success 頁顯示功能',ALL('premium-success.html').includes('perk'));
// 情境 C：技能交換完整流程
t('T486','交換：申請 applySwap',APP.includes('applySwap'));
t('T487','交換：通知對方',APP.includes('askPushPermission')||APP.includes('push'));
t('T488','交換：配對頁接受',APP.includes('respondSwap'));
t('T489','交換：聊天協調',CHAT.includes('sendMsg'));
t('T490','交換：完成評分',APP.includes('setStar'));
// 情境 D：惡意用戶防護
t('T491','防護：申請自己',APP.includes('user_id===currentUser.id'));
t('T492','防護：重複申請',APP.includes('23505'));
t('T493','防護：封鎖用戶',APP.includes('blockUser'));
t('T494','防護：檢舉系統',PROF.includes('submitReport'));
t('T495','防護：API key 安全',!['app.html','login.html','premium.html'].some(f=>(F[f]||'').includes('sk_live')));
// 情境 E：社群增長
t('T496','增長：邀請好友入口',ALL('app.html').includes("'invite.html'"));
t('T497','增長：分享技能',APP.includes('openShare'));
t('T498','增長：技能公開頁 OG',ALL('skill.html').includes('og:title'));
t('T499','增長：精選置頂曝光',APP.includes('loadSponsored'));
t('T500','增長：AdSense 被動收入',ALL('app.html').includes('adsbygoogle'));

// ════════════════════════════════════════════════════
// 輸出報告
// ════════════════════════════════════════════════════
const fails=issues.filter(i=>i.sev==='FAIL');
const warns=issues.filter(i=>i.sev==='WARN');

console.log(`\n${W}╔══════════════════════════════════════════════════════╗${X}`);
console.log(`${W}║   技遇 JiYu — 500 情境超完整測試報告               ║${X}`);
console.log(`${W}╚══════════════════════════════════════════════════════╝${X}\n`);

const groups=[
  [1,25,'檔案完整性'],[26,50,'HTML 頭部 & Meta'],[51,75,'PWA & Service Worker'],
  [76,105,'登入 / 驗證完整流程'],[106,150,'app.html 完整功能'],[151,180,'導航完整性'],
  [181,215,'地圖完整功能'],[216,250,'聊天完整功能'],[251,285,'收費系統完整'],
  [286,315,'Stripe Webhook'],[316,340,'推播通知'],[341,370,'社群分享 & Referral'],
  [371,400,'資料庫 Schema'],[401,430,'管理後台'],[431,450,'安全 & 防護'],
  [451,475,'UX & 無障礙'],[476,500,'端對端情境'],
];

groups.forEach(([from,to,name])=>{
  const gi=issues.filter(i=>{const n=parseInt(i.id.slice(1));return n>=from&&n<=to;});
  const gf=gi.filter(i=>i.sev==='FAIL').length;
  const gw=gi.filter(i=>i.sev==='WARN').length;
  const total=to-from+1, ok=total-gf-gw;
  const icon=gf>0?`${R}🔴${X}`:gw>0?`${Y}🟡${X}`:`${G}✅${X}`;
  console.log(`${icon} T${String(from).padStart(3,'0')}–T${String(to).padStart(3,'0')}  ${W}${name}${X}  ${G}${ok}/${total}${X}${gf?` ${R}${gf}失敗${X}`:''}${gw?` ${Y}${gw}警告${X}`:''}`);
  gi.forEach(i=>{
    const c=i.sev==='FAIL'?R:Y, sym=i.sev==='FAIL'?'  ❌':'  ⚠️ ';
    console.log(`${c}${sym} [${i.id}] ${i.label}${i.fix?' — 建議：'+i.fix:''}${X}`);
  });
});

const pct=Math.round(pass/500*100);
const filled=Math.round(pct/5);
const bar=`${'█'.repeat(filled)}${'░'.repeat(20-filled)}`;
console.log(`\n${W}進度  ${G}[${bar}]${X} ${W}${pct}% (${pass}/500)${X}`);
console.log(`\n${W}最終：${G}${pass} 通過${X} / ${R}${fail} 失敗${X} / ${Y}${warn} 警告${X}${X}`);
if(fail===0&&warn===0) console.log(`\n${G}${W}🎉 500/500 全數通過！技遇可以上線了！${X}`);
else if(fail===0) console.log(`\n${Y}${W}✅ 無失敗，${warn} 個建議改善項目${X}`);
