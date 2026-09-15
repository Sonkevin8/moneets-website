create table if not exists public.site_content (
  id integer primary key check (id = 1),
  content jsonb not null,
  custom_css text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
  on public.site_content for select
  using (true);

drop policy if exists "Authenticated admin can write site content" on public.site_content;
create policy "Authenticated admin can write site content"
  on public.site_content for insert
  to authenticated
  with check ((auth.jwt() ->> 'email') = 'gemini@geminielectrical.co.nz');

drop policy if exists "Authenticated admin can update site content" on public.site_content;
create policy "Authenticated admin can update site content"
  on public.site_content for update
  to authenticated
  using ((auth.jwt() ->> 'email') = 'gemini@geminielectrical.co.nz')
  with check ((auth.jwt() ->> 'email') = 'gemini@geminielectrical.co.nz');

insert into public.site_content (id, content, custom_css)
values (1, '{}'::jsonb, '')
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('site-backgrounds', 'site-backgrounds', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view site backgrounds" on storage.objects;
create policy "Public can view site backgrounds"
  on storage.objects for select
  using (bucket_id = 'site-backgrounds');

drop policy if exists "Admin can upload site backgrounds" on storage.objects;
create policy "Admin can upload site backgrounds"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-backgrounds' and (auth.jwt() ->> 'email') = 'gemini@geminielectrical.co.nz');

drop policy if exists "Admin can update site backgrounds" on storage.objects;
create policy "Admin can update site backgrounds"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-backgrounds' and (auth.jwt() ->> 'email') = 'gemini@geminielectrical.co.nz')
  with check (bucket_id = 'site-backgrounds' and (auth.jwt() ->> 'email') = 'gemini@geminielectrical.co.nz');

drop policy if exists "Admin can delete site backgrounds" on storage.objects;
create policy "Admin can delete site backgrounds"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-backgrounds' and (auth.jwt() ->> 'email') = 'gemini@geminielectrical.co.nz');
