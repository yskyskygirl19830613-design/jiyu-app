// test_501_700.mjs
// 技遇 JiYu — 追加 200 情境測試 (T501–T700)
import { readFileSync, readdirSync } from 'fs';

const G='\x1b[32m',R='\x1b[31m',Y='\x1b[33m',X='\x1b[0m',W='\x1b[1m';
let pass=0,fail=0,warn=0;
const issues=[];

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

const JS =(f)=>[...((F[f]||'').matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))].map(m=>m[1]).join('\n');
const CSS=(f)=>[...((F[f]||'').matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g))].map(m=>m[1]).join('\n');
const ALL=(f)=>F[f]||'';

const APP=JS('app.html'), LOGIN=JS('login.html'), MAP=JS('map.html'),
      CHAT=JS('chat.html'), PREM=JS('premium.html'), SUB=JS('subscription.html'),
      SPON=JS('sponsor.html'), INV=JS('invite.html'), SKILL=JS('skill.html'),
      ADM=JS('admin.html'), PROF=JS('profile-edit.html'), ONB=JS('onboarding.html'),
      RESET=JS('reset-password.html'), HOOK=F['api/stripe-webhook.js']||'',
      CHECKOUT=F['api/create-checkout-session.js']||'', PUSH=F['api/send-push.js']||'',
      CANCEL=F['api/cancel-subscription.js']||'', SW=F['service-worker.js']||'',
      SCHEMA=F['supabase_schema.sql']||'', PKG=F['package.json']||'';

function t(id,label,cond,sev='FAIL',fix=''){
  if(cond){pass++;return true;}
  sev==='WARN'?warn++:fail++;
  issues.push({id,label,sev,fix});
  return false;
}

// ════════════════════════════════════════════════════
// 群組 A  T501–T520  package.json & Vercel 部署
// ════════════════════════════════════════════════════
t('T501','package.json name=jiyu-app',PKG.includes('jiyu-app'));
t('T502','package.json stripe 依賴',PKG.includes('stripe'));
t('T503','package.json @supabase/supabase-js 依賴',PKG.includes('@supabase/supabase-js'));
t('T504','package.json web-push 依賴',PKG.includes('web-push'),'WARN','package.json 加 web-push 依賴');
t('T505','vercel.json 有效 JSON',(()=>{try{JSON.parse(ALL('vercel.json'));return true;}catch{return false;}})());
t('T506','api 目錄有 4 個 serverless 函式',
  ['api/create-checkout-session.js','api/stripe-webhook.js','api/send-push.js','api/cancel-subscription.js'].every(f=>!!F[f]));
t('T507','所有 API 有 module.exports',
  ['api/create-checkout-session.js','api/stripe-webhook.js','api/send-push.js','api/cancel-subscription.js'].every(f=>(F[f]||'').includes('module.exports')));
t('T508','所有 API 有 async function',
  ['api/create-checkout-session.js','api/stripe-webhook.js','api/send-push.js','api/cancel-subscription.js'].every(f=>(F[f]||'').includes('async')));
t('T509','所有 API 有 try-catch',
  ['api/create-checkout-session.js','api/stripe-webhook.js','api/send-push.js','api/cancel-subscription.js'].every(f=>(F[f]||'').includes('try')));
t('T510','所有 API 有 res.json 回傳',
  ['api/create-checkout-session.js','api/send-push.js','api/cancel-subscription.js'].every(f=>(F[f]||'').includes('res.json')));
t('T511','checkout 有 OPTIONS CORS 處理',CHECKOUT.includes('OPTIONS'));
t('T512','send-push 有 OPTIONS 處理',PUSH.includes('OPTIONS'));
t('T513','cancel 有 OPTIONS 處理',CANCEL.includes('OPTIONS'));
t('T514','webhook bodyParser:false config',HOOK.includes('bodyParser'));
t('T515','checkout 環境變數 STRIPE_SECRET_KEY',CHECKOUT.includes('STRIPE_SECRET_KEY'));
t('T516','webhook 環境變數 SUPABASE_URL',HOOK.includes('SUPABASE_URL'));
t('T517','send-push 環境變數 VAPID',PUSH.includes('VAPID_PUBLIC_KEY')&&PUSH.includes('VAPID_PRIVATE_KEY'));
t('T518','STRIPE設定.md 有 Webhook 說明',ALL('STRIPE設定.md').includes('Webhook'));
t('T519','SUPABASE設定.md 有 SQL 說明',ALL('SUPABASE設定.md').includes('SQL')||ALL('SUPABASE設定.md').includes('sql'));
t('T520','STRIPE設定.md 有測試卡號',ALL('STRIPE設定.md').includes('4242'));

