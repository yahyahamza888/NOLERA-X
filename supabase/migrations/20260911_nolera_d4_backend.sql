-- NOLERA D4 backend hardening

create table if not exists public.paradise_post_likes (
  post_id uuid not null references public.paradise_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index if not exists idx_paradise_post_likes_user
on public.paradise_post_likes(user_id);

alter table public.paradise_post_likes enable row level security;

drop policy if exists "paradise likes select own" on public.paradise_post_likes;
create policy "paradise likes select own"
on public.paradise_post_likes
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "paradise likes insert own" on public.paradise_post_likes;
create policy "paradise likes insert own"
on public.paradise_post_likes
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "paradise likes delete own" on public.paradise_post_likes;
create policy "paradise likes delete own"
on public.paradise_post_likes
for delete to authenticated
using (user_id = auth.uid());


create or replace function public.nolera_toggle_paradise_like(p_post_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  liked_now boolean;
  like_count integer;
begin
  if uid is null then
    raise exception 'Authentication required';
  end if;

  if exists (
    select 1 from public.paradise_post_likes
    where post_id = p_post_id and user_id = uid
  ) then
    delete from public.paradise_post_likes
    where post_id = p_post_id and user_id = uid;
    liked_now := false;
  else
    insert into public.paradise_post_likes(post_id, user_id)
    values (p_post_id, uid);
    liked_now := true;
  end if;

  select count(*)::integer
  into like_count
  from public.paradise_post_likes
  where post_id = p_post_id;

  update public.paradise_posts
  set likes = like_count
  where id = p_post_id;

  return jsonb_build_object(
    'liked', liked_now,
    'likes', like_count
  );
end;
$$;

grant execute on function public.nolera_toggle_paradise_like(uuid)
to authenticated;


create or replace function public.nolera_share_paradise_post(p_post_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count integer;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  update public.paradise_posts
  set shares = coalesce(shares, 0) + 1
  where id = p_post_id
  returning shares into new_count;

  return coalesce(new_count, 0);
end;
$$;

grant execute on function public.nolera_share_paradise_post(uuid)
to authenticated;


create or replace function public.nolera_add_paradise_comment(
  p_post_id uuid,
  p_content text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  comment_id uuid;
begin
  if uid is null then
    raise exception 'Authentication required';
  end if;

  if trim(coalesce(p_content, '')) = '' then
    raise exception 'Comment cannot be empty';
  end if;

  insert into public.paradise_comments(
    post_id,
    author_id,
    content
  )
  values (
    p_post_id,
    uid,
    trim(p_content)
  )
  returning id into comment_id;

  update public.paradise_posts
  set comments = (
    select count(*)::integer
    from public.paradise_comments
    where post_id = p_post_id
  )
  where id = p_post_id;

  return comment_id;
end;
$$;

grant execute on function public.nolera_add_paradise_comment(uuid, text)
to authenticated;


-- Admin ADS access
drop policy if exists "ads admin select" on public.nolera_ads;
create policy "ads admin select"
on public.nolera_ads
for select to authenticated
using (
  advertiser_id = auth.uid()
  or exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('admin', 'super_admin')
  )
);


create or replace function public.nolera_admin_list_ads()
returns setof public.nolera_ads
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'super_admin')
  ) then
    raise exception 'Admin access required';
  end if;

  return query
  select *
  from public.nolera_ads
  order by created_at desc;
end;
$$;

grant execute on function public.nolera_admin_list_ads()
to authenticated;


create or replace function public.nolera_admin_set_ad_status(
  p_ad_id uuid,
  p_status text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'super_admin')
  ) then
    raise exception 'Admin access required';
  end if;

  if p_status not in ('pending','draft','active','paused','rejected','completed') then
    raise exception 'Invalid ad status';
  end if;

  update public.nolera_ads
  set status = p_status,
      updated_at = now()
  where id = p_ad_id;

  return found;
end;
$$;

grant execute on function public.nolera_admin_set_ad_status(uuid, text)
to authenticated;


create or replace function public.nolera_admin_delete_ad(p_ad_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'super_admin')
  ) then
    raise exception 'Admin access required';
  end if;

  delete from public.nolera_ads
  where id = p_ad_id;

  return found;
end;
$$;

grant execute on function public.nolera_admin_delete_ad(uuid)
to authenticated;
