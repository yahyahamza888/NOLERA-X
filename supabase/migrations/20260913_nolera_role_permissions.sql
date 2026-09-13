-- =========================================================
-- NOLERA X - Secure Role & Permission Foundation
-- Super Admin authority can never be granted by Admin
-- =========================================================

create table if not exists public.nolera_role_permissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  permission text not null,
  granted_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, permission)
);

create index if not exists idx_nolera_role_permissions_user
on public.nolera_role_permissions(user_id);

create index if not exists idx_nolera_role_permissions_permission
on public.nolera_role_permissions(permission);


-- ---------------------------------------------------------
-- Helper: current NOLERA role
-- ---------------------------------------------------------

create or replace function public.nolera_current_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (
      select p.role::text
      from public.profiles p
      where p.id = auth.uid()
      limit 1
    ),
    'user'
  );
$$;


-- ---------------------------------------------------------
-- Super Admin check
-- ---------------------------------------------------------

create or replace function public.nolera_is_super_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.nolera_current_role() = 'super_admin';
$$;


-- ---------------------------------------------------------
-- Admin / Super Admin check
-- ---------------------------------------------------------

create or replace function public.nolera_is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.nolera_current_role() in ('admin', 'super_admin');
$$;


-- ---------------------------------------------------------
-- Permission check
-- ---------------------------------------------------------

create or replace function public.nolera_has_permission(
  target_user uuid,
  required_permission text
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select
    public.nolera_is_super_admin()
    or exists (
      select 1
      from public.nolera_role_permissions rp
      where rp.user_id = target_user
        and rp.permission = required_permission
    );
$$;


-- ---------------------------------------------------------
-- RLS
-- ---------------------------------------------------------

alter table public.nolera_role_permissions enable row level security;


drop policy if exists "nolera_permissions_read_admin" 
on public.nolera_role_permissions;

create policy "nolera_permissions_read_admin"
on public.nolera_role_permissions
for select
to authenticated
using (
  public.nolera_is_admin()
);


drop policy if exists "nolera_permissions_insert_admin"
on public.nolera_role_permissions;

create policy "nolera_permissions_insert_admin"
on public.nolera_role_permissions
for insert
to authenticated
with check (
  public.nolera_is_admin()
  and
  (
    public.nolera_is_super_admin()
    or
    not exists (
      select 1
      from public.profiles p
      where p.id = user_id
        and p.role::text = 'super_admin'
    )
  )
  and
  permission not in (
    'super_admin.grant',
    'super_admin.revoke',
    'super_admin.manage',
    'system.ownership',
    'system.owner_transfer'
  )
);


drop policy if exists "nolera_permissions_update_admin"
on public.nolera_role_permissions;

create policy "nolera_permissions_update_admin"
on public.nolera_role_permissions
for update
to authenticated
using (
  public.nolera_is_super_admin()
  or (
    public.nolera_is_admin()
    and not exists (
      select 1
      from public.profiles p
      where p.id = user_id
        and p.role::text = 'super_admin'
    )
  )
)
with check (
  public.nolera_is_super_admin()
  or (
    public.nolera_is_admin()
    and not exists (
      select 1
      from public.profiles p
      where p.id = user_id
        and p.role::text = 'super_admin'
    )
    and permission not in (
      'super_admin.grant',
      'super_admin.revoke',
      'super_admin.manage',
      'system.ownership',
      'system.owner_transfer'
    )
  )
);


drop policy if exists "nolera_permissions_delete_admin"
on public.nolera_role_permissions;

create policy "nolera_permissions_delete_admin"
on public.nolera_role_permissions
for delete
to authenticated
using (
  public.nolera_is_super_admin()
  or (
    public.nolera_is_admin()
    and not exists (
      select 1
      from public.profiles p
      where p.id = user_id
        and p.role::text = 'super_admin'
    )
    and permission not in (
      'super_admin.grant',
      'super_admin.revoke',
      'super_admin.manage',
      'system.ownership',
      'system.owner_transfer'
    )
  )
);


-- ---------------------------------------------------------
-- Default permission catalog
-- ---------------------------------------------------------

create table if not exists public.nolera_permission_catalog (
  permission text primary key,
  name_ar text not null,
  description_ar text,
  category text not null default 'general',
  is_sensitive boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.nolera_permission_catalog enable row level security;

drop policy if exists "nolera_permission_catalog_read"
on public.nolera_permission_catalog;

create policy "nolera_permission_catalog_read"
on public.nolera_permission_catalog
for select
to authenticated
using (
  public.nolera_is_admin()
);


insert into public.nolera_permission_catalog
(permission, name_ar, description_ar, category, is_sensitive)
values
('users.view', 'عرض المستخدمين', 'عرض بيانات المستخدمين المسموح بها', 'users', false),
('users.manage', 'إدارة المستخدمين', 'إدارة المستخدمين والحسابات', 'users', false),
('kyc.view', 'عرض التحقق', 'عرض طلبات التحقق', 'kyc', false),
('kyc.manage', 'إدارة التحقق', 'إدارة طلبات التحقق', 'kyc', false),
('wallet.view', 'عرض المحافظ', 'عرض المحافظ والأرصدة المسموح بها', 'finance', false),
('wallet.manage', 'إدارة المحافظ', 'إدارة العمليات المسموح بها', 'finance', false),
('transactions.view', 'عرض المعاملات', 'عرض سجل المعاملات', 'finance', false),
('transactions.manage', 'إدارة المعاملات', 'إدارة المعاملات وفق الصلاحيات', 'finance', true),
('orders.view', 'عرض الطلبات', 'عرض الطلبات', 'store', false),
('orders.manage', 'إدارة الطلبات', 'إدارة الطلبات', 'store', false),
('store.manage', 'إدارة المتجر', 'إدارة المنتجات والمتجر', 'store', false),
('ads.manage', 'إدارة الإعلانات', 'إدارة NOLERA ADS', 'platform', false),
('paradise.manage', 'إدارة Paradise', 'إدارة NOLERA PARADISE', 'platform', false),
('directory.manage', 'إدارة دليل الشركات', 'إدارة Company Directory', 'platform', false),
('support.manage', 'إدارة الدعم', 'إدارة تذاكر الدعم', 'support', false),
('employees.manage', 'إدارة الموظفين', 'إدارة الموظفين والصلاحيات التشغيلية', 'admin', true),
('platform.manage', 'إدارة المنصة', 'إدارة إعدادات المنصة', 'admin', true),
('theme.manage', 'إدارة المظهر', 'إدارة الألوان والمظهر', 'admin', true),
('sections.manage', 'إدارة الأقسام', 'إظهار وإخفاء وترتيب الأقسام', 'admin', true)
on conflict (permission) do nothing;


-- ---------------------------------------------------------
-- Protect Super Admin from permission-management actions
-- ---------------------------------------------------------

create or replace function public.nolera_can_manage_employee(
  target_user uuid
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select
    public.nolera_is_super_admin()
    or (
      public.nolera_current_role() = 'admin'
      and not exists (
        select 1
        from public.profiles p
        where p.id = target_user
          and p.role::text = 'super_admin'
      )
    );
$$;


grant execute on function public.nolera_current_role() to authenticated;
grant execute on function public.nolera_is_super_admin() to authenticated;
grant execute on function public.nolera_is_admin() to authenticated;
grant execute on function public.nolera_has_permission(uuid, text) to authenticated;
grant execute on function public.nolera_can_manage_employee(uuid) to authenticated;

