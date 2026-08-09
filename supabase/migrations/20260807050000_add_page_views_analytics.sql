-- 網站流量分析：新增 page_views 表格，記錄前台頁面瀏覽（供後台分析儀表板使用）
-- 設計原則：
--   - 輕量：只記錄路徑與時間，不存任何可識別使用者的個資（不存 IP / user agent）
--   - 寫入：任何訪客（含未登入）都可以寫入，因為要記錄真實流量
--   - 讀取：僅登入使用者（後台管理者）可讀取，避免流量資料外洩給一般訪客

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  created_at timestamptz not null default now()
);

create index if not exists page_views_path_idx on public.page_views (path);
create index if not exists page_views_created_at_idx on public.page_views (created_at);

alter table public.page_views enable row level security;

drop policy if exists "anyone can insert page_views" on public.page_views;
create policy "anyone can insert page_views" on public.page_views
  for insert
  with check (true);

drop policy if exists "auth can read page_views" on public.page_views;
create policy "auth can read page_views" on public.page_views
  for select
  using (auth.role() = 'authenticated');

-- 熱門文章統計 RPC：依「/blog/<slug>」路徑聚合瀏覽數，join posts 取得標題，
-- 依區間（since）篩選，回傳前 N 名。
create or replace function public.top_posts_by_views(
  since timestamptz default (now() - interval '30 days'),
  result_limit int default 10
)
returns table (
  slug text,
  title text,
  views bigint
)
language sql
stable
as $$
  select
    p.slug,
    p.title,
    count(pv.id) as views
  from public.page_views pv
  join public.posts p
    on pv.path = '/blog/' || p.slug
  where pv.created_at >= since
  group by p.slug, p.title
  order by views desc
  limit result_limit;
$$;

-- 每日瀏覽數統計 RPC：回傳最近 N 天，每天的瀏覽數（含 0 的日期，方便畫圖）
-- 日期以台灣時區（Asia/Taipei）分桶，與網站其他日期顯示邏輯一致。
create or replace function public.daily_page_views(days int default 30)
returns table (
  day date,
  views bigint
)
language sql
stable
as $$
  with date_series as (
    select generate_series(
      ((now() at time zone 'Asia/Taipei')::date - (days - 1) * interval '1 day')::date,
      (now() at time zone 'Asia/Taipei')::date,
      interval '1 day'
    )::date as day
  )
  select
    ds.day,
    count(pv.id) as views
  from date_series ds
  left join public.page_views pv
    on (pv.created_at at time zone 'Asia/Taipei')::date = ds.day
  group by ds.day
  order by ds.day;
$$;
