-- Drop existing table if it exists
drop table if exists public.users cascade;

create table public.users (
  id uuid default gen_random_uuid() primary key,
  username text not null unique,
  password text not null,
  is_member boolean default false,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.users enable row level security;

-- Create policies
create policy "Users can view their own data"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own data"
  on public.users for update
  using (auth.uid() = id);

-- Create indexes
create index users_username_idx on public.users (username); 