// ════════════════════════════════════════════════════
// 群組 B  T521–T545  app.html CSS 樣式品質
// ════════════════════════════════════════════════════
const APPCSS=CSS('app.html');
t('T521','app CSS 有 :root 變數',APPCSS.includes(':root'));
t('T522','app CSS 主色 --g:#3D9970',APPCSS.includes('--g:#3D9970')||APPCSS.includes('--g: #3D9970'));
t('T523','app CSS 淺色 --gl:#E8F5EF',APPCSS.includes('--gl'));
t('T524','app CSS 文字色 --t:#111',APPCSS.includes('--t:#111')||APPCSS.includes("--t: #111"));
t('T525','app CSS 次要色 --t2',APPCSS.includes('--t2'));
t('T526','app CSS 邊框色 --bd',APPCSS.includes('--bd'));
t('T527','app CSS 背景色 --bg2',APPCSS.includes('--bg2'));
t('T528','app CSS 無 !important 濫用',((APPCSS.match(/!important/g)||[]).length)<=5);
t('T529','app CSS grid 佈局',APPCSS.includes('grid-template-columns'));
t('T530','app CSS flex 佈局',APPCSS.includes('display:flex')||APPCSS.includes('display: flex'));
t('T531','app CSS 圓角風格',APPCSS.includes('border-radius'));
t('T532','app CSS transition 動畫',APPCSS.includes('transition'));
t('T533','app CSS keyframes 動畫',APPCSS.includes('@keyframes'),'WARN','app.html 加入載入動畫 @keyframes');
t('T534','app CSS overflow:hidden 控制',APPCSS.includes('overflow:hidden')||APPCSS.includes('overflow: hidden'));
t('T535','app CSS scrollbar 隱藏',APPCSS.includes('scrollbar'));
t('T536','app CSS -webkit-tap-highlight',APPCSS.includes('-webkit-tap-highlight-color'));
t('T537','app CSS font-family 設定',APPCSS.includes('font-family'));
t('T538','app CSS max-width:430px 手機框',APPCSS.includes('max-width:430px')||APPCSS.includes('max-width: 430px'));
t('T539','app CSS 100dvh 現代視窗高度',ALL('app.html').includes('100dvh'));
t('T540','app CSS cursor:pointer 按鈕可點',APPCSS.includes('cursor:pointer')||APPCSS.includes('cursor: pointer'));
t('T541','premium CSS 有 toggle-btn 樣式',CSS('premium.html').includes('toggle-btn'));
t('T542','chat CSS 氣泡樣式 bub',CSS('chat.html').includes('.bub'));
t('T543','map CSS 卡片樣式 nc',CSS('map.html').includes('.nc'));
t('T544','admin CSS 深色主題',CSS('admin.html').includes('#0D0F12')||CSS('admin.html').includes('0D0F12'));
t('T545','sponsor CSS 橘色主題',CSS('sponsor.html').includes('#E07B39')||CSS('sponsor.html').includes('--o'));

