-- =========================================================
-- NOLERA X - Super Admin Theme Protection
-- Theme / platform appearance is Super Admin only.
-- Admin and Employee can never receive theme.manage.
-- =========================================================

insert into public.nolera_permission_catalog
  (permission, name_ar, description_ar, category, is_sensitive)
values
  (
    'theme.manage',
    'إدارة المظهر',
    'إدارة ألوان ومظهر منصة NOLERA X - Super Admin فقط',
    'admin',
    true
  )
on conflict (permission) do update
set
  name_ar = excluded.name_ar,
  description_ar = excluded.description_ar,
  category = excluded.category,
  is_sensitive = excluded.is_sensitive;

-- Remove theme.manage from every non-Super-Admin account.
delete from public.nolera_role_permissions rp
where rp.permission = 'theme.manage'
  and exists (
    select 1
    from public.profiles p
    where p.id = rp.user_id
      and p.role::text <> 'super_admin'
  );

-- Only Super Admin may grant theme.manage.
drop policy if exists "nolera_permissions_insert_admin"
on public.nolera_role_permissions;

create policy "nolera_permissions_insert_admin"
on public.nolera_role_permissions
for insert
to authenticated
with check (
  public.nolera_is_super_admin()
  or (
    public.nolera_current_role() = 'admin'
    and exists (
      select 1
      from public.profiles p
      where p.id = user_id
        and p.role::text = 'employee'
    )
    and permission not in (
      'super_admin.grant',
      'super_admin.revoke',
      'super_admin.manage',
      'system.ownership',
      'system.owner_transfer',
      'theme.manage'
    )
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
    public.nolera_current_role() = 'admin'
    and exists (
      select 1
      from public.profiles p
      where p.id = user_id
        and p.role::text = 'employee'
    )
  )
)
with check (
  public.nolera_is_super_admin()
  or (
    public.nolera_current_role() = 'admin'
    and exists (
      select 1
      from public.profiles p
      where p.id = user_id
        and p.role::text = 'employee'
    )
    and permission not in (
      'super_admin.grant',
      'super_admin.revoke',
      'super_admin.manage',
      'system.ownership',
      'system.owner_transfer',
      'theme.manage'
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
    public.nolera_current_role() = 'admin'
    and exists (
      select 1
      from public.profiles p
      where p.id = user_id
        and p.role::text = 'employee'
    )
    and permission <> 'theme.manage'
    and permission not in (
      'super_admin.grant',
      'super_admin.revoke',
      'super_admin.manage',
      'system.ownership',
      'system.owner_transfer'
    )
  )
);
