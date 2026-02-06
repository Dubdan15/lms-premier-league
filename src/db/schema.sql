-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Users)
create table profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- LEAGUES
create table leagues (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  join_code text unique not null, 
  created_by uuid references profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- LEAGUE MEMBERS
create table league_members (
  league_id uuid references leagues(id) not null,
  user_id uuid references profiles(id) not null,
  status text default 'ACTIVE' check (status in ('ACTIVE', 'ELIMINATED', 'WINNER')),
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (league_id, user_id)
);

-- PICKS
create table picks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  league_id uuid references leagues(id) not null,
  gameweek int not null,
  team_id int not null,
  is_win boolean, -- Null = pending, True = win, False = loss/draw
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, league_id, gameweek) -- One pick per week per league
);

-- RLS POLICIES (Row Level Security) - Basic Setup
alter table profiles enable row level security;
alter table leagues enable row level security;
alter table league_members enable row level security;
alter table picks enable row level security;

-- Profiles: Public read, Self update
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Leagues: Public read (for now, to find by code), Authenticated create
create policy "Leagues are viewable by everyone." on leagues for select using (true);
create policy "Authenticated users can create leagues." on leagues for insert with check (auth.role() = 'authenticated');

-- Members: Viewable if in league or public? Public for standings.
create policy "League members viewable by everyone." on league_members for select using (true);
create policy "Users can join leagues." on league_members for insert with check (auth.uid() = user_id);

-- Picks: Viewable by everyone (public picks), Insert own
create policy "Picks are viewable by everyone." on picks for select using (true);
create policy "Users can insert their own picks." on picks for insert with check (auth.uid() = user_id);

-- FUNCTION to handle new user signup (Trigger)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

-- TRIGGER
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