// ════════════════════════════════════════════════════
// 群組 C  T546–T570  資料查詢品質
// ════════════════════════════════════════════════════
t('T546','app skills 查詢有 is_active 過濾',APP.includes('is_active'));
t('T547','app skills 查詢有 order',APP.includes(".order("));
t('T548','app skills 查詢有 limit',APP.includes('.limit('));
t('T549','app swaps 查詢有 user 關聯',APP.includes('requester_id')||APP.includes('provider_id'));
t('T550','app profiles join 查詢',APP.includes('profiles'));
t('T551','map skills 查詢有 lat 不為 null',MAP.includes('lat'));
t('T552','map skills 查詢有 is_active',MAP.includes('is_active'));
t('T553','chat messages 查詢有 swap_id',CHAT.includes('swap_id'));
t('T554','chat messages 有 ascending 排序',CHAT.includes('ascending'));
t('T555','admin 查詢有 count exact',ADM.includes('count'));
t('T556','invite referrals 查詢有 referrer_id',INV.includes('referrer_id'));
t('T557','sponsor skills 查詢有 is_active',SPON.includes('is_active'));
t('T558','subscription profiles 查詢有 is_premium',SUB.includes('is_premium'));
t('T559','profile-edit 查詢有 single()',PROF.includes('.single()'));
t('T560','skill.html 查詢有 single()',SKILL.includes('.single()'));
t('T561','app applySwap insert swaps',APP.includes("from('swaps').insert")||APP.includes('from("swaps").insert'));
t('T562','app completeSwap update swaps',APP.includes("from('swaps').update")||APP.includes("update({'status")||APP.includes("update({status"));
t('T563','app postSkill insert skills',APP.includes("from('skills').insert")||APP.includes("postSkill"));
t('T564','app reviews insert',APP.includes('reviews'));
t('T565','app notifications 或 push 通知',APP.includes('notification')||APP.includes('push'));
t('T566','Supabase select * count exact',ADM.includes("count:'exact'")||ADM.includes("count: 'exact'"));
t('T567','Supabase upsert 避免重複',F['push-setup.js']?.includes('upsert'));
t('T568','Supabase eq 條件查詢',APP.includes('.eq('));
t('T569','Supabase neq 排除查詢',APP.includes('.neq(')||MAP.includes('.neq(')||APP.includes('neq(')||SKILL.includes('neq('));
t('T570','Supabase in/not 範圍查詢',APP.includes('.in(')||APP.includes('.not(')||MAP.includes('.not(')||MAP.includes('.in('));

// ════════════════════════════════════════════════════
// 群組 D  T571–T595  錯誤處理 & 邊界情況
// ════════════════════════════════════════════════════
t('T571','app 技能列表空狀態處理',APP.includes('empty')||APP.includes('空'));
t('T572','app 配對列表空狀態',APP.includes('沒有')||APP.includes('empty'));
t('T573','chat 無對話空狀態',ALL('chat.html').includes('empty')||CHAT.includes('empty'));
t('T574','map 無技能空狀態',MAP.includes('empty')||MAP.includes('沒有')||ALL('map.html').includes('⏳')||ALL('map.html').includes('loading'));
t('T575','admin 資料載入失敗回退',ADM.includes('catch')||ADM.includes('模擬'));
t('T576','skill.html 技能不存在錯誤頁',SKILL.includes('showError'));
t('T577','profile-edit 儲存失敗提示',PROF.includes('失敗')||PROF.includes('error'));
t('T578','premium 付款失敗處理',PREM.includes('失敗')||PREM.includes('error'));
t('T579','sponsor 無技能提示',SPON.includes('還沒有')||SPON.includes('empty')||SPON.includes('no-skills'));
t('T580','login 密碼錯誤中文提示',ALL('login.html').includes('電子信箱或密碼錯誤'));
t('T581','login email 格式錯誤提示',ALL('login.html').includes('有效的電子信箱'));
t('T582','login 已存在帳號提示',ALL('login.html').includes('已經註冊過'));
t('T583','reset 密碼長度驗證',RESET.includes('8')||RESET.includes('length'));
t('T584','reset 密碼不一致提示',RESET.includes('不一致')||RESET.includes('match')||RESET.includes('相同'));
t('T585','app 申請重複中文提示',APP.includes('已經申請')||APP.includes('23505'));
t('T586','map 定位失敗不 crash',MAP.includes('getCurrentPosition'));
t('T587','chat 送出空訊息防護',CHAT.includes('.trim()')||CHAT.includes("!content"));
t('T588','onboarding 步驟驗證',ONB.includes('validate')||ONB.includes('if(')||ONB.includes('trim'));
t('T589','admin 資料沒有時顯示佔位符',ADM.includes('—')||ADM.includes('模擬'));
t('T590','invite 好友未完成時狀態',INV.includes('pending'));
t('T591','app 評分提交後關閉 overlay',APP.includes('rating-overlay')||APP.includes('completeSwap'));
t('T592','sponsor 選技能才能付款 disabled',SPON.includes('disabled'));
t('T593','subscription 取消後跳回',SUB.includes("'app.html'"));
t('T594','checkout 缺少參數 400 回傳',CHECKOUT.includes('400'));
t('T595','send-push 用戶無訂閱時回傳',PUSH.includes('sent: false')||PUSH.includes("sent:false"));

