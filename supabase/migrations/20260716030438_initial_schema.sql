-- Car Log: initial schema.
--
-- Three tables: profiles (1:1 with auth users), cars, service_records.
-- Every table has Row Level Security enabled: the database itself refuses
-- to return or modify rows that don't belong to the requesting user, no
-- matter what the client code asks for.
--
-- Note: policies use `(select auth.uid())` instead of bare `auth.uid()` so
-- Postgres evaluates it once per query instead of once per row.

-- ---------------------------------------------------------------------------
-- profiles: one row per account, created automatically on signup.
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Runs with elevated rights (security definer) because it must insert into
-- public.profiles during signup, before the user has any session.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- cars: the garage.
-- ---------------------------------------------------------------------------

create table public.cars (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  make text,
  model text,
  year integer check (year between 1900 and 2100),
  registration_plate text,
  odometer_km integer not null default 0 check (odometer_km >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index cars_user_id_idx on public.cars (user_id);

alter table public.cars enable row level security;

create policy "Users can view their own cars"
  on public.cars for select
  using ((select auth.uid()) = user_id);

create policy "Users can add their own cars"
  on public.cars for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own cars"
  on public.cars for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own cars"
  on public.cars for delete
  using ((select auth.uid()) = user_id);

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger cars_set_updated_at
  before update on public.cars
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- service_records: the maintenance timeline of a car.
-- ---------------------------------------------------------------------------

create table public.service_records (
  id uuid primary key default gen_random_uuid(),
  car_id uuid not null references public.cars (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  serviced_on date not null default current_date,
  odometer_km integer not null check (odometer_km >= 0),
  -- text + check instead of a Postgres enum: adding a category later is a
  -- one-line constraint change instead of an enum migration.
  category text not null check (
    category in ('service', 'oil_change', 'tires', 'brakes', 'inspection', 'repair', 'other')
  ),
  title text not null,
  notes text,
  cost numeric(10, 2) check (cost >= 0),
  created_at timestamptz not null default now()
);

-- The timeline query: records of one car, newest first.
create index service_records_car_timeline_idx
  on public.service_records (car_id, serviced_on desc);

alter table public.service_records enable row level security;

create policy "Users can view their own service records"
  on public.service_records for select
  using ((select auth.uid()) = user_id);

create policy "Users can add their own service records"
  on public.service_records for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own service records"
  on public.service_records for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own service records"
  on public.service_records for delete
  using ((select auth.uid()) = user_id);
