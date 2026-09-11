-- NOLERA PARADISE + ADS BACKEND FOUNDATION
-- No demo identities. Authenticated Supabase users only.

create table if not exists public.paradise_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  content text not null default '',
  type text not null default 'text',
  media_url text,
  link_url text,
  product_id uuid,
  likes integer not null default 0,
  comments integer not null default 0,
  shares integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.paradise_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.paradise_posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  likes integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.paradise_stories (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  media_url text,
  caption text,
  text text,
  views integer not null default 0,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create table if not exists public.paradise_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  receiver_id uuid not null references auth.users(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now(),
  read boolean not null default false
);

create table if not exists public.paradise_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  owner_id uuid not null references auth.users(id) on delete cascade,
  members integer not null default 1,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.paradise_follows (
  follower_id uuid not null references auth.users(id) on delete cascade,
  following_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

create table if not exists public.nolera_ads (
  id uuid primary key default gen_random_uuid(),
  advertiser_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  image_url text,
  target_url text,
  objective text not null default 'awareness',
  currency text not null default 'USD',
  budget numeric(18,2) not null default 0,
  spent numeric(18,2) not null default 0,
  daily_budget numeric(18,2),
  status text not null default 'pending',
  country text,
  language text,
  start_date timestamptz,
  end_date timestamptz,
  impressions integer not null default 0,
  clicks integer not null default 0,
  conversions integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists paradise_posts_author_idx
  on public.paradise_posts(author_id, created_at desc);

create index if not exists paradise_comments_post_idx
  on public.paradise_comments(post_id, created_at);

create index if not exists paradise_stories_expiry_idx
  on public.paradise_stories(expires_at);

create index if not exists paradise_messages_users_idx
  on public.paradise_messages(sender_id, receiver_id, created_at);

create index if not exists nolera_ads_advertiser_idx
  on public.nolera_ads(advertiser_id, created_at desc);

alter table public.paradise_posts enable row level security;
alter table public.paradise_comments enable row level security;
alter table public.paradise_stories enable row level security;
alter table public.paradise_messages enable row level security;
alter table public.paradise_groups enable row level security;
alter table public.paradise_follows enable row level security;
alter table public.nolera_ads enable row level security;

drop policy if exists "paradise posts read" on public.paradise_posts;
create policy "paradise posts read"
on public.paradise_posts for select
to authenticated
using (true);

drop policy if exists "paradise posts insert own" on public.paradise_posts;
create policy "paradise posts insert own"
on public.paradise_posts for insert
to authenticated
with check (auth.uid() = author_id);

drop policy if exists "paradise posts update own" on public.paradise_posts;
create policy "paradise posts update own"
on public.paradise_posts for update
to authenticated
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

drop policy if exists "paradise posts delete own" on public.paradise_posts;
create policy "paradise posts delete own"
on public.paradise_posts for delete
to authenticated
using (auth.uid() = author_id);

drop policy if exists "paradise comments read" on public.paradise_comments;
create policy "paradise comments read"
on public.paradise_comments for select
to authenticated
using (true);

drop policy if exists "paradise comments insert own" on public.paradise_comments;
create policy "paradise comments insert own"
on public.paradise_comments for insert
to authenticated
with check (auth.uid() = author_id);

drop policy if exists "paradise stories read" on public.paradise_stories;
create policy "paradise stories read"
on public.paradise_stories for select
to authenticated
using (expires_at > now());

drop policy if exists "paradise stories insert own" on public.paradise_stories;
create policy "paradise stories insert own"
on public.paradise_stories for insert
to authenticated
with check (auth.uid() = author_id);

drop policy if exists "paradise messages own" on public.paradise_messages;
create policy "paradise messages own"
on public.paradise_messages for select
to authenticated
using (auth.uid() = sender_id or auth.uid() = receiver_id);

drop policy if exists "paradise messages send" on public.paradise_messages;
create policy "paradise messages send"
on public.paradise_messages for insert
to authenticated
with check (auth.uid() = sender_id);

drop policy if exists "paradise groups read" on public.paradise_groups;
create policy "paradise groups read"
on public.paradise_groups for select
to authenticated
using (true);

drop policy if exists "paradise groups create" on public.paradise_groups;
create policy "paradise groups create"
on public.paradise_groups for insert
to authenticated
with check (auth.uid() = owner_id);

drop policy if exists "paradise follows own" on public.paradise_follows;
create policy "paradise follows own"
on public.paradise_follows for select
to authenticated
using (auth.uid() = follower_id);

drop policy if exists "paradise follows insert" on public.paradise_follows;
create policy "paradise follows insert"
on public.paradise_follows for insert
to authenticated
with check (auth.uid() = follower_id);

drop policy if exists "paradise follows delete" on public.paradise_follows;
create policy "paradise follows delete"
on public.paradise_follows for delete
to authenticated
using (auth.uid() = follower_id);

drop policy if exists "ads own read" on public.nolera_ads;
create policy "ads own read"
on public.nolera_ads for select
to authenticated
using (auth.uid() = advertiser_id);

drop policy if exists "ads own insert" on public.nolera_ads;
create policy "ads own insert"
on public.nolera_ads for insert
to authenticated
with check (auth.uid() = advertiser_id);

drop policy if exists "ads own update" on public.nolera_ads;
create policy "ads own update"
on public.nolera_ads for update
to authenticated
using (auth.uid() = advertiser_id)
with check (auth.uid() = advertiser_id);

drop policy if exists "ads own delete" on public.nolera_ads;
create policy "ads own delete"
on public.nolera_ads for delete
to authenticated
using (auth.uid() = advertiser_id);

