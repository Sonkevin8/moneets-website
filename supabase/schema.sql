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
