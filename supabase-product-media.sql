alter table public.products
  add column if not exists media_url text;

alter table public.products
  add column if not exists media_type text;

alter table public.products
  drop constraint if exists products_media_type_check;

alter table public.products
  add constraint products_media_type_check
  check (media_type is null or media_type in ('image'));

insert into storage.buckets (id, name, public)
values ('product-media', 'product-media', false)
on conflict (id) do nothing;

drop policy if exists "NOLERA product media insert own" on storage.objects;
drop policy if exists "NOLERA product media select own" on storage.objects;
drop policy if exists "NOLERA product media delete own" on storage.objects;

create policy "NOLERA product media insert own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "NOLERA product media select own"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'product-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "NOLERA product media delete own"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);