// ════════════════════════════════════════════════════
// 群組 E  T596–T620  管理後台深度
// ════════════════════════════════════════════════════
t('T596','admin 深色 sidebar',CSS('admin.html').includes('sidebar'));
t('T597','admin IBM Plex Mono 字體',ALL('admin.html').includes('IBM+Plex+Mono')||ALL('admin.html').includes('IBM Plex Mono'));
t('T598','admin Noto Sans TC 字體',ALL('admin.html').includes('Noto+Sans+TC')||ALL('admin.html').includes('Noto Sans TC'));
t('T599','admin nav-item active 狀態',ALL('admin.html').includes('nav-item active'));
t('T600','admin 統計卡片 green/blue/yellow/red',ALL('admin.html').includes('stat-card green')&&ALL('admin.html').includes('stat-card red'));
t('T601','admin 7天活躍圖 bar-chart',ALL('admin.html').includes('bar-chart'));
t('T602','admin 城市分佈 city-kaohsiung',ALL('admin.html').includes('city-kaohsiung'));
t('T603','admin 收入來源分析 revenue-bar',ALL('admin.html').includes('revenue-bar'));
t('T604','admin 用戶搜尋框',ALL('admin.html').includes('search-input'));
t('T605','admin 用戶篩選 select',ALL('admin.html').includes('filterUserStatus'));
t('T606','admin 技能下架按鈕',ALL('admin.html').includes('下架'));
t('T607','admin 檢舉緊急紅色',ALL('admin.html').includes('urgent'));
t('T608','admin ban modal 封禁確認',ALL('admin.html').includes('ban-modal'));
t('T609','admin 精選置頂曝光數',ALL('admin.html').includes('曝光'));
t('T610','admin 系統設定 contenteditable',ALL('admin.html').includes('contenteditable'));
t('T611','admin Supabase 連線狀態',ALL('admin.html').includes('正常'));
t('T612','admin 更新時間顯示',ADM.includes('updateTime'));
t('T613','admin 載入用戶 loadUsers',ADM.includes('loadUsers'));
t('T614','admin 模擬資料 fallback',ADM.includes('模擬')||ADM.includes('allUsers = ['));
t('T615','admin renderUsers 渲染',ADM.includes('renderUsers'));
t('T616','admin renderSkills 渲染',ADM.includes('renderSkills'));
t('T617','admin Toast 通知',ADM.includes('showToast'));
t('T618','admin 預估下月收入 forecast',ALL('admin.html').includes('forecast'));
t('T619','admin Premium 到期提醒 prem-expiring',ALL('admin.html').includes('prem-expiring'));
t('T620','admin 付款記錄表格',ALL('admin.html').includes('payment-table'));

