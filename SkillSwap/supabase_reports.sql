-- 新增 reports 資料表（貼到 Supabase SQL Editor 執行）

create table if not exists public.reports (
  id          uuid default gen_random_uuid() primary key,
  reporter_id uuid references public.profiles on delete cascade,
  reportee_id uuid references public.profiles on delete set null,
  reason      text not null,
  content     text,
  status      text default 'pending',  -- pending / reviewed / resolved
  created_at  timestamptz default now()
);

alter table public.reports enable row level security;
create policy "reports_insert" on public.reports for insert with check (auth.uid() = reporter_id);
-- 只有管理員可以讀（透過 Supabase Dashboard 查看）

-- 技能下架功能（更新 is_active）
-- 在 app.html 呼叫：
-- await sb.from('skills').update({ is_active: false }).eq('id', skillId).eq('user_id', currentUser.id)
-- 這樣只有本人才能下架自己的技能（RLS 已設好）

-- 完整刪除帳號的 RPC（需要 Service Role，建議在後端呼叫）
-- 前端目前刪除 profile + 登出，auth user 的完整刪除需透過：
-- supabase.auth.admin.deleteUser(userId)  ← 只能在 Server 端呼叫
