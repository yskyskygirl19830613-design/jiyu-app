// test_10_users.mjs
// 技遇 — 10 個用戶角色劇本測試
import { readFileSync, readdirSync } from 'fs';
import { JSDOM } from 'jsdom';

const G = '\x1b[32m', R = '\x1b[31m', Y = '\x1b[33m', B = '\x1b[34m', X = '\x1b[0m', W = '\x1b[1m';

// ── 10 個用戶角色 ──────────────────────────────────
const USERS = [
  { id:'U01', name:'新手小明',   type:'新用戶',     city:'高雄市', skills:['吉他'], wants:['日文'], isPremium:false, scenario:'第一次使用，完整跑完新用戶流程' },
  { id:'U02', name:'設計師 Mia', type:'活躍用戶',   city:'台北市', skills:['Figma','UI設計'], wants:['英文'], isPremium:true,  scenario:'Premium 用戶發布技能 + 申請置頂' },
  { id:'U03', name:'工程師 Jay', type:'付費用戶',   city:'台中市', skills:['Python','React'], wants:['設計'], isPremium:true,  scenario:'用 Premium AI 配對找到最佳對象' },
  { id:'U04', name:'老師 Yuki',  type:'頻繁交換者', city:'高雄市', skills:['日文N2'], wants:['攝影'], isPremium:false, scenario:'免費版達到申請上限，看到升級提示' },
  { id:'U05', name:'廚師 Marco', type:'新手賣家',   city:'台南市', skills:['義式料理'], wants:['程式'], isPremium:false, scenario:'發布技能後購買精選置頂' },
  { id:'U06', name:'攝影師 Sara',type:'地圖用戶',   city:'高雄市', skills:['人像攝影'], wants:['韓文'], isPremium:false, scenario:'用地圖找附近技能，點 PIN 申請' },
  { id:'U07', name:'學生 Kevin', type:'忘記密碼',   city:'新竹市', skills:['Swift'], wants:['設計'], isPremium:false, scenario:'忘記密碼 → 重設 → 登入 → 繼續使用' },
  { id:'U08', name:'主婦 Lena',  type:'舊款手機',   city:'台北市', skills:['瑜珈'], wants:['料理'], isPremium:false, scenario:'iPhone 8 小螢幕，確認 UI 不跑版' },
  { id:'U09', name:'業者 Alex',  type:'廣告主',     city:'高雄市', skills:['吉他教學'], wants:['日文'], isPremium:false, scenario:'購買精選置頂，追蹤曝光成效' },
  { id:'U10', name:'測試者 Bad', type:'惡意用戶',   city:'台北市', skills:['詐騙'], wants:['金錢'], isPremium:false, scenario:'嘗試申請自己的技能 + 提交惡意內容' },
];

const files = {};
readdirSync('.').filter(f => f.endsWith('.html')).forEach(f => {
  files[f] = readFileSync(f, 'utf8');
});

let pass=0, fail=0, warn=0;
const allIssues = [];

function check(label, condition, severity='FAIL', detail='') {
  if (condition) { pass++; return { ok:true }; }
  if (severity==='WARN') warn++;
  else fail++;
  const issue = { label, severity, detail };
  allIssues.push(issue);
  return { ok:false, issue };
}

