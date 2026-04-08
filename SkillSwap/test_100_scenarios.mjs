// test_100_scenarios.mjs
// 技遇 JiYu — 100 情境完整測試
import { readFileSync, readdirSync } from 'fs';

const G='\x1b[32m',R='\x1b[31m',Y='\x1b[33m',B='\x1b[34m',X='\x1b[0m',W='\x1b[1m';
let pass=0,fail=0,warn=0;
const issues=[];

// 載入所有檔案
const F={};
readdirSync('.').filter(f=>f.endsWith('.html')||f.endsWith('.js')||f.endsWith('.json')||f.endsWith('.sql')||f.endsWith('.md')).forEach(f=>{
  try{ F[f]=readFileSync(f,'utf8'); }catch{}
});
try{ F['api/create-checkout-session.js']=readFileSync('api/create-checkout-session.js','utf8'); }catch{}
try{ F['api/stripe-webhook.js']=readFileSync('api/stripe-webhook.js','utf8'); }catch{}
try{ F['api/send-push.js']=readFileSync('api/send-push.js','utf8'); }catch{}
try{ F['api/cancel-subscription.js']=readFileSync('api/cancel-subscription.js','utf8'); }catch{}

function t(id,label,cond,sev='FAIL',fix=''){
  if(cond){pass++;return true;}
  if(sev==='WARN')warn++;else fail++;
  issues.push({id,label,sev,fix});
  return false;
}

// ════════════════════════════════════════════════
// 01–10  基礎結構
// ════════════════════════════════════════════════
t('T001','app.html 存在',!!F['app.html']);
t('T002','login.html 存在',!!F['login.html']);
t('T003','onboarding.html 存在',!!F['onboarding.html']);
t('T004','chat.html 存在',!!F['chat.html']);
t('T005','map.html 存在',!!F['map.html']);
t('T006','premium.html 存在',!!F['premium.html']);
t('T007','sponsor.html 存在',!!F['sponsor.html']);
t('T008','subscription.html 存在',!!F['subscription.html']);
t('T009','skill.html 存在',!!F['skill.html']);
t('T010','invite.html 存在',!!F['invite.html']);

// ════════════════════════════════════════════════
// 11–20  PWA & 資源
// ════════════════════════════════════════════════
t('T011','manifest.json 存在',!!F['manifest.json']);
t('T012','service-worker.js 存在',!!F['service-worker.js']);
t('T013','manifest 有 name 技遇',F['manifest.json']?.includes('技遇'));
t('T014','manifest 有 short_name',F['manifest.json']?.includes('short_name'));
t('T015','manifest 有 icons',F['manifest.json']?.includes('icon-192.png'));
t('T016','manifest standalone 模式',F['manifest.json']?.includes('standalone'));
t('T017','service-worker 有 install 事件',F['service-worker.js']?.includes("'install'"));
t('T018','service-worker 有 fetch 事件',F['service-worker.js']?.includes("'fetch'"));
t('T019','service-worker 有 push 事件',F['service-worker.js']?.includes("'push'"),'WARN','service-worker.js 加入 push 事件');
t('T020','push-setup.js 存在',!!F['push-setup.js']);

// ════════════════════════════════════════════════
// 21–30  登入 / 驗證流程
// ════════════════════════════════════════════════
t('T021','login 有 email 欄位',F['login.html']?.includes('type="email"'));
t('T022','login 有 password 欄位',F['login.html']?.includes('type="password"'));
t('T023','login 有 Google 登入',F['login.html']?.includes('signInWithOAuth'));
t('T024','login 有忘記密碼',F['login.html']?.includes('resetPasswordForEmail'));
t('T025','login 有隱私權連結',F['login.html']?.includes('privacy.html'));
t('T026','login 有服務條款連結',F['login.html']?.includes('terms.html'));
t('T027','login 成功跳 app.html',F['login.html']?.includes("'app.html'"));
t('T028','reset-password 有 updateUser',F['reset-password.html']?.includes('updateUser'));
t('T029','reset-password 有密碼長度驗證',F['reset-password.html']?.includes('length'));
t('T030','onboarding 完成跳 app.html',F['onboarding.html']?.includes("'app.html'"));

