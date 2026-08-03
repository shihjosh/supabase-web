-- 建立部落格文章圖片的 Storage bucket，允許公開讀取、僅登入使用者可上傳

insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

drop policy if exists "public read post-images" on storage.objects;
create policy "public read post-images" on storage.objects
  for select using (bucket_id = 'post-images');

drop policy if exists "auth upload post-images" on storage.objects;
create policy "auth upload post-images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'post-images');

drop policy if exists "auth update post-images" on storage.objects;
create policy "auth update post-images" on storage.objects
  for update to authenticated
  using (bucket_id = 'post-images');

drop policy if exists "auth delete post-images" on storage.objects;
create policy "auth delete post-images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'post-images');
