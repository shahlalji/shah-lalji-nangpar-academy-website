-- Run once in Supabase Dashboard > SQL Editor.
-- Repeatable: adds story publication dates and editable core website pages.

alter table public.stories
  add column if not exists published_at timestamptz;

update public.stories
set published_at = created_at
where status = 'published' and published_at is null;

create index if not exists stories_published_at_idx
  on public.stories (published_at desc)
  where status = 'published';

create table if not exists public.editable_pages (
  key text primary key check (
    key in ('board-chair-message', 'school-administrator-message', 'fee-structure', 'sports-co-curricular')
  ),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.editable_pages
  drop constraint if exists editable_pages_key_check;

alter table public.editable_pages
  add constraint editable_pages_key_check check (
    key in ('board-chair-message', 'school-administrator-message', 'fee-structure', 'sports-co-curricular')
  );

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists editable_pages_set_updated_at on public.editable_pages;
create trigger editable_pages_set_updated_at
before update on public.editable_pages
for each row execute function public.set_updated_at();

alter table public.editable_pages enable row level security;

drop policy if exists "editable pages are public" on public.editable_pages;
create policy "editable pages are public"
on public.editable_pages for select
to anon, authenticated
using (true);

drop policy if exists "admins can create editable pages" on public.editable_pages;
create policy "admins can create editable pages"
on public.editable_pages for insert
to authenticated
with check (
  ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  and updated_by = (select auth.uid())
);

drop policy if exists "admins can update editable pages" on public.editable_pages;
create policy "admins can update editable pages"
on public.editable_pages for update
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (
  ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  and updated_by = (select auth.uid())
);

drop policy if exists "admins can delete editable pages" on public.editable_pages;
create policy "admins can delete editable pages"
on public.editable_pages for delete
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

revoke all on table public.editable_pages from anon, authenticated;
grant select on table public.editable_pages to anon, authenticated;
grant insert, update, delete on table public.editable_pages to authenticated;

-- Public school documents are downloadable by families, while only dashboard
-- administrators may upload, replace or remove them.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'site-documents',
  'site-documents',
  true,
  null,
  array['application/pdf']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "school documents can be inspected by admins" on storage.objects;
create policy "school documents can be inspected by admins"
on storage.objects for select
to authenticated
using (
  bucket_id = 'site-documents'
  and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

drop policy if exists "admins can upload school documents" on storage.objects;
create policy "admins can upload school documents"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'site-documents'
  and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

drop policy if exists "admins can replace school documents" on storage.objects;
create policy "admins can replace school documents"
on storage.objects for update
to authenticated
using (
  bucket_id = 'site-documents'
  and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
)
with check (
  bucket_id = 'site-documents'
  and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

drop policy if exists "admins can remove school documents" on storage.objects;
create policy "admins can remove school documents"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'site-documents'
  and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

notify pgrst, 'reload schema';