// ════════════════════════════════════════════════
// 31–40  app.html 主功能
// ════════════════════════════════════════════════
t('T031','app 有技能格子',F['app.html']?.includes('skill-grid'));
t('T032','app 有搜尋框',F['app.html']?.includes('search-input'));
t('T033','app 有城市篩選',F['app.html']?.includes('setCity'));
t('T034','app 有分類篩選',F['app.html']?.includes('fchip'));
t('T035','app 有發布技能',F['app.html']?.includes('postSkill'));
t('T036','app 有技能下架',F['app.html']?.includes('unpublishSkill'));
t('T037','app 有申請交換',F['app.html']?.includes('applySwap'));
t('T038','app 有接受/拒絕',F['app.html']?.includes('respondSwap'));
t('T039','app 有完成交換',F['app.html']?.includes('completeSwap'));
t('T040','app 有評分',F['app.html']?.includes('setStar'));

// ════════════════════════════════════════════════
// 41–50  導航 & 頁面連結
// ════════════════════════════════════════════════
t('T041','app → chat.html',F['app.html']?.includes("'chat.html'"));
t('T042','app → map.html',F['app.html']?.includes("'map.html'"));
t('T043','app → profile-edit.html',F['app.html']?.includes("'profile-edit.html'"));
t('T044','app → premium.html',F['app.html']?.includes("'premium.html'"));
t('T045','app → subscription.html',F['app.html']?.includes("'subscription.html'"));
t('T046','app → invite.html',F['app.html']?.includes("'invite.html'"));
t('T047','app goTo key 語法正確',F['app.html']?.includes("{'s-browse'"));
t('T048','app 底部有訊息 tab → chat',F['app.html']?.includes("'chat.html'")&&F['app.html']?.includes('ni-chat'),'WARN','底部導覽列加入 chat.html 連結');
t('T049','profile-edit → login 登出',F['profile-edit.html']?.includes('login.html'));
t('T050','onboarding → login 未登入跳轉',F['onboarding.html']?.includes('login.html'));

// ════════════════════════════════════════════════
// 51–60  安全 & 防護
// ════════════════════════════════════════════════
t('T051','申請自己技能有防護',F['app.html']?.includes('user_id===currentUser.id'));
t('T052','無 Stripe live key 外洩',!F['app.html']?.includes('sk_live'));
t('T053','無 Stripe test key 外洩',!F['app.html']?.includes('sk_test'));
t('T054','RLS 有啟用',F['supabase_schema.sql']?.includes('row level security'));
t('T055','blocks 資料表存在',F['supabase_schema.sql']?.includes('public.blocks'));
t('T056','push_subscriptions 資料表存在',F['supabase_schema.sql']?.includes('push_subscriptions'));
t('T057','referrals 資料表存在',F['supabase_schema.sql']?.includes('public.referrals'));
t('T058','reports 資料表存在',F['supabase_schema.sql']?.includes('public.reports'));
t('T059','封鎖功能 blockUser 存在',F['app.html']?.includes('blockUser'));
t('T060','無 console.error 裸露',!(F['app.html']?.match(/console\.error\([^)]+\)(?!\s*\/\/)/)||false),'WARN','包裝 console.error');

// ════════════════════════════════════════════════
// 61–70  收費系統
// ════════════════════════════════════════════════
t('T061','premium 有月繳 $99',F['premium.html']?.includes('$99'));
t('T062','premium 有年繳 $59',F['premium.html']?.includes('$59'));
t('T063','premium 有 7 天試用',F['premium.html']?.includes('試用'));
t('T064','premium 有 FAQ',F['premium.html']?.includes('faq')||F['premium.html']?.includes('常見問題'));
t('T065','sponsor 有 3 個方案',F['sponsor.html']?.includes('plan-3')&&F['sponsor.html']?.includes('plan-30'));
t('T066','sponsor 價格 $49/$89/$299',F['sponsor.html']?.includes('$49')&&F['sponsor.html']?.includes('$299'));
t('T067','subscription 有取消功能',F['subscription.html']?.includes('confirmCancel'));
t('T068','API cancel-subscription 存在',!!F['api/cancel-subscription.js']);
t('T069','API create-checkout 支援一次性付款',F['api/create-checkout-session.js']?.includes("'payment'"));
t('T070','Stripe webhook 處理訂閱建立',F['api/stripe-webhook.js']?.includes('subscription.created'));