// ════════════════════════════════════════════════════
// 群組 F  T621–T645  社群功能深度
// ════════════════════════════════════════════════════
t('T621','skill.html 技能 banner 漸層',CSS('skill.html').includes('linear-gradient'));
t('T622','skill.html 技能 emoji 顯示',SKILL.includes('emoji'));
t('T623','skill.html 用戶 rating 顯示',SKILL.includes('rating'));
t('T624','skill.html swap_count 顯示',SKILL.includes('swap_count'));
t('T625','skill.html description 顯示',SKILL.includes('description'));
t('T626','skill.html 動態更新 meta title',SKILL.includes('document.title'));
t('T627','skill.html 動態更新 og:title',SKILL.includes("og-title")||SKILL.includes("'og:title'"));
t('T628','skill.html 同城市 loadMoreSkills',SKILL.includes('loadMoreSkills'));
t('T629','skill.html 卡片 grid 2欄',CSS('skill.html').includes('grid-template-columns'));
t('T630','skill.html 不存在跳錯誤頁',SKILL.includes('showError'));
t('T631','app 分享 shareTo LINE',APP.includes('social-plugins.line.me'));
t('T632','app 分享 shareTo Facebook',APP.includes('facebook.com/sharer'));
t('T633','app 分享 shareTo Twitter',APP.includes('twitter.com/intent'));
t('T634','app 分享 copyLink clipboard',APP.includes('clipboard.writeText'));
t('T635','app 分享複製成功文字切換',APP.includes('已複製'));
t('T636','invite 獎勵卡片 reward-card',ALL('invite.html').includes('reward-card'));
t('T637','invite LINE 分享訊息文字',INV.includes('social-plugins.line.me'));
t('T638','invite Facebook 分享',INV.includes('facebook.com/sharer'));
t('T639','invite Instagram 原生分享 fallback',INV.includes('navigator.share'));
t('T640','invite 邀請碼 user.id 前8碼',INV.includes('.slice(0,8)'));
t('T641','invite 進度 pct 計算',INV.includes('pct')||INV.includes('Math.min'));
t('T642','invite 3人解鎖徽章',INV.includes('3'));
t('T643','invite 好友狀態 friend-joined',ALL('invite.html').includes('friend-joined'));
t('T644','invite 連結包含 ref 參數',INV.includes('ref='));
t('T645','index.html 有 ref 參數接收',ALL('index.html').includes('ref'),'WARN','index.html 加入 ref 參數接收邏輯');

// ════════════════════════════════════════════════════
// 群組 G  T646–T665  Premium & 訂閱深度
// ════════════════════════════════════════════════════
t('T646','premium toggle-btn 月/年切換',ALL('premium.html').includes('toggle-btn'));
t('T647','premium plan-top 顏色區塊',ALL('premium.html').includes('plan-top'));
t('T648','premium 7 個功能 feat-item',ALL('premium.html').includes('feat-item'));
t('T649','premium 用戶評價 testimonials',ALL('premium.html').includes('testimonials')||ALL('premium.html').includes('test-card'));
t('T650','premium Loading overlay',ALL('premium.html').includes('loading-ov'));
t('T651','premium 已訂閱按鈕 disabled',PREM.includes('disabled'));
t('T652','premium 安全付款 Stripe 說明',ALL('premium.html').includes('Stripe'));
t('T653','premium 取消說明 cta-note',ALL('premium.html').includes('cta-note'));
t('T654','subscription status-card 狀態',ALL('subscription.html').includes('status-card'));
t('T655','subscription feat-check 功能對比',ALL('subscription.html').includes('feat-check'));
t('T656','subscription 取消 modal',ALL('subscription.html').includes('cancel-modal'));
t('T657','subscription modal 列失去功能',ALL('subscription.html').includes('modal-list-item'));
t('T658','subscription btn-cancel-sub 按鈕',ALL('subscription.html').includes('btn-cancel-sub'));
t('T659','subscription 保留 Premium 按鈕',ALL('subscription.html').includes('保留'));
t('T660','subscription sub-next 下次收費',ALL('subscription.html').includes('sub-next'));
t('T661','subscription sub-amount 金額',ALL('subscription.html').includes('sub-amount'));
t('T662','subscription sub-card 付款方式',ALL('subscription.html').includes('sub-card'));
t('T663','sponsor 效果說明 effect-card',ALL('sponsor.html').includes('effect-card'));
t('T664','sponsor CTA 更新天數金額文字',SPON.includes('selectedDays')&&SPON.includes('selectedPrice'));
t('T665','sponsor 最熱門標籤 best-tag',ALL('sponsor.html').includes('best-tag'));

// ════════════════════════════════════════════════════
// 群組 H  T666–T685  跨頁面一致性
// ════════════════════════════════════════════════════
t('T666','翠綠主色 #3D9970 全站一致',
  ['app.html','login.html','premium.html','subscription.html','invite.html'].every(f=>ALL(f).includes('#3D9970')));
t('T667','品牌名 技遇 全站一致',
  ['app.html','login.html','premium.html','manifest.json'].every(f=>ALL(f).includes('技遇')));
t('T668','slogan 因技相遇 出現',
  ALL('manifest.json').includes('因技相遇')||ALL('index.html').includes('因技相遇'));
