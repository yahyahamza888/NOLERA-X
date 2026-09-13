-- =========================================================
-- NOLERA X — Platform Builder foundation
-- =========================================================

create table if not exists public.nolera_platform_settings (
  setting_key text primary key,
  setting_value jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create index if not exists idx_nolera_platform_settings_updated_by
on public.nolera_platform_settings(updated_by);

alter table public.nolera_platform_settings enable row level security;

drop policy if exists "platform_settings_select" on public.nolera_platform_settings;
create policy "platform_settings_select"
on public.nolera_platform_settings
for select
to authenticated
using (
  public.nolera_is_admin()
  or public.nolera_has_permission(auth.uid(), 'platform.manage')
  or public.nolera_has_permission(auth.uid(), 'theme.manage')
  or public.nolera_has_permission(auth.uid(), 'sections.manage')
);

drop policy if exists "platform_settings_insert" on public.nolera_platform_settings;
create policy "platform_settings_insert"
on public.nolera_platform_settings
for insert
to authenticated
with check (
  public.nolera_is_admin()
  or public.nolera_has_permission(auth.uid(), 'platform.manage')
  or public.nolera_has_permission(auth.uid(), 'theme.manage')
  or public.nolera_has_permission(auth.uid(), 'sections.manage')
);

drop policy if exists "platform_settings_update" on public.nolera_platform_settings;
create policy "platform_settings_update"
on public.nolera_platform_settings
for update
to authenticated
using (
  public.nolera_is_admin()
  or public.nolera_has_permission(auth.uid(), 'platform.manage')
  or public.nolera_has_permission(auth.uid(), 'theme.manage')
  or public.nolera_has_permission(auth.uid(), 'sections.manage')
)
with check (
  public.nolera_is_admin()
  or public.nolera_has_permission(auth.uid(), 'platform.manage')
  or public.nolera_has_permission(auth.uid(), 'theme.manage')
  or public.nolera_has_permission(auth.uid(), 'sections.manage')
);

drop policy if exists "platform_settings_delete" on public.nolera_platform_settings;
create policy "platform_settings_delete"
on public.nolera_platform_settings
for delete
to authenticated
using (
  public.nolera_is_admin()
  or public.nolera_has_permission(auth.uid(), 'platform.manage')
);

-- Initial platform configuration
insert into public.nolera_platform_settings
  (setting_key, setting_value)
values
(
  'theme',
  '{
    "primary": "#512d68",
    "secondary": "#e86f32",
    "background": "#f7f7fb",
    "surface": "#ffffff",
    "card": "#ffffff",
    "text": "#17151a",
    "mutedText": "#6b6670",
    "border": "#e7e2ea",
    "button": "#512d68",
    "buttonText": "#ffffff",
    "success": "#16a34a",
    "warning": "#d97706",
    "error": "#dc2626",
    "link": "#512d68",
    "sidebar": "#ffffff",
    "navbar": "#ffffff",
    "bottomNav": "#ffffff"
  }'::jsonb
),
(
  'sections',
  '{
    "home": true,
    "wallet": true,
    "transfers": true,
    "services": true,
    "store": true,
    "ads": true,
    "paradise": true,
    "directory": true,
    "logistics": true,
    "ai": true,
    "markets": true
  }'::jsonb
),
(
  'navigation',
  '{
    "bottomNav": true,
    "sidebar": true,
    "showSearch": true
  }'::jsonb
)
on conflict (setting_key) do nothing;

grant select, insert, update, delete
on public.nolera_platform_settings
to authenticated;

git add supabase/migrations/20260913_nolera_platform_builder.sql
git commit -m "Add secure NOLERA platform builder settings"

echo ""
echo "=========================================="
echo "C1 COMPLETED"
echo "Platform Builder database foundation added"
echo "Commit:"
git rev-parse --short HEAD
echo "=========================================="
