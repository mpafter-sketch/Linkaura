-- Supabase Provisioning Script for ConnectX User Profiles
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql/new)

-- 1. Create a table for public profiles linked to auth.users
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text,
  bio text,
  avatar_url text,
  cover_url text,
  gender text default 'Prefer not to say',
  country text default 'Global Space',
  age integer default 21,
  vip_level integer default 0,
  coins integer default 0,
  diamonds integer default 0,
  followers_count integer default 0,
  following_count integer default 0,
  is_online boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Create security policies for the profiles table
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

drop policy if exists "Users can insert their own profile." on public.profiles;
create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update their own profile." on public.profiles;
create policy "Users can update their own profile." on public.profiles
  for update using (auth.uid() = id);

-- 4. Create a trigger function that automatically inserts a profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id, 
    username, 
    display_name, 
    bio, 
    avatar_url, 
    cover_url, 
    gender, 
    country, 
    age, 
    vip_level, 
    coins, 
    diamonds, 
    followers_count, 
    following_count, 
    is_online
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'user_' || substring(new.id::text from 1 for 8)),
    coalesce(new.raw_user_meta_data->>'display_name', 'Explorer_' || substring(new.id::text from 1 for 8)),
    'New user on ConnectX! Say hello! 👋✨',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
    'Prefer not to say',
    'Global Space',
    21,
    0,
    0,
    0,
    0,
    0,
    false
  );
  return new;
end;
$$ language plpgsql security definer;

-- 5. Attach the trigger to the auth.users table
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- 6. Supabase Storage Setup (Avatars & Covers)
-- ==============================================================================

-- Create buckets for avatars and covers if they do not exist
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do nothing;

-- Enable Row Level Security for storage objects
-- (Usually enabled by default, but good to ensure)

-- Create Policies for 'avatars' bucket
drop policy if exists "Public Access to Avatars" on storage.objects;
create policy "Public Access to Avatars"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

drop policy if exists "Authenticated users can upload avatars" on storage.objects;
create policy "Authenticated users can upload avatars"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' 
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update their own avatars" on storage.objects;
create policy "Users can update their own avatars"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete their own avatars" on storage.objects;
create policy "Users can delete their own avatars"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create Policies for 'covers' bucket
drop policy if exists "Public Access to Covers" on storage.objects;
create policy "Public Access to Covers"
  on storage.objects for select
  using ( bucket_id = 'covers' );

drop policy if exists "Authenticated users can upload covers" on storage.objects;
create policy "Authenticated users can upload covers"
  on storage.objects for insert
  with check (
    bucket_id = 'covers' 
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update their own covers" on storage.objects;
create policy "Users can update their own covers"
  on storage.objects for update
  using (
    bucket_id = 'covers'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete their own covers" on storage.objects;
create policy "Users can delete their own covers"
  on storage.objects for delete
  using (
    bucket_id = 'covers'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );


-- ==============================================================================
-- 7. Follow/Unfollow Relationship Table & Triggers
-- ==============================================================================

-- Create a table for managing follow relationships between users
create table if not exists public.follows (
  follower_id uuid references auth.users on delete cascade,
  following_id uuid references auth.users on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (follower_id, following_id)
);

-- Enable Row Level Security (RLS)
alter table public.follows enable row level security;

-- Row Level Security policies
drop policy if exists "Follow relations are viewable by everyone" on public.follows;
create policy "Follow relations are viewable by everyone"
  on public.follows for select using (true);

drop policy if exists "Authenticated users can follow others" on public.follows;
create policy "Authenticated users can follow others"
  on public.follows for insert
  with check (
    auth.uid() = follower_id
  );

drop policy if exists "Users can unfollow others" on public.follows;
create policy "Users can unfollow others"
  on public.follows for delete
  using (
    auth.uid() = follower_id
  );

-- Trigger to automatically increment/decrement profiles followers and following counters
create or replace function public.handle_follow_change()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.profiles
    set following_count = following_count + 1
    where id = new.follower_id;

    update public.profiles
    set followers_count = followers_count + 1
    where id = new.following_id;
    return new;
  elsif (TG_OP = 'DELETE') then
    update public.profiles
    set following_count = greatest(0, following_count - 1)
    where id = old.follower_id;

    update public.profiles
    set followers_count = greatest(0, followers_count - 1)
    where id = old.following_id;
    return old;
  end if;
  return null;
end;
$$ language plpgsql security definer;

-- Attach trigger
drop trigger if exists on_follow_changed on public.follows;
create trigger on_follow_changed
  after insert or delete on public.follows
  for each row execute procedure public.handle_follow_change();


-- ==============================================================================
-- 8. Notifications Table & Realtime Setup
-- ==============================================================================
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  type text not null check (type in ('like', 'comment', 'follow', 'gift', 'message', 'coin_purchase', 'vip', 'system')),
  sender_id uuid references auth.users on delete set null,
  sender_name text,
  sender_avatar text,
  message text not null,
  action_url text,
  is_read boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.notifications enable row level security;

-- RLS Policies
-- Users can view their own notifications
drop policy if exists "Users can view their own notifications." on public.notifications;
create policy "Users can view their own notifications."
  on public.notifications for select
  using (auth.uid() = user_id);

-- Users can update (mark as read) their own notifications
drop policy if exists "Users can update their own notifications." on public.notifications;
create policy "Users can update their own notifications."
  on public.notifications for update
  using (auth.uid() = user_id);

-- Users can delete their own notifications
drop policy if exists "Users can delete their own notifications." on public.notifications;
create policy "Users can delete their own notifications."
  on public.notifications for delete
  using (auth.uid() = user_id);

-- Authenticated users can insert notifications for others (e.g. sender creating a notification)
drop policy if exists "Users can insert notifications for others." on public.notifications;
create policy "Users can insert notifications for others."
  on public.notifications for insert
  with check (true);

-- Enable Supabase Realtime for notifications table
alter publication supabase_realtime add table public.notifications;

