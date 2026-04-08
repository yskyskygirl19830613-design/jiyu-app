-- 新增 reviews 資料表（貼到 Supabase SQL Editor 執行）

create table if not exists public.reviews (
  id           uuid default gen_random_uuid() primary key,
  swap_id      uuid references public.swaps on delete cascade,
  reviewer_id  uuid references public.profiles on delete cascade,
  reviewee_id  uuid references public.profiles on delete cascade,
  rating       int  not null check (rating between 1 and 5),
  content      text,
  created_at   timestamptz default now(),
  unique(swap_id, reviewer_id)  -- 每次交換每人只能評一次
);

alter table public.reviews enable row level security;

create policy "reviews_read"   on public.reviews for select using (true);
create policy "reviews_insert" on public.reviews for insert with check (auth.uid() = reviewer_id);

-- 累計交換次數的 function
create or replace function public.increment_swap_count(user_id uuid)
returns void as $$
  update public.profiles
  set swap_count = coalesce(swap_count, 0) + 1
  where id = user_id;
$$ language sql security definer;
