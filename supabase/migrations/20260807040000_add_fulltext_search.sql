-- 全文搜尋功能：混用 Postgres 全文索引（tsvector，處理斷詞/排序）
-- 與 pg_trgm 模糊比對（處理中文子字串、容錯搜尋），
-- 讓中文關鍵字也能有不錯的搜尋體驗，且完全在 Supabase 內完成、無需額外服務。

-- 1) 啟用 pg_trgm（模糊比對 / trigram 相似度）
create extension if not exists pg_trgm;

-- 2) 為 posts 加入 tsvector 產生欄位（title 權重較高，excerpt / content 次之）
alter table public.posts
  add column if not exists search_vector tsvector
  generated always as (
    setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(content, '')), 'C')
  ) stored;

-- 3) 全文索引（GIN，加速 tsquery 比對與排序）
create index if not exists posts_search_vector_idx
  on public.posts using gin (search_vector);

-- 4) trigram 索引（GIN，加速中文子字串 / 模糊相似度比對）
create index if not exists posts_title_trgm_idx
  on public.posts using gin (title gin_trgm_ops);
create index if not exists posts_content_trgm_idx
  on public.posts using gin (content gin_trgm_ops);

-- 5) 搜尋用的 RPC 函式：結合全文比對（tsquery）與 trigram 模糊比對（similarity），
--    以「全文比對命中優先，其次依相似度」排序。
--    僅回傳「已發佈」或「排程時間已到」的文章，與前台其他查詢邏輯一致。
--    注意：不使用 pg_trgm 的 % 運算子（依賴 session 層級 set_limit，無法持久設定），
--    改為直接呼叫 similarity() 並比較門檻值，行為穩定不受連線影響。
create or replace function public.search_posts(
  search_query text,
  tag_filter text default null,
  page_limit int default 10,
  page_offset int default 0
)
returns table (
  slug text,
  title text,
  excerpt text,
  content text,
  created_at timestamptz,
  tags text[],
  total_count bigint
)
language sql
stable
as $$
  with matched as (
    select
      p.slug, p.title, p.excerpt, p.content, p.created_at, p.tags,
      greatest(
        ts_rank(p.search_vector, websearch_to_tsquery('simple', search_query)),
        similarity(p.title, search_query),
        similarity(coalesce(p.content, ''), search_query) * 0.5
      ) as rank
    from public.posts p
    where
      (p.published = true or p.scheduled_at <= now())
      and (tag_filter is null or p.tags @> array[tag_filter])
      and (
        p.search_vector @@ websearch_to_tsquery('simple', search_query)
        or similarity(p.title, search_query) > 0.15
        or similarity(coalesce(p.content, ''), search_query) > 0.15
      )
  )
  select
    m.slug, m.title, m.excerpt, m.content, m.created_at, m.tags,
    count(*) over () as total_count
  from matched m
  order by m.rank desc, m.created_at desc
  limit page_limit offset page_offset;
$$;
