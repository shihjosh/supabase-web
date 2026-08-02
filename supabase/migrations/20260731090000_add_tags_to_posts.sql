-- 為 posts 資料表加入標籤功能
alter table public.posts
  add column if not exists tags text[] not null default '{}';

-- 加上 GIN 索引，加速標籤查詢（例如 tags @> ARRAY['nextjs']）
create index if not exists posts_tags_idx on public.posts using gin (tags);
