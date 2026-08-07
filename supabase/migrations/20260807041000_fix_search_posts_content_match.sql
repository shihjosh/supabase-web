-- 修正 20260807040000：search_posts() 對「內容」的比對邏輯有誤。
-- pg_trgm 的 similarity() 是用「整段文字」算相似度，對於短關鍵字 vs 長文章內容，
-- 相似度會被文章長度稀釋到趨近 0，導致關鍵字明明存在於內文中，
-- 卻因為門檻值判斷失敗而搜尋不到（已於實測發現此問題）。
--
-- 修正邏輯：
--   - 標題（title）：因為通常較短，用 trigram similarity() 做「容錯／模糊比對」是合理的。
--   - 內容（content）／摘要（excerpt）：改用 ILIKE 子字串比對，
--     符合中文使用者對搜尋框「內容包含關鍵字即可找到」的直覺期待。
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
        similarity(p.title, search_query)
      ) as rank
    from public.posts p
    where
      (p.published = true or p.scheduled_at <= now())
      and (tag_filter is null or p.tags @> array[tag_filter])
      and (
        p.search_vector @@ websearch_to_tsquery('simple', search_query)
        or similarity(p.title, search_query) > 0.15
        or p.title ilike '%' || search_query || '%'
        or coalesce(p.excerpt, '') ilike '%' || search_query || '%'
        or p.content ilike '%' || search_query || '%'
      )
  )
  select
    m.slug, m.title, m.excerpt, m.content, m.created_at, m.tags,
    count(*) over () as total_count
  from matched m
  order by m.rank desc, m.created_at desc
  limit page_limit offset page_offset;
$$;
