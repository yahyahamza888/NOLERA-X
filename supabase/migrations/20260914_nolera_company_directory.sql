-- NOLERA X — Company Directory foundation

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,

  name text not null,
  description text,
  category text not null default 'business',

  country text,
  city text,
  area text,
  address text,

  phone text,
  email text,
  website text,
  logo text,

  verified boolean not null default false,

  status text not null default 'pending'
    check (status in ('pending','approved','rejected','suspended')),

  rating numeric(3,2) not null default 0
    check (rating >= 0 and rating <= 5),

  reviews_count integer not null default 0
    check (reviews_count >= 0),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists companies_status_idx
  on public.companies(status);

create index if not exists companies_category_idx
  on public.companies(category);

create index if not exists companies_country_city_idx
  on public.companies(country, city);

create index if not exists companies_owner_idx
  on public.companies(owner_id);

alter table public.companies enable row level security;

drop policy if exists "companies_public_approved_read"
  on public.companies;

create policy "companies_public_approved_read"
on public.companies
for select
to anon, authenticated
using (status = 'approved');

drop policy if exists "companies_owner_read"
  on public.companies;

create policy "companies_owner_read"
on public.companies
for select
to authenticated
using (owner_id = auth.uid());

drop policy if exists "companies_owner_insert"
  on public.companies;

create policy "companies_owner_insert"
on public.companies
for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists "companies_owner_update"
  on public.companies;

create policy "companies_owner_update"
on public.companies
for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "companies_admin_manage"
  on public.companies;

create policy "companies_admin_manage"
on public.companies
for all
to authenticated
using (
  public.nolera_is_admin()
  and public.nolera_has_permission(auth.uid(), 'directory.manage')
)
with check (
  public.nolera_is_admin()
  and public.nolera_has_permission(auth.uid(), 'directory.manage')
);

grant select on public.companies to anon, authenticated;
grant insert, update on public.companies to authenticated;

create or replace function public.nolera_companies_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists companies_updated_at
  on public.companies;

create trigger companies_updated_at
before update on public.companies
for each row
execute function public.nolera_companies_updated_at();
