# Supabase 登入設定指南

## 第一步：建立免費帳號

1. 去 https://supabase.com 點「Start for free」
2. 用 GitHub 帳號登入（最快）
3. 點「New project」
4. 填入：
   - Project name：`skillswap`
   - Database password：設一個強密碼（記起來備用）
   - Region：選 `Southeast Asia（Singapore）`最近台灣
5. 等約 1 分鐘建立完成

---

## 第二步：取得 API 金鑰

1. 進入你的專案
2. 左側選單 → **Project Settings** → **API**
3. 複製這兩個值：
   - `Project URL`（長得像 `https://abcdefgh.supabase.co`）
   - `anon public` key（很長的一串）

4. 打開 `login.html`，找到這兩行換掉：

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co'; // ← 換成你的
const SUPABASE_KEY = 'your-anon-public-key';              // ← 換成你的
```

---

## 第三步：建立資料庫

1. 左側選單 → **SQL Editor**
2. 點「New query」
3. 把 `supabase_schema.sql` 的全部內容貼上
4. 點「Run」執行
5. 看到 `Success` 就完成了

---

## 第四步：開啟 Google 登入（選擇性）

1. 左側選單 → **Authentication** → **Providers**
2. 找到 `Google`，點開
3. 去 https://console.cloud.google.com 建立 OAuth 憑證
   - 新建專案 → API & Services → Credentials → Create OAuth Client
   - Application type：Web application
   - Authorized redirect URIs：填入 Supabase 給你的 redirect URL
4. 把 Client ID 和 Client Secret 貼回 Supabase

---

## 第五步：部署測試

把 `login.html` 和 `supabase_schema.sql` 加進你的 GitHub repo，
推上去後 Vercel 自動重新部署。

打開 `你的網址/login.html` 就能測試註冊登入。

---

## 完成後的流程

```
使用者開啟 APP
    ↓
login.html（登入/註冊）
    ↓ 登入成功
index.html（主 APP）← 這裡用 supabase.auth.getUser() 確認身份
```

在 `index.html` 最上面加這段，未登入就跳回登入頁：

```javascript
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const { data: { user } } = await sb.auth.getUser();
if (!user) window.location.href = 'login.html';
```
