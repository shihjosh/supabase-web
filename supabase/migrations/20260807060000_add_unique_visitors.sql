-- 網站分析改善（第二階段）：
--   1) 不重複訪客統計：page_views 新增 visitor_id（前端 localStorage 匿名 ID，不涉及個資）
--   2) 過濾爬蟲機器人：於前端寫入前以 User-Agent 關鍵字過濾，資料庫端不需改動
--   3) 防洗流量（同裝置同頁 30 分鐘內去重）：同樣在前端邏輯處理，資料庫端不需改動
--
-- 本次 migration 只處理第 1 項的資料庫變更，並更新統計 RPC 一併回傳「不重複訪客數」。

alter table public.page_views
  add column if not exists visitor_id text null;

create index if not exists page_views_visitor_id_idx on public.page_views (visitor_id);

-- 熱門文章統計（改版）：同時回傳瀏覽數與不重複訪客數
-- 回傳欄位有變動（新增 unique_visitors），需先 drop 舊函式再重建。
drop function if exists public.top_posts_by_views(timestamptz, int);

create or replace function public.top_posts_by_views(
  since timestamptz default (now() - interval '30 days'),
  result_limit int default 10
)
returns table (
  slug text,
  title text,
  views bigint,
  unique_visitors bigint
)
language sql
stable
as $$
  select
    p.slug,
    p.title,
    count(pv.id) as views,
    count(distinct pv.visitor_id) filter (where pv.visitor_id is not null) as unique_visitors
  from public.page_views pv
  join public.posts p
    on pv.path = '/blog/' || p.slug
  where pv.created_at >= since
  group by p.slug, p.title
  order by views desc
  limit result_limit;
$$;

-- 每日瀏覽數統計（改版）：同時回傳瀏覽數與不重複訪客數，日期仍以台灣時區分桶
-- 回傳欄位有變動，需先 drop 舊函式再重建。
drop function if exists public.daily_page_views(int);

create or replace function public.daily_page_views(days int default 30)
returns table (
  day date,
  views bigint,
  unique_visitors bigint
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
    count(pv.id) as views,
    count(distinct pv.visitor_id) filter (where pv.visitor_id is not null) as unique_visitors
  from date_series ds
  left join public.page_views pv
    on (pv.created_at at time zone 'Asia/Taipei')::date = ds.day
  group by ds.day
  order by ds.day;
$$;

-- 總覽用：近 N 天不重複訪客數（供儀表板總覽卡片使用）
create or replace function public.unique_visitors_since(
  since timestamptz default (now() - interval '30 days')
)
returns bigint
language sql
stable
as $$
  select count(distinct visitor_id) from public.page_views
  where created_at >= since and visitor_id is not null;
$$;