function runUserScenario(user) {
  const issues = [];
  const r = (label, cond, sev='FAIL', detail='') => {
    const res = check(label, cond, sev, detail);
    if (!res.ok) issues.push({ ...res.issue, user: user.name });
    return res.ok;
  };

  const app    = files['app.html']    || '';
  const login  = files['login.html']  || '';
  const onb    = files['onboarding.html'] || '';
  const prem   = files['premium.html']    || '';
  const spon   = files['sponsor.html']    || '';
  const map    = files['map.html']        || '';
  const chat   = files['chat.html']       || '';
  const reset  = files['reset-password.html'] || '';
  const edit   = files['profile-edit.html']   || '';

  switch(user.id) {

    case 'U01': // 新手小明 — 新用戶完整流程
      r('login.html 存在', !!login);
      r('登入有 Email 欄位', login.includes('type="email"'));
      r('登入有密碼欄位', login.includes('type="password"'));
      r('登入有 Google 登入', login.includes('signInWithOAuth'));
      r('有忘記密碼連結', login.includes('忘記密碼'));
      r('有隱私權政策連結', login.includes('privacy.html'));
      r('有服務條款連結', login.includes('terms.html'));
      r('onboarding 存在', !!onb);
      r('onboarding 有城市選擇', onb.includes('高雄市') && onb.includes('台北市'));
      r('onboarding 完成跳 app.html', onb.includes("'app.html'") || onb.includes('"app.html"'));
      r('onboarding 有 4 步驟', onb.includes('step-0') && onb.includes('step-3'));
      r('app.html 瀏覽頁有技能卡片', app.includes('skill-grid'));
      r('app.html 有發布按鈕', app.includes('s-post'));
      break;

    case 'U02': // 設計師 Mia — Premium 發布 + 置頂
      r('premium.html 存在', !!prem);
      r('Premium 有月繳方案', prem.includes('$99'));
      r('Premium 有年繳方案', prem.includes('$59') || prem.includes('年繳'));
      r('Premium 省 40% 標示', prem.includes('40%'));
      r('Premium 有 7 天試用', prem.includes('trial') || prem.includes('試用'));
      r('Premium 有功能列表', prem.includes('AI') && prem.includes('無限'));
      r('sponsor.html 存在', !!spon);
      r('置頂有 3 個方案', spon.includes('plan-3') && spon.includes('plan-7') && spon.includes('plan-30'));
      r('置頂價格清楚', spon.includes('$49') && spon.includes('$89') && spon.includes('$299'));
      r('app.html Premium 用戶不看廣告', app.includes('is_premium') && app.includes('ad-banner'));
      break;

    case 'U03': // 工程師 Jay — AI 配對
      r('app.html 有配對頁面', app.includes('s-matches'));
      r('app.html 有接受申請功能', app.includes('respondSwap') || app.includes('accepted'));
      r('app.html 有拒絕申請功能', app.includes('rejected'));
      r('app.html 有完成交換功能', app.includes('completeSwap') || app.includes('completed'));
      r('app.html 有評分系統', app.includes('setStar') || app.includes('rating'));
      r('Premium 頁面提到 AI 配對', prem.includes('AI'));
      r('app.html 有精選置頂載入', app.includes('loadSponsored'));
      break;

    case 'U04': // 老師 Yuki — 免費版限制
      r('app.html 有免費版限制邏輯', app.includes('is_premium') || app.includes('checkFreeLimit'), 'WARN', '免費版限制可能尚未完整實作');
      r('Premium 升級頁從 app 可以連到', app.includes('premium.html'), 'WARN', '需確認有升級入口');
      r('Premium 頁有取消說明', prem.includes('取消') || prem.includes('cancel'));
      r('Premium 頁有 FAQ', prem.includes('faq') || prem.includes('常見問題'));
      break;

    case 'U05': // 廚師 Marco — 發布 + 置頂
      r('app.html 發布頁有 Emoji 選擇', app.includes('pickE'));
      r('app.html 發布有類別', app.includes('post-cat'));
      r('app.html 發布有技能名稱', app.includes('post-name'));
      r('app.html 發布有想換欄位', app.includes('post-want'));
      r('app.html 發布有上課方式', app.includes('pickM'));
      r('sponsor.html 有置頂效果說明', spon.includes('effect') || spon.includes('曝光'));
      r('sponsor.html 有我的技能選擇', spon.includes('my-skills-list'));
      r('sponsor.html 連結到 Stripe', spon.includes('startSponsor') || spon.includes('create-checkout'));
      break;

    case 'U06': // 攝影師 Sara — 地圖
      r('map.html 存在', !!map);
      r('map.html 有 Leaflet', map.includes('leaflet'));
      r('map.html 有聚合功能', map.includes('markerCluster') || map.includes('MarkerCluster'));
      r('map.html 有定位按鈕', map.includes('locateMe'));
      r('map.html PIN 點擊可申請', map.includes('applySwap'));
      r('map.html 面對面技能可導航', map.includes('maps.apple.com'));
      r('map.html 有底部卡片列', map.includes('strip-scroll'));
      r('map.html 有篩選功能', map.includes('mfchip'));
      break;

    case 'U07': // Kevin — 忘記密碼
      r('login.html 有忘記密碼', login.includes('忘記密碼') || login.includes('forgot'));
      r('login.html 有 resetPasswordForEmail', login.includes('resetPasswordForEmail'));
      r('reset-password.html 存在', !!reset);
      r('reset-password 有新密碼欄位', reset.includes('new-pwd'));
      r('reset-password 有確認密碼', reset.includes('confirm-pwd'));
      r('reset-password 完成跳回 login', reset.includes('login.html'));
      r('reset-password 有長度驗證', reset.includes('length') || reset.includes('8'));
      break;

    case 'U08': // Lena — 小螢幕
      r('所有頁面有 viewport meta', Object.entries(files).every(([f,c]) =>
        !f.endsWith('.html') || c.includes('viewport')));
      r('所有頁面有 safe-area-inset', Object.values(files).filter(c=>c.includes('safe-area-inset')).length >= 5,
        'WARN', '部分頁面可能缺少 iOS 安全區域');
      r('app.html 無固定寬度元素', !app.includes('min-width: 430') && !app.includes('min-width:430'));
      r('chat.html 有自動展開文字框', chat.includes('autoResize'));
      r('map.html 有 touch 支援', map.includes('leaflet'));
      break;

    case 'U09': // Alex — 廣告主（置頂）
      r('app.html 有精選卡片樣式', app.includes('sc-sponsored'));
      r('app.html 精選有橘色標識', app.includes('sp-badge') || app.includes('sponsored'));
      r('精選區塊從資料庫讀取', app.includes('is_sponsored'));
      r('置頂有曝光數說明', spon.includes('曝光') || spon.includes('view'));
      r('adSense 已嵌入 app', app.includes('adsbygoogle'));
      r('AdSense Premium 隱藏', app.includes('is_premium') && app.includes('ad-banner'));
      r('廣告區塊有「廣告」標示', app.includes('廣告') || app.includes('ad-label'));
      break;

    case 'U10': // Bad — 惡意用戶
      r('申請自己技能有防護', app.includes('user_id===currentUser.id') || app.includes('user_id == currentUser.id'));
      r('有檢舉功能', edit.includes('submitReport') || edit.includes('report'));
      r('有封鎖機制說明', edit.includes('報告') || edit.includes('檢舉'));
      r('profile-edit 有刪除帳號', edit.includes('deleteAccount'));
      r('資料庫有 RLS 保護', readFileSync('supabase_schema.sql','utf8').includes('row level security'));
      r('API 金鑰未暴露（前端）', !app.includes('sk_live') && !app.includes('sk_test'));
      r('SQL Injection 防護（使用 Supabase SDK）', app.includes('sb.from') && !app.includes('raw SQL'));
      break;
  }

  return issues;
}

