-- Drop existing table if it exists
drop table if exists public.messages cascade;

create table public.messages (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  text text not null,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.messages enable row level security;

-- Create policies
create policy "Anyone can view messages"
  on public.messages for select
  using (true);

create policy "Authenticated users can create messages"
  on public.messages for insert
  with check (auth.role() = 'authenticated');

create policy "Admins can delete messages"
  on public.messages for delete
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.is_admin = true
    )
  );

-- Create indexes
create index messages_user_id_idx on public.messages (user_id);
create index messages_created_at_idx on public.messages (created_at desc); 