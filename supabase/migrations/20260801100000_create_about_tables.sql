-- 自我介紹頁面內容資料表，供後台編輯

create table if not exists public.about_profile (
  id int primary key default 1,
  name text not null default '',
  english_name text not null default '',
  title text not null default '',
  bio text not null default '',
  email text not null default '',
  github text not null default '',
  location text not null default '',
  avatar_url text not null default '',
  constraint about_profile_singleton check (id = 1)
);

insert into public.about_profile (id) values (1)
on conflict (id) do nothing;

create table if not exists public.about_experiences (
  id uuid primary key default gen_random_uuid(),
  period text not null default '',
  role text not null default '',
  org text not null default '',
  description text not null default '',
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.about_skills (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  level int not null default 80,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.about_certificates (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  issuing_authority text not null default '',
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists about_experiences_sort_idx on public.about_experiences (sort);
create index if not exists about_skills_sort_idx on public.about_skills (sort);
create index if not exists about_certificates_sort_idx on public.about_certificates (sort);

-- RLS: 公開可讀，僅登入使用者可寫
alter table public.about_profile enable row level security;
alter table public.about_experiences enable row level security;
alter table public.about_skills enable row level security;
alter table public.about_certificates enable row level security;

drop policy if exists "public read about_profile" on public.about_profile;
create policy "public read about_profile" on public.about_profile
  for select using (true);

drop policy if exists "auth write about_profile" on public.about_profile;
create policy "auth write about_profile" on public.about_profile
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read about_experiences" on public.about_experiences;
create policy "public read about_experiences" on public.about_experiences
  for select using (true);

drop policy if exists "auth write about_experiences" on public.about_experiences;
create policy "auth write about_experiences" on public.about_experiences
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read about_skills" on public.about_skills;
create policy "public read about_skills" on public.about_skills
  for select using (true);

drop policy if exists "auth write about_skills" on public.about_skills;
create policy "auth write about_skills" on public.about_skills
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read about_certificates" on public.about_certificates;
create policy "public read about_certificates" on public.about_certificates
  for select using (true);

drop policy if exists "auth write about_certificates" on public.about_certificates;
create policy "auth write about_certificates" on public.about_certificates
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
