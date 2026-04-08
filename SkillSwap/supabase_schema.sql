-- SkillSwap Supabase 資料庫設定
-- 到 Supabase → SQL Editor 貼上執行

-- 1. 用戶個人資料
create table public.profiles (
  id         uuid references auth.users on delete cascade primary key,
  full_name  text,
  city       text default '高雄市',
  district   text,
  avatar_url text,
  bio        text,
  rating     numeric(2,1) default 5.0,
  swap_count int default 0,
  created_at timestamptz default now()
);

-- 自動建立 profile（用戶註冊時）
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. 技能
create table public.skills (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references public.profiles on delete cascade,
  name        text not null,
  emoji       text default '🎨',
  category    text not null,
  description text,
  city        text not null,
  district    text,
  lat         numeric(9,6),
  lng         numeric(9,6),
  want        text,          -- 想換什麼
  mode        text default '都可以', -- 線上/面對面/都可以
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- 3. 交換申請
create table public.swaps (
  id           uuid default gen_random_uuid() primary key,
  requester_id uuid references public.profiles on delete cascade,
  provider_id  uuid references public.profiles on delete cascade,
  skill_id     uuid references public.skills on delete cascade,
  status       text default 'pending', -- pending/accepted/rejected/completed
  created_at   timestamptz default now()
);

-- 4. 聊天訊息
create table public.messages (
  id         uuid default gen_random_uuid() primary key,
  swap_id    uuid references public.swaps on delete cascade,
  sender_id  uuid references public.profiles on delete cascade,
  content    text not null,
  created_at timestamptz default now()
);

-- ── Row Level Security（保護資料）────────────────

alter table public.profiles enable row level security;
alter table public.skills   enable row level security;
alter table public.swaps    enable row level security;
alter table public.messages enable row level security;

-- Profiles: 自己可以讀寫，其他人只能讀
create policy "profiles_read"   on public.profiles for select using (true);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- Skills: 所有人可以讀，只有本人可以寫
create policy "skills_read"   on public.skills for select using (true);
create policy "skills_insert" on public.skills for insert with check (auth.uid() = user_id);
create policy "skills_update" on public.skills for update using (auth.uid() = user_id);
create policy "skills_delete" on public.skills for delete using (auth.uid() = user_id);

-- Swaps: 只有相關的兩個人可以讀寫
create policy "swaps_read"   on public.swaps for select
  using (auth.uid() = requester_id or auth.uid() = provider_id);
create policy "swaps_insert" on public.swaps for insert
  with check (auth.uid() = requester_id);
create policy "swaps_update" on public.swaps for update
  using (auth.uid() = requester_id or auth.uid() = provider_id);

-- Messages: 只有相關用戶可以讀寫
create policy "messages_read" on public.messages for select
  using (exists (
    select 1 from public.swaps s
    where s.id = swap_id
    and (s.requester_id = auth.uid() or s.provider_id = auth.uid())
  ));
create policy "messages_insert" on public.messages for insert
  with check (auth.uid() = sender_id);

-- ── 啟用即時功能（聊天用）────────────────────────
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.swaps;

-- ── Premium 訂閱欄位（加到 profiles 資料表）──────────
alter table public.profiles
  add column if not exists is_premium        boolean default false,
  add column if not exists premium_until     timestamptz,
  add column if not exists stripe_customer   text,
  add column if not exists subscription_id   text,
  add column if not exists subscription_status text default 'free';

-- 通知資料表
create table if not exists public.notifications (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references public.profiles on delete cascade,
  type       text not null,
  message    text not null,
  is_read    boolean default false,
  created_at timestamptz default now()
);
alter table public.notifications enable row level security;
create policy "notif_read" on public.notifications for select using (auth.uid() = user_id);
create policy "notif_update" on public.notifications for update using (auth.uid() = user_id);

-- ── 精選置頂欄位（加到 skills 資料表）──────────
alter table public.skills
  add column if not exists is_sponsored    boolean default false,
  add column if not exists sponsored_until timestamptz,
  add column if not exists view_count      int default 0;

-- 定時關閉過期置頂（Supabase Cron Job 或 pg_cron）
-- 每小時執行一次：
-- select cron.schedule('expire-sponsors', '0 * * * *',
--   $$update public.skills set is_sponsored=false
--     where is_sponsored=true and sponsored_until < now()$$);

-- ── 封鎖用戶 ──────────────────────────────────
create table if not exists public.blocks (
  id          uuid default gen_random_uuid() primary key,
  blocker_id  uuid references public.profiles on delete cascade,
  blocked_id  uuid references public.profiles on delete cascade,
  created_at  timestamptz default now(),
  unique(blocker_id, blocked_id)
);
alter table public.blocks enable row level security;
create policy "blocks_manage" on public.blocks
  using (auth.uid() = blocker_id)
  with check (auth.uid() = blocker_id);

-- 查詢技能時過濾被封鎖者（在前端 query 加 .not('user_id','in',blockedIds)）

-- ── Push 通知訂閱 ──────────────────────────────
create table if not exists public.push_subscriptions (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references public.profiles on delete cascade unique,
  endpoint   text not null,
  p256dh     text not null,
  auth       text not null,
  updated_at timestamptz default now()
);
alter table public.push_subscriptions enable row level security;
create policy "push_manage" on public.push_subscriptions
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── 邀請好友 Referral ──────────────────────────
create table if not exists public.referrals (
  id          uuid default gen_random_uuid() primary key,
  referrer_id uuid references public.profiles on delete cascade,
  referred_id uuid references public.profiles on delete cascade unique,
  code        text not null,
  status      text default 'pending',  -- pending / completed
  rewarded    boolean default false,
  created_at  timestamptz default now()
);
alter table public.referrals enable row level security;
create policy "referrals_read" on public.referrals for select using (auth.uid() = referrer_id);
create policy "referrals_insert" on public.referrals for insert with check (true);

-- ── 檢舉資料表 ────────────────────────────────
create table if not exists public.reports (
  id          uuid default gen_random_uuid() primary key,
  reporter_id uuid references public.profiles on delete cascade,
  reportee_id uuid references public.profiles on delete set null,
  reason      text not null,
  content     text,
  status      text default 'pending',
  created_at  timestamptz default now()
);
alter table public.reports enable row level security;
create policy "reports_insert" on public.reports for insert with check (auth.uid() = reporter_id);
