create table if not exists public.exchange_rates (
  id uuid primary key default gen_random_uuid(),
  from_currency text not null,
  to_currency text not null,
  rate numeric not null check (rate > 0),
  updated_at timestamptz not null default now(),
  unique (from_currency, to_currency)
);

alter table public.exchange_rates enable row level security;

drop policy if exists "authenticated_read_exchange_rates" on public.exchange_rates;

create policy "authenticated_read_exchange_rates"
on public.exchange_rates
for select
to authenticated
using (true);

create or replace function public.nolera_get_exchange_rates()
returns setof public.exchange_rates
language sql
security definer
set search_path = public
as $$
  select *
  from public.exchange_rates
  order by from_currency, to_currency;
$$;

revoke all on function public.nolera_get_exchange_rates() from public;
grant execute on function public.nolera_get_exchange_rates() to authenticated;

create or replace function public.nolera_exchange(
  p_from_currency text,
  p_to_currency text,
  p_from_amount numeric
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_rate numeric;
  v_to_amount numeric;
  v_from_wallet_id uuid;
  v_to_wallet_id uuid;
  v_from_balance numeric;
begin
  if v_user is null then
    raise exception 'Authentication required';
  end if;

  if p_from_amount <= 0 then
    raise exception 'Amount must be greater than zero';
  end if;

  if upper(p_from_currency) = upper(p_to_currency) then
    raise exception 'Currencies must be different';
  end if;

  select rate
  into v_rate
  from public.exchange_rates
  where upper(from_currency) = upper(p_from_currency)
    and upper(to_currency) = upper(p_to_currency)
  limit 1;

  if v_rate is null then
    raise exception 'Exchange rate not configured';
  end if;

  v_to_amount := p_from_amount * v_rate;

  select id, balance
  into v_from_wallet_id, v_from_balance
  from public.wallets
  where user_id = v_user
    and upper(currency) = upper(p_from_currency)
  for update;

  if v_from_wallet_id is null then
    raise exception 'Source wallet not found';
  end if;

  if v_from_balance < p_from_amount then
    raise exception 'Insufficient balance';
  end if;

  select id
  into v_to_wallet_id
  from public.wallets
  where user_id = v_user
    and upper(currency) = upper(p_to_currency)
  for update;

  if v_to_wallet_id is null then
    insert into public.wallets(user_id, currency, balance)
    values (v_user, upper(p_to_currency), 0)
    returning id into v_to_wallet_id;
  end if;

  update public.wallets
  set balance = balance - p_from_amount
  where id = v_from_wallet_id;

  update public.wallets
  set balance = balance + v_to_amount
  where id = v_to_wallet_id;

  insert into public.transactions(
    user_id,
    wallet_id,
    type,
    status,
    recipient,
    reference,
    metadata,
    currency
  )
  values (
    v_user,
    v_from_wallet_id,
    'exchange',
    'completed',
    null,
    'EX-' || replace(gen_random_uuid()::text, '-', ''),
    jsonb_build_object(
      'from_currency', upper(p_from_currency),
      'to_currency', upper(p_to_currency),
      'from_amount', p_from_amount,
      'to_amount', v_to_amount,
      'rate', v_rate
    ),
    upper(p_from_currency)
  );

  return json_build_object(
    'success', true,
    'from_currency', upper(p_from_currency),
    'to_currency', upper(p_to_currency),
    'from_amount', p_from_amount,
    'to_amount', v_to_amount,
    'rate', v_rate
  );
end;
$$;

revoke all on function public.nolera_exchange(text,text,numeric) from public;
grant execute on function public.nolera_exchange(text,text,numeric) to authenticated;

create or replace function public.nolera_set_exchange_rate(
  p_from_currency text,
  p_to_currency text,
  p_rate numeric
)
returns public.exchange_rates
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
  v_row public.exchange_rates;
begin
  select role into v_role
  from public.profiles
  where id = auth.uid();

  if v_role <> 'admin' then
    raise exception 'Admin access required';
  end if;

  if p_rate <= 0 then
    raise exception 'Rate must be greater than zero';
  end if;

  insert into public.exchange_rates(
    from_currency,
    to_currency,
    rate,
    updated_at
  )
  values (
    upper(p_from_currency),
    upper(p_to_currency),
    p_rate,
    now()
  )
  on conflict (from_currency, to_currency)
  do update set
    rate = excluded.rate,
    updated_at = now()
  returning * into v_row;

  return v_row;
end;
$$;

revoke all on function public.nolera_set_exchange_rate(text,text,numeric) from public;
grant execute on function public.nolera_set_exchange_rate(text,text,numeric) to authenticated;

create or replace function public.nolera_mark_notification_read(
  p_notification_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.notifications
  set read = true
  where id = p_notification_id
    and user_id = auth.uid();

  return found;
end;
$$;

revoke all on function public.nolera_mark_notification_read(uuid) from public;
grant execute on function public.nolera_mark_notification_read(uuid) to authenticated;

create or replace function public.nolera_submit_verification(
  p_full_name text,
  p_document_type text,
  p_document_number text
)
returns public.verifications
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.verifications;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  insert into public.verifications(
    user_id,
    full_name,
    document_type,
    document_number,
    status,
    notes
  )
  values (
    auth.uid(),
    trim(p_full_name),
    trim(p_document_type),
    trim(p_document_number),
    'pending',
    null
  )
  returning * into v_row;

  update public.profiles
  set verification_status = 'pending',
      updated_at = now()
  where id = auth.uid();

  return v_row;
end;
$$;

revoke all on function public.nolera_submit_verification(text,text,text) from public;
grant execute on function public.nolera_submit_verification(text,text,text) to authenticated;

create or replace function public.nolera_get_my_verification()
returns setof public.verifications
language sql
security definer
set search_path = public
as $$
  select *
  from public.verifications
  where user_id = auth.uid()
  order by created_at desc;
$$;

revoke all on function public.nolera_get_my_verification() from public;
grant execute on function public.nolera_get_my_verification() to authenticated;

create or replace function public.nolera_review_verification(
  p_verification_id uuid,
  p_status text,
  p_notes text default null
)
returns public.verifications
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
  v_row public.verifications;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select role into v_role
  from public.profiles
  where id = auth.uid();

  if v_role not in ('admin', 'super_admin') then
    raise exception 'Admin access required';
  end if;

  if p_status not in ('approved', 'rejected') then
    raise exception 'Invalid verification status';
  end if;

  update public.verifications
  set
    status = p_status,
    notes = nullif(trim(coalesce(p_notes, '')), '')
  where id = p_verification_id
  returning * into v_row;

  if not found then
    raise exception 'Verification request not found';
  end if;

  update public.profiles
  set
    verification_status = p_status,
    updated_at = now()
  where id = v_row.user_id;

  return v_row;
end;
$$;

revoke all on function public.nolera_review_verification(uuid,text,text) from public;
grant execute on function public.nolera_review_verification(uuid,text,text) to authenticated;