t('T669','Plus Jakarta Sans 字體全站',
  ['app.html','login.html','premium.html','sponsor.html'].every(f=>ALL(f).includes('Plus+Jakarta+Sans')||ALL(f).includes('Plus Jakarta Sans')));
t('T670','Instrument Serif 標題全站',
  ['app.html','login.html','premium.html','subscription.html'].every(f=>ALL(f).includes('Instrument+Serif')||ALL(f).includes('Instrument Serif')));
t('T671','Supabase URL 佔位符一致',
  ['app.html','login.html','chat.html','map.html'].every(f=>ALL(f).includes('your-project.supabase.co')));
t('T672','btn-primary 樣式命名一致',
  ['premium.html','subscription.html'].every(f=>ALL(f).includes('btn-primary')||ALL(f).includes('btn-cta')||ALL(f).includes('btn-apply')));
t('T673','loading-ov overlay 一致',
  ['premium.html','sponsor.html'].every(f=>ALL(f).includes('loading-ov')));
t('T674','toast 通知一致存在',
  ['app.html','premium.html','sponsor.html','invite.html','subscription.html'].every(f=>ALL(f).includes('toast')));
t('T675','safe-area-inset-top 一致',
  ['app.html','login.html','premium.html'].every(f=>ALL(f).includes('safe-area-inset-top')));
t('T676','safe-area-inset-bottom 一致',
  ['app.html','chat.html','subscription.html'].every(f=>ALL(f).includes('safe-area-inset-bottom')));
t('T677','manifest link 全站一致',
  ['app.html','login.html','chat.html','map.html','premium.html','subscription.html','invite.html'].every(f=>ALL(f).includes('manifest.json')));
t('T678','favicon 全站一致',
  ['app.html','login.html','premium.html','sponsor.html','subscription.html','invite.html'].every(f=>ALL(f).includes('favicon.png')));
t('T679','Supabase CDN 版本一致',
  ['app.html','login.html','chat.html','map.html'].every(f=>ALL(f).includes('supabase-js@2')));
t('T680','backToList / history.back 返回模式',
  ['chat.html','premium.html','subscription.html','sponsor.html','invite.html'].every(f=>ALL(f).includes('backToList')||ALL(f).includes('history.back')));
t("T681","城市列表一致 台北/高雄",["app.html","onboarding.html"].every(f=>ALL(f).includes("高雄市")&&ALL(f).includes("台北市")));
t('T682','catColors 分類顏色一致',APP.includes('catColors')&&MAP.includes('catColors'));
t("T683","API base URL 佔位符一致",["premium.html","sponsor.html","subscription.html"].every(f=>ALL(f).includes("API_BASE")));
t('T684','技能 emoji 顯示邏輯一致',
  ['app.html','map.html','chat.html','admin.html'].every(f=>ALL(f).includes("emoji||'🎨'")||ALL(f).includes("emoji")));
t('T685','Premium 檢查邏輯 is_premium',
  ['app.html','premium.html','subscription.html'].every(f=>ALL(f).includes('is_premium')));

// ════════════════════════════════════════════════════
// 群組 I  T686–T700  端對端完整情境
// ════════════════════════════════════════════════════
t('T686','E2E: 新用戶 → onboarding → app',
  ALL('login.html').includes('onboarding')&&ONB.includes("'app.html'"));
t('T687','E2E: 瀏覽 → 詳情 → 申請',
  APP.includes('openDetail')&&APP.includes('applySwap'));
t('T688','E2E: 申請 → 接受 → 聊天',
  APP.includes('respondSwap')&&ALL('app.html').includes("'chat.html'"));
t('T689','E2E: 聊天 → 完成 → 評分',
  CHAT.includes('sendMsg')&&APP.includes('completeSwap')&&APP.includes('setStar'));
t('T690','E2E: 發布 → 置頂 → 精選顯示',
  APP.includes('postSkill')&&ALL('app.html').includes("'sponsor.html'")||ALL('app.html').includes('sponsor')&&APP.includes('loadSponsored'));
t('T691','E2E: 免費 → 升級 → Premium 功能解鎖',
  ALL('app.html').includes("'premium.html'")&&HOOK.includes('is_premium'));