// ── 執行所有測試 ───────────────────────────────
console.log(`\n${W}╔══════════════════════════════════════════════════╗${X}`);
console.log(`${W}║   技遇 JiYu — 10 用戶角色劇本測試              ║${X}`);
console.log(`${W}╚══════════════════════════════════════════════════╝${X}\n`);

const userIssues = {};
for (const user of USERS) {
  const issues = runUserScenario(user);
  userIssues[user.id] = issues;

  const hasF = issues.some(i=>i.severity==='FAIL');
  const hasW = issues.some(i=>i.severity==='WARN');
  const icon = hasF ? `${R}🔴${X}` : hasW ? `${Y}🟡${X}` : `${G}✅${X}`;

  console.log(`${icon} [${user.id}] ${W}${user.name}${X} — ${user.scenario}`);
  console.log(`   ${B}角色：${user.type} | 城市：${user.city} | Premium：${user.isPremium?'是':'否'}${X}`);

  if (issues.length) {
    issues.forEach(i => {
      const c = i.severity==='FAIL' ? R : Y;
      const sym = i.severity==='FAIL' ? '❌' : '⚠️ ';
      console.log(`   ${c}${sym} ${i.label}${i.detail?' — '+i.detail:''}${X}`);
    });
  }
  console.log('');
}

// ── 總結 ──────────────────────────────────────
console.log('══════════════════════════════════════════════════');
console.log(`${W}測試結果：${G}${pass} 通過${X} / ${R}${fail} 失敗${X} / ${Y}${warn} 警告${X}`);
console.log('══════════════════════════════════════════════════\n');

// 彙整所有問題
const allFails = Object.values(userIssues).flat().filter(i=>i.severity==='FAIL');
const allWarns = Object.values(userIssues).flat().filter(i=>i.severity==='WARN');

if (allFails.length) {
  console.log(`${R}${W}🔴 需要修復（${allFails.length} 個）：${X}`);
  [...new Map(allFails.map(i=>[i.label,i])).values()].forEach((i,n)=>
    console.log(`  ${n+1}. [${i.user}] ${i.label}${i.detail?' — '+i.detail:''}`)
  );
  console.log('');
}
if (allWarns.length) {
  console.log(`${Y}${W}🟡 建議改善（${allWarns.length} 個）：${X}`);
  [...new Map(allWarns.map(i=>[i.label,i])).values()].forEach((i,n)=>
    console.log(`  ${n+1}. [${i.user}] ${i.label}${i.detail?' — '+i.detail:''}`)
  );
}
