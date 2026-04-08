// test_30_scenarios.js
// SkillSwap 30 機型 × 情境測試腳本
// 執行: node test_30_scenarios.js

import { readFileSync, readdirSync } from 'fs';
import { JSDOM } from 'jsdom';

// ════════════════════════════════════════════
// 測試設備清單（30 種機型 + 情境）
// ════════════════════════════════════════════
const DEVICES = [
  // iPhone 系列
  { id:'D01', name:'iPhone SE (3rd)',    w:375,  h:667,  ua:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', pwa:true  },
  { id:'D02', name:'iPhone 13 mini',    w:375,  h:812,  ua:'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15', pwa:true  },
  { id:'D03', name:'iPhone 14',         w:390,  h:844,  ua:'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15', pwa:true  },
  { id:'D04', name:'iPhone 14 Pro',     w:393,  h:852,  ua:'Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15', pwa:true  },
  { id:'D05', name:'iPhone 15',         w:393,  h:852,  ua:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', pwa:true  },
  { id:'D06', name:'iPhone 15 Pro Max', w:430,  h:932,  ua:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15', pwa:true  },
  { id:'D07', name:'iPad Air',          w:820,  h:1180, ua:'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15',         pwa:false },
  { id:'D08', name:'iPad Pro 12.9"',    w:1024, h:1366, ua:'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15',         pwa:false },
  // Android 系列
  { id:'D09', name:'Samsung S23',       w:360,  h:780,  ua:'Mozilla/5.0 (Linux; Android 13; SM-S911B) AppleWebKit/537.36',               pwa:true  },
  { id:'D10', name:'Samsung S23 Ultra', w:384,  h:824,  ua:'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36',               pwa:true  },
  { id:'D11', name:'Google Pixel 8',    w:393,  h:851,  ua:'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36',                pwa:true  },
  { id:'D12', name:'Google Pixel 8 Pro',w:412,  h:892,  ua:'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36',            pwa:true  },
  { id:'D13', name:'OnePlus 12',        w:412,  h:915,  ua:'Mozilla/5.0 (Linux; Android 14; CPH2573) AppleWebKit/537.36',                pwa:true  },
  { id:'D14', name:'Xiaomi 14',         w:393,  h:851,  ua:'Mozilla/5.0 (Linux; Android 14; 2312DRAAbl) AppleWebKit/537.36',             pwa:true  },
  { id:'D15', name:'OPPO Find X7',      w:412,  h:892,  ua:'Mozilla/5.0 (Linux; Android 14; PGEM10) AppleWebKit/537.36',                 pwa:true  },
  // 低階機型
  { id:'D16', name:'Android Go (低階)', w:320,  h:568,  ua:'Mozilla/5.0 (Linux; Android 11; Nokia C20) AppleWebKit/537.36',              pwa:true  },
  { id:'D17', name:'iPhone 8 (舊款)',   w:375,  h:667,  ua:'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',pwa:true  },
  // 桌機/平板瀏覽器
  { id:'D18', name:'Chrome Desktop',    w:1440, h:900,  ua:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',         pwa:false },
  { id:'D19', name:'Safari Desktop',    w:1280, h:800,  ua:'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/605.1.15',          pwa:false },
  { id:'D20', name:'Firefox Desktop',   w:1920, h:1080, ua:'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox', pwa:false },
];

// 30 個用戶情境
const SCENARIOS = [
  // 新用戶流程
  { id:'S01', device:'D03', name:'新用戶 — 正常註冊',         flow:['login.html','onboarding.html','app.html'], user:{isNew:true,  city:'高雄市'} },
  { id:'S02', device:'D01', name:'新用戶 — 小螢幕 iPhone SE', flow:['login.html','onboarding.html','app.html'], user:{isNew:true,  city:'台北市'} },
  { id:'S03', device:'D09', name:'新用戶 — Android Samsung',  flow:['login.html','onboarding.html','app.html'], user:{isNew:true,  city:'台中市'} },
  { id:'S04', device:'D16', name:'新用戶 — 低階 Android',     flow:['login.html','onboarding.html','app.html'], user:{isNew:true,  city:'台南市'} },
  { id:'S05', device:'D07', name:'新用戶 — iPad 平板',         flow:['login.html','onboarding.html','app.html'], user:{isNew:true,  city:'桃園市'} },
  // 登入相關
  { id:'S06', device:'D05', name:'忘記密碼流程',               flow:['login.html','reset-password.html'],         user:{forgot:true} },
  { id:'S07', device:'D14', name:'Google 登入',                flow:['login.html','app.html'],                    user:{google:true} },
  { id:'S08', device:'D03', name:'密碼錯誤重試',               flow:['login.html'],                               user:{wrongPwd:true} },
  { id:'S09', device:'D17', name:'舊款 iPhone 登入',           flow:['login.html','app.html'],                    user:{isNew:false} },
  // 瀏覽技能
  { id:'S10', device:'D06', name:'瀏覽 — 切換城市',           flow:['app.html'],                                 user:{action:'browse', city:'台北市'} },
  { id:'S11', device:'D03', name:'瀏覽 — 分類篩選',           flow:['app.html'],                                 user:{action:'browse', category:'設計'} },
  { id:'S12', device:'D10', name:'瀏覽 — 搜尋技能',           flow:['app.html'],                                 user:{action:'browse', search:'Python'} },
  { id:'S13', device:'D16', name:'瀏覽 — 無資料情況',         flow:['app.html'],                                 user:{action:'browse', city:'花蓮縣', empty:true} },
  { id:'S14', device:'D18', name:'瀏覽 — 桌機寬版',           flow:['app.html'],                                 user:{action:'browse'} },
  // 發布技能
  { id:'S15', device:'D03', name:'發布 — 正常完整填寫',       flow:['app.html'],                                 user:{action:'post', complete:true} },
  { id:'S16', device:'D09', name:'發布 — 漏填必填欄位',       flow:['app.html'],                                 user:{action:'post', incomplete:true} },
  { id:'S17', device:'D01', name:'發布 — 特殊字元技能名',     flow:['app.html'],                                 user:{action:'post', name:"Python's 課程 & 進階！"} },
  { id:'S18', device:'D05', name:'發布 — 長文描述（150字）',  flow:['app.html'],                                 user:{action:'post', longDesc:true} },
  // 申請 + 配對
  { id:'S19', device:'D03', name:'申請 — 正常交換申請',       flow:['app.html'],                                 user:{action:'apply'} },
  { id:'S20', device:'D11', name:'申請自己的技能',             flow:['app.html'],                                 user:{action:'apply', ownSkill:true} },
  { id:'S21', device:'D03', name:'配對 — 接受申請',           flow:['app.html'],                                 user:{action:'accept'} },
  { id:'S22', device:'D14', name:'配對 — 拒絕申請',           flow:['app.html'],                                 user:{action:'reject'} },
  { id:'S23', device:'D06', name:'配對 — 標記完成並評分',     flow:['app.html'],                                 user:{action:'complete', rating:5} },
  { id:'S24', device:'D09', name:'評分 — 跳過評分',           flow:['app.html'],                                 user:{action:'complete', skipRating:true} },
  // 聊天
  { id:'S25', device:'D03', name:'聊天 — 傳送訊息',           flow:['chat.html'],                                user:{action:'chat', msg:'你好！我想交換技能！'} },
  { id:'S26', device:'D01', name:'聊天 — 長訊息',             flow:['chat.html'],                                user:{action:'chat', msg:'這是一段很長的訊息'.repeat(10)} },
  { id:'S27', device:'D09', name:'聊天 — 切換對話',           flow:['chat.html'],                                user:{action:'chat', switchConv:true} },
  // 地圖
  { id:'S28', device:'D05', name:'地圖 — 開啟定位',           flow:['map.html'],                                 user:{action:'map', locate:true} },
  { id:'S29', device:'D03', name:'地圖 — 點擊 PIN 申請',      flow:['map.html'],                                 user:{action:'map', pin:true} },
  // 個人頁
  { id:'S30', device:'D03', name:'個人 — 編輯後刪除帳號',     flow:['profile-edit.html'],                        user:{action:'delete'} },
];

// ════════════════════════════════════════════
// 測試引擎
// ════════════════════════════════════════════

const results = [];
let passCount = 0, failCount = 0, warnCount = 0;

function loadFile(filename) {
  try {
    return readFileSync(filename, 'utf8');
  } catch {
    return null;
  }
}

function testFile(filename, device, scenario) {
  const html = loadFile(filename);
  if (!html) return [{ level:'FAIL', msg:`找不到檔案 ${filename}` }];

  const issues = [];
  const dom = new JSDOM(html, { pretendToBeVisual:true });
  const doc = dom.window.document;

  // ── 通用檢查 ──────────────────────────────
  // 1. viewport meta
  const viewport = doc.querySelector('meta[name="viewport"]');
  if (!viewport) issues.push({ level:'FAIL', msg:'缺少 viewport meta tag' });

  // 2. Supabase 未設定
  if (html.includes('your-project.supabase.co'))
    issues.push({ level:'WARN', msg:'Supabase URL 尚未替換（上線前必須設定）' });

  // 3. JS 語法錯誤：物件 key 缺引號
  if (html.match(/\{s-[a-z]/))
    issues.push({ level:'FAIL', msg:'JS goTo() 物件 key 缺少引號 → 會白屏' });

  // 4. JS 裡用 CSS var()
  const jsBlocks = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
  jsBlocks.forEach(js => {
    if (js.includes('color:var(--')) issues.push({ level:'FAIL', msg:'JS 裡直接用 CSS var() → Leaflet 會報錯' });
    if (js.includes('console.error') && !js.includes('//')) issues.push({ level:'WARN', msg:'有未處理的 console.error（會暴露錯誤給用戶）' });
  });

  // 5. 小螢幕 overflow
  if (device.w <= 320) {
    const wideEls = doc.querySelectorAll('[style*="min-width"]');
    if (wideEls.length > 0)
      issues.push({ level:'WARN', msg:`小螢幕 ${device.w}px：有固定 min-width 元素，可能溢出` });
  }

  // 6. 表單必填但沒有 required 或驗證
  const forms = doc.querySelectorAll('input[type="text"], input[type="email"], textarea');
  let hasValidation = html.includes('trim()') || html.includes('validate') || html.includes('.length');
  if (forms.length > 0 && !hasValidation)
    issues.push({ level:'WARN', msg:'有輸入欄位但沒有看到前端驗證' });

  // ── 頁面特定檢查 ──────────────────────────
  if (filename === 'app.html') {
    if (!html.includes('chat.html'))
      issues.push({ level:'FAIL', msg:'訊息 tab 沒有連到 chat.html' });
    if (!html.includes('map.html'))
      issues.push({ level:'FAIL', msg:'地圖 tab 沒有連到 map.html' });
    if (!html.includes('profile-edit.html'))
      issues.push({ level:'FAIL', msg:'個人頁沒有編輯按鈕' });
    if (!html.includes('unpublishSkill'))
      issues.push({ level:'FAIL', msg:'沒有技能下架功能' });
    if (!html.includes('loadMatches'))
      issues.push({ level:'FAIL', msg:'配對頁沒有 loadMatches 函式' });
    if (!html.includes('respondSwap'))
      issues.push({ level:'FAIL', msg:'沒有接受/拒絕配對功能' });
    if (!html.includes('completeSwap'))
      issues.push({ level:'FAIL', msg:'沒有交換完成功能' });
    if (!html.includes('setStar'))
      issues.push({ level:'FAIL', msg:'沒有評分功能' });

    // 情境檢查
    if (scenario.user?.action === 'post' && scenario.user?.name?.includes("'"))
      if (!html.includes('encodeURIComponent') && !html.includes('textContent'))
        issues.push({ level:'WARN', msg:`技能名稱含單引號時可能造成 HTML 注入` });

    if (scenario.user?.ownSkill && !html.includes('user_id===currentUser.id'))
      issues.push({ level:'FAIL', msg:'申請自己的技能時沒有防護' });
  }

  if (filename === 'chat.html') {
    if (!html.includes('supabase_realtime') && !html.includes('.channel('))
      issues.push({ level:'FAIL', msg:'沒有訂閱 Supabase Realtime 頻道' });
    if (!html.includes('backToList'))
      issues.push({ level:'WARN', msg:'沒有返回對話列表的按鈕' });
    if (scenario.user?.msg && scenario.user.msg.length > 500)
      issues.push({ level:'WARN', msg:'長訊息沒有字元長度限制' });
  }

  if (filename === 'map.html') {
    if (!html.includes('markerClusterGroup'))
      issues.push({ level:'WARN', msg:'地圖沒有使用 MarkerCluster 聚合' });
    if (!html.includes('openDetById') && html.includes('JSON.stringify'))
      issues.push({ level:'FAIL', msg:'PIN 點擊用 JSON.stringify → 單引號技能名會崩潰' });
    if (!html.includes('geolocation'))
      issues.push({ level:'FAIL', msg:'沒有定位功能' });
  }

  if (filename === 'login.html') {
    if (!html.includes('resetPasswordForEmail'))
      issues.push({ level:'FAIL', msg:'沒有忘記密碼功能' });
    if (!html.includes('signInWithOAuth'))
      issues.push({ level:'WARN', msg:'沒有 Google 登入' });
    if (!html.includes('privacy.html'))
      issues.push({ level:'WARN', msg:'沒有隱私權政策連結' });
    if (!html.includes('terms.html'))
      issues.push({ level:'WARN', msg:'沒有服務條款連結' });
  }

  if (filename === 'onboarding.html') {
    if (!html.includes('onboarding_done'))
      issues.push({ level:'FAIL', msg:'沒有設定 onboarding_done flag' });
    if (!html.includes('app.html'))
      issues.push({ level:'FAIL', msg:'完成後沒有跳轉到 app.html' });
  }

  if (filename === 'reset-password.html') {
    if (!html.includes('updateUser'))
      issues.push({ level:'FAIL', msg:'沒有呼叫 updateUser 更新密碼' });
    if (!html.includes('login.html'))
      issues.push({ level:'FAIL', msg:'更新後沒有跳回 login.html' });
  }

  if (filename === 'profile-edit.html') {
    if (!html.includes('deleteAccount') && !html.includes('delete'))
      issues.push({ level:'FAIL', msg:'沒有刪除帳號功能' });
    if (!html.includes('reports') && !html.includes('submitReport'))
      issues.push({ level:'WARN', msg:'沒有檢舉功能' });
  }

  // PWA 檢查（只對手機）
  if (device.pwa) {
    const manifest = doc.querySelector('link[rel="manifest"]');
    if (!manifest) issues.push({ level:'WARN', msg:`手機裝置但 ${filename} 沒有 link manifest` });
  }

  // 無障礙
  const inputs = doc.querySelectorAll('input, textarea, select');
  inputs.forEach(el => {
    const id = el.id;
    if (id && !doc.querySelector(`label[for="${id}"]`) && !el.getAttribute('placeholder'))
      issues.push({ level:'WARN', msg:`input#${id} 沒有 label 或 placeholder（無障礙問題）` });
  });

  return issues;
}

// ════════════════════════════════════════════
// 執行 30 個情境測試
// ════════════════════════════════════════════

console.log('');
console.log('╔══════════════════════════════════════════════════╗');
console.log('║     SkillSwap 30 情境測試報告                   ║');
console.log('╚══════════════════════════════════════════════════╝');
console.log('');

SCENARIOS.forEach(scenario => {
  const device = DEVICES.find(d => d.id === scenario.device) || DEVICES[0];
  const scenarioIssues = [];

  // 測試每個頁面
  scenario.flow.forEach(file => {
    const issues = testFile(file, device, scenario);
    issues.forEach(issue => {
      if (!scenarioIssues.find(i => i.msg === issue.msg)) {
        scenarioIssues.push({ ...issue, file });
      }
    });
  });

  const fails = scenarioIssues.filter(i => i.level === 'FAIL');
  const warns = scenarioIssues.filter(i => i.level === 'WARN');

  let status, icon;
  if (fails.length > 0)      { status = 'FAIL'; icon = '🔴'; failCount++; }
  else if (warns.length > 0) { status = 'WARN'; icon = '🟡'; warnCount++; passCount++; }
  else                        { status = 'PASS'; icon = '✅'; passCount++; }

  console.log(`${icon} [${scenario.id}] ${scenario.name}`);
  console.log(`   裝置: ${device.name} (${device.w}×${device.h}) | 頁面: ${scenario.flow.join(' → ')}`);

  if (fails.length > 0) {
    fails.forEach(i => console.log(`   ❌ ${i.file}: ${i.msg}`));
  }
  if (warns.length > 0) {
    warns.forEach(i => console.log(`   ⚠️  ${i.file}: ${i.msg}`));
  }

  results.push({ scenario, device, status, issues: scenarioIssues });
  console.log('');
});

// ── 總結 ──────────────────────────────────
console.log('══════════════════════════════════════════════════');
console.log(`測試結果：${passCount} 通過 / ${failCount} 失敗 / ${warnCount} 警告`);
console.log('══════════════════════════════════════════════════');

// 彙整所有獨特問題
const allIssues = results.flatMap(r => r.issues);
const uniqueIssues = [...new Map(allIssues.map(i => [i.msg, i])).values()];
const uniqueFails = uniqueIssues.filter(i => i.level === 'FAIL');
const uniqueWarns = uniqueIssues.filter(i => i.level === 'WARN');

if (uniqueFails.length > 0) {
  console.log('\n🔴 需要修復的問題：');
  uniqueFails.forEach((i,n) => console.log(`  ${n+1}. [${i.file}] ${i.msg}`));
}
if (uniqueWarns.length > 0) {
  console.log('\n🟡 建議改善的地方：');
  uniqueWarns.forEach((i,n) => console.log(`  ${n+1}. [${i.file}] ${i.msg}`));
}

console.log(`\n總問題數：${uniqueFails.length} 個錯誤，${uniqueWarns.length} 個警告`);