// ════════════════════════════════════════════════
// 71–80  地圖 & 聊天
// ════════════════════════════════════════════════
t('T071','map 有 Leaflet',F['map.html']?.includes('leaflet'));
t('T072','map 有 MarkerCluster',F['map.html']?.includes('markerCluster'));
t('T073','map 有定位',F['map.html']?.includes('locateMe'));
t('T074','map 有篩選',F['map.html']?.includes('mfchip'));
t('T075','map 有 Apple Maps 導航',F['map.html']?.includes('maps.apple.com'));
t('T076','map openDetById 防注入',F['map.html']?.includes('openDetById'));
// T077：只檢查 <script> 標籤內（style 和 HTML inline style 是合法的）
const mapScripts = [...((F['map.html']||'').matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))].map(m=>m[1]).join('\n');
t('T077','map script 區塊無 CSS var()',!mapScripts.includes('color:var(--'));
t('T078','chat 有 Supabase Realtime',F['chat.html']?.includes('.channel('));
t('T079','chat 有返回列表',F['chat.html']?.includes('backToList'));
t('T080','chat 有 manifest link',F['chat.html']?.includes('manifest.json'));

// ════════════════════════════════════════════════
// 81–90  廣告 & 分享
// ════════════════════════════════════════════════
t('T081','AdSense 已嵌入',F['app.html']?.includes('adsbygoogle'));
t('T082','Premium 用戶隱藏廣告',F['app.html']?.includes('ad-banner')&&F['app.html']?.includes('is_premium'));
t('T083','廣告有「廣告」標示',F['app.html']?.includes('ad-label'));
t('T084','精選置頂載入',F['app.html']?.includes('loadSponsored'));
t('T085','精選卡片有橘色標示',F['app.html']?.includes('sc-sponsored'));
t('T086','分享 Sheet 存在',F['app.html']?.includes('share-overlay'));
t('T087','分享有 LINE',F['app.html']?.includes('social-plugins.line.me'));
t('T088','分享有 Facebook',F['app.html']?.includes('facebook.com/sharer'));
t('T089','skill.html 有 OG tags',F['skill.html']?.includes('og:title'));
t('T090','skill.html 有 Twitter Card',F['skill.html']?.includes('twitter:card'));

// ════════════════════════════════════════════════
// 91–100  UX & 無障礙
// ════════════════════════════════════════════════
t('T091','所有 HTML 有 viewport',['app.html','login.html','chat.html','map.html','premium.html','onboarding.html','profile-edit.html','sponsor.html','subscription.html','skill.html','invite.html','reset-password.html','admin.html'].every(f=>F[f]?.includes('viewport')));
t('T092','所有頁面有 safe-area-inset',['app.html','login.html','premium.html','subscription.html'].every(f=>F[f]?.includes('safe-area-inset')));
t('T093','invite.html 有邀請碼',F['invite.html']?.includes('inviteCode'));
t('T094','invite.html 分享 LINE',F['invite.html']?.includes('social-plugins.line.me'));
t('T095','admin.html 有用戶管理',F['admin.html']?.includes('users-table'));
t('T096','admin.html 有收入報表',F['admin.html']?.includes('rev-total'));
t('T097','admin.html 有檢舉管理',F['admin.html']?.includes('resolveReport'));
t('T098','admin.html 有封禁功能',F['admin.html']?.includes('confirmBan'));
t('T099','推播通知有 requestPermission',F['push-setup.js']?.includes('requestPermission'));
t('T100','API send-push 存在',!!F['api/send-push.js']);

// ════════════════════════════════════════════════
// 輸出結果
// ════════════════════════════════════════════════
const fails=issues.filter(i=>i.sev==='FAIL');
const warns=issues.filter(i=>i.sev==='WARN');

console.log(`\n${W}╔══════════════════════════════════════════════════╗${X}`);
console.log(`${W}║   技遇 JiYu — 100 情境完整測試報告             ║${X}`);
console.log(`${W}╚══════════════════════════════════════════════════╝${X}\n`);

if(fails.length||warns.length){
  if(fails.length){
    console.log(`${R}${W}🔴 錯誤（${fails.length} 個）${X}`);
    fails.forEach(i=>console.log(`  ${R}[${i.id}] ${i.label}${i.fix?' → '+i.fix:''}${X}`));
    console.log('');
  }
  if(warns.length){
    console.log(`${Y}${W}🟡 警告（${warns.length} 個）${X}`);
    warns.forEach(i=>console.log(`  ${Y}[${i.id}] ${i.label}${i.fix?' → '+i.fix:''}${X}`));
    console.log('');
  }
}

const pct=Math.round(pass/100*100);
const bar='█'.repeat(Math.floor(pct/5))+'░'.repeat(20-Math.floor(pct/5));
console.log(`進度  [${pass>=90?G:pass>=70?Y:R}${bar}${X}] ${pct}%`);
console.log(`\n${W}測試結果：${G}${pass} 通過${X} / ${R}${fail} 失敗${X} / ${Y}${warn} 警告${X}（共 100 個）${X}\n`);
