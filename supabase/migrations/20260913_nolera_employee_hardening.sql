-- =========================================================
-- NOLERA X - Employee Permission Hardening
-- Admin can manage employees only.
-- Admin can NEVER manage super_admin.
-- =========================================================

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
      'system.owner_transfer'
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
      'system.owner_transfer'
    )
  )
);
