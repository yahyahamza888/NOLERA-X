create extension if not exists "pgcrypto";

create table if not exists public.nolera_design_tools (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  category text not null,
  price numeric(18,2) not null default 0,
  currency text not null default 'USD',
  icon text,
  external_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.nolera_design_rentals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tool_id uuid not null references public.nolera_design_tools(id) on delete cascade,
  price numeric(18,2) not null,
  currency text not null default 'USD',
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  transaction_id uuid references public.transactions(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.products
  add column if not exists design_config jsonb not null default '{}'::jsonb;

create index if not exists idx_nolera_design_rentals_user
  on public.nolera_design_rentals(user_id);

create index if not exists idx_nolera_design_rentals_tool
  on public.nolera_design_rentals(tool_id);

alter table public.nolera_design_tools enable row level security;
alter table public.nolera_design_rentals enable row level security;

drop policy if exists "design tools readable" on public.nolera_design_tools;
create policy "design tools readable"
on public.nolera_design_tools
for select
to authenticated
using (is_active = true);

drop policy if exists "users read own design rentals" on public.nolera_design_rentals;
create policy "users read own design rentals"
on public.nolera_design_rentals
for select
to authenticated
using (auth.uid() = user_id);

insert into public.nolera_design_tools
  (slug, name, description, category, price, currency, icon, external_url)
values
  (
    'color-studio',
    'Color Studio',
    'إنشاء واختيار ألوان وهوية بصرية للمنتجات والتصاميم.',
    'الألوان',
    2.99,
    'USD',
    '🎨',
    'https://coolors.co'
  ),
  (
    'ui-builder',
    'UI Builder',
    'أداة لبناء وتخطيط واجهات المنتجات والتطبيقات.',
    'واجهات',
    4.99,
    'USD',
    '🧩',
    'https://www.figma.com'
  ),
  (
    'icon-lab',
    'Icon Lab',
    'مكتبة وأدوات للأيقونات والرموز.',
    'أيقونات',
    1.99,
    'USD',
    '🔷',
    'https://lucide.dev'
  ),
  (
    'ai-design',
    'AI Design',
    'أدوات تصميم مدعومة بالذكاء الاصطناعي.',
    'ذكاء اصطناعي',
    5.99,
    'USD',
    '✨',
    'https://www.recraft.ai'
  ),
  (
    'type-studio',
    'Type Studio',
    'أدوات الخطوط والطباعة واختيار الهوية النصية.',
    'خطوط',
    1.49,
    'USD',
    '🔤',
    'https://fonts.google.com'
  )
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  category = excluded.category,
  price = excluded.price,
  currency = excluded.currency,
  icon = excluded.icon,
  external_url = excluded.external_url,
  is_active = true;

create or replace function public.nolera_get_my_design_rentals()
returns setof public.nolera_design_rentals
language sql
security definer
set search_path = public
as $$
  select *
  from public.nolera_design_rentals
  where user_id = auth.uid()
  order by created_at desc;
$$;

create or replace function public.nolera_rent_design_tool(
  p_tool_id uuid,
  p_currency text default 'USD'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_tool public.nolera_design_tools%rowtype;
  v_wallet public.wallets%rowtype;
  v_transaction_id uuid;
  v_rental_id uuid;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select *
  into v_tool
  from public.nolera_design_tools
  where id = p_tool_id
    and is_active = true;

  if not found then
    raise exception 'Design tool not found';
  end if;

  if upper(coalesce(p_currency, 'USD')) <> 'USD' then
    raise exception 'Only USD is currently supported';
  end if;

  if exists (
    select 1
    from public.nolera_design_rentals
    where user_id = v_user_id
      and tool_id = p_tool_id
      and expires_at > now()
  ) then
    raise exception 'Tool is already rented';
  end if;

  select *
  into v_wallet
  from public.wallets
  where user_id = v_user_id
    and upper(currency) = 'USD'
  for update;

  if not found then
    raise exception 'USD wallet not found';
  end if;

  if coalesce(v_wallet.balance, 0) < v_tool.price then
    raise exception 'Insufficient USD balance';
  end if;

  update public.wallets
  set balance = balance - v_tool.price
  where id = v_wallet.id;

  insert into public.transactions (
    user_id,
    wallet_id,
    type,
    amount,
    currency,
    status,
    description,
    created_at
  )
  values (
    v_user_id,
    v_wallet.id,
    'purchase',
    v_tool.price,
    'USD',
    'completed',
    'NOLERA DESIGN: ' || v_tool.name,
    now()
  )
  returning id into v_transaction_id;

  insert into public.nolera_design_rentals (
    user_id,
    tool_id,
    price,
    currency,
    started_at,
    expires_at,
    transaction_id
  )
  values (
    v_user_id,
    p_tool_id,
    v_tool.price,
    'USD',
    now(),
    now() + interval '30 days',
    v_transaction_id
  )
  returning id into v_rental_id;

  return jsonb_build_object(
    'success', true,
    'rental_id', v_rental_id,
    'transaction_id', v_transaction_id,
    'tool_id', p_tool_id,
    'expires_at', now() + interval '30 days'
  );
end;
$$;

create or replace function public.nolera_apply_product_design(
  p_product_id uuid,
  p_design_config jsonb
)
returns public.products
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_product public.products%rowtype;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  update public.products
  set
    design_config = coalesce(p_design_config, '{}'::jsonb),
    updated_at = now()
  where id = p_product_id
    and owner_id = v_user_id
  returning * into v_product;

  if not found then
    raise exception 'Product not found or not owned by user';
  end if;

  return v_product;
end;
$$;

grant execute on function public.nolera_get_my_design_rentals()
to authenticated;

grant execute on function public.nolera_rent_design_tool(uuid, text)
to authenticated;

grant execute on function public.nolera_apply_product_design(uuid, jsonb)
to authenticated;
