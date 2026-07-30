-- Run once in Supabase SQL Editor
create type public.user_role as enum ('customer','employee','admin');
create type public.user_status as enum ('active','disabled');
create table public.profiles (id uuid primary key references auth.users(id) on delete cascade,full_name text not null default '',phone text,email text not null default '',role public.user_role not null default 'customer',status public.user_status not null default 'active',created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table public.user_permissions (user_id uuid not null references public.profiles(id) on delete cascade,app_key text not null,created_at timestamptz not null default now(),primary key(user_id,app_key));
create table public.tickets (id uuid primary key default gen_random_uuid(),customer_id uuid not null references public.profiles(id) on delete cascade,subject text not null,body text not null,status text not null default 'open',created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table public.activity_logs (id bigint generated always as identity primary key,actor_id uuid references public.profiles(id) on delete set null,action text not null,target_id uuid,details jsonb not null default '{}'::jsonb,created_at timestamptz not null default now());
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$ begin insert into public.profiles(id,full_name,phone,email) values(new.id,coalesce(new.raw_user_meta_data->>'full_name',''),coalesce(new.raw_user_meta_data->>'phone',''),coalesce(new.email,''));return new;end;$$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
create or replace function public.is_admin(uid uuid) returns boolean language sql stable security definer set search_path=public as $$select exists(select 1 from public.profiles where id=uid and role='admin' and status='active')$$;
create or replace function public.is_staff(uid uuid) returns boolean language sql stable security definer set search_path=public as $$select exists(select 1 from public.profiles where id=uid and role in ('employee','admin') and status='active')$$;
alter table public.profiles enable row level security;alter table public.user_permissions enable row level security;alter table public.tickets enable row level security;alter table public.activity_logs enable row level security;
create policy "read own profile" on public.profiles for select using(auth.uid()=id or public.is_admin(auth.uid()));
create policy "read own permissions" on public.user_permissions for select using(auth.uid()=user_id or public.is_admin(auth.uid()));
create policy "customer reads own tickets" on public.tickets for select using(auth.uid()=customer_id or public.is_staff(auth.uid()));
create policy "customer creates own tickets" on public.tickets for insert with check(auth.uid()=customer_id);
create policy "staff updates tickets" on public.tickets for update using(public.is_staff(auth.uid()));
create policy "admin reads logs" on public.activity_logs for select using(public.is_admin(auth.uid()));
-- After first signup, promote the first admin manually:
-- update public.profiles set role='admin' where email='YOUR_EMAIL';