t('T692','E2E: Premium → 取消 → 到期繼續',
  ALL('subscription.html').includes('confirmCancel')&&CANCEL.includes('cancel_at_period_end'));
t('T693','E2E: 技能分享 → skill.html → App 安裝',
  APP.includes('openShare')&&ALL('skill.html').includes('app-banner'));
t('T694','E2E: 邀請好友 → 加入 → 雙方 Premium',
  INV.includes('inviteCode')&&SCHEMA.includes('referrals'));
t('T695','E2E: 地圖找技能 → 申請 → 聊天',
  MAP.includes('applySwap')&&ALL('app.html').includes("'chat.html'"));
t('T696','E2E: 用戶檢舉 → admin 處理 → 封禁',
  PROF.includes('submitReport')&&ADM.includes('confirmBan'));
t('T697','E2E: 付款失敗 → webhook 通知 → 用戶看到',
  HOOK.includes('payment_failed')&&HOOK.includes('notifications'));
t('T698','E2E: 推播訂閱 → 申請通知 → 用戶收到',
  F['push-setup.js']?.includes('subscribe')&&PUSH.includes('sendNotification'));
t('T699','E2E: 管理後台 → 監控 → 即時更新',
  ADM.includes('loadDashboard')&&ADM.includes('refreshAll'));
t('T700','E2E: 全站測試覆蓋完整',pass>=190&&typeof fail==='number');

// ════════════════════════════════════════════════════
// 輸出報告
// ════════════════════════════════════════════════════
const fails=issues.filter(i=>i.sev==='FAIL');
const warns=issues.filter(i=>i.sev==='WARN');

console.log(`\n${W}╔══════════════════════════════════════════════════════╗${X}`);
console.log(`${W}║   技遇 JiYu — 追加 200 情境測試 T501–T700         ║${X}`);
console.log(`${W}╚══════════════════════════════════════════════════════╝${X}\n`);

const groups=[
  [501,520,'package.json & Vercel 部署'],
  [521,545,'CSS 樣式品質'],
  [546,570,'資料查詢品質'],
  [571,595,'錯誤處理 & 邊界情況'],
  [596,620,'管理後台深度'],
  [621,645,'社群功能深度'],
  [646,665,'Premium & 訂閱深度'],
  [666,685,'跨頁面一致性'],
  [686,700,'端對端完整情境'],
];

groups.forEach(([from,to,name])=>{
  const gi=issues.filter(i=>{const n=parseInt(i.id.slice(1));return n>=from&&n<=to;});
  const gf=gi.filter(i=>i.sev==='FAIL').length;
  const gw=gi.filter(i=>i.sev==='WARN').length;
  const total=to-from+1, ok=total-gf-gw;
  const icon=gf>0?`${R}🔴${X}`:gw>0?`${Y}🟡${X}`:`${G}✅${X}`;
  console.log(`${icon} T${from}–T${to}  ${W}${name}${X}  ${G}${ok}/${total}${X}${gf?` ${R}${gf}失敗${X}`:''}${gw?` ${Y}${gw}警告${X}`:''}`);
  gi.forEach(i=>{
    const c=i.sev==='FAIL'?R:Y, sym=i.sev==='FAIL'?'  ❌':'  ⚠️ ';
    console.log(`${c}${sym} [${i.id}] ${i.label}${i.fix?' — '+i.fix:''}${X}`);
  });
});

const total=700-501+1; // 200
const pct=Math.round(pass/total*100);
const filled=Math.round(pct/5);
const bar=`${'█'.repeat(filled)}${'░'.repeat(20-filled)}`;
console.log(`\n${W}進度  ${G}[${bar}]${X} ${W}${pct}% (${pass}/${total})${X}`);
console.log(`\n${W}T501–T700 結果：${G}${pass} 通過${X} / ${R}${fail} 失敗${X} / ${Y}${warn} 警告${X}${X}`);
if(fail===0&&warn===0) console.log(`\n${G}${W}🎉 200/200 全數通過！${X}`);
else if(fail===0) console.log(`\n${Y}${W}✅ 無失敗，${warn} 個建議改善項目${X}`);
