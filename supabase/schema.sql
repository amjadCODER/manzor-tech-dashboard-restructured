-- MANZOR TECH PLATFORM - SAFE TO RUN MORE THAN ONCE
create extension if not exists pgcrypto;

do $$ begin
  if not exists(select 1 from pg_type where typname='user_role') then create type public.user_role as enum ('customer','employee','admin'); end if;
  if not exists(select 1 from pg_type where typname='user_status') then create type public.user_status as enum ('active','disabled'); end if;
end $$;

create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 full_name text not null default '', phone text, email text not null default '',
 role public.user_role not null default 'customer', status public.user_status not null default 'active',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.user_permissions (user_id uuid not null references public.profiles(id) on delete cascade,app_key text not null,created_at timestamptz not null default now(),primary key(user_id,app_key));
create table if not exists public.tickets (id uuid primary key default gen_random_uuid(),customer_id uuid not null references public.profiles(id) on delete cascade,subject text not null,body text not null,status text not null default 'open',created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table if not exists public.activity_logs (id bigint generated always as identity primary key,actor_id uuid references public.profiles(id) on delete set null,action text not null,target_id uuid,details jsonb not null default '{}'::jsonb,created_at timestamptz not null default now());

-- Human-readable ticket number for existing and new tickets
create sequence if not exists public.ticket_number_seq start 1001;
alter table public.tickets add column if not exists ticket_number bigint;
alter table public.tickets alter column ticket_number set default nextval('public.ticket_number_seq');
update public.tickets set ticket_number=nextval('public.ticket_number_seq') where ticket_number is null;
alter table public.tickets alter column ticket_number set not null;
create unique index if not exists tickets_ticket_number_uidx on public.tickets(ticket_number);
select setval('public.ticket_number_seq', greatest(coalesce((select max(ticket_number) from public.tickets),1000),1000), true);

create table if not exists public.ticket_messages (
 id uuid primary key default gen_random_uuid(), ticket_id uuid not null references public.tickets(id) on delete cascade,
 sender_id uuid not null references public.profiles(id) on delete cascade, message text not null,
 is_staff boolean not null default false, created_at timestamptz not null default now()
);
create index if not exists ticket_messages_ticket_idx on public.ticket_messages(ticket_id,created_at);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$begin new.updated_at=now();return new;end$$;
drop trigger if exists profiles_updated_at on public.profiles;create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists tickets_updated_at on public.tickets;create trigger tickets_updated_at before update on public.tickets for each row execute function public.set_updated_at();

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$begin insert into public.profiles(id,full_name,phone,email) values(new.id,coalesce(new.raw_user_meta_data->>'full_name',''),nullif(new.raw_user_meta_data->>'phone',''),coalesce(new.email,'')) on conflict(id) do update set full_name=excluded.full_name,phone=excluded.phone,email=excluded.email,updated_at=now();return new;end$$;
drop trigger if exists on_auth_user_created on auth.users;create trigger on_auth_user_created after insert or update of email,raw_user_meta_data on auth.users for each row execute function public.handle_new_user();

create or replace function public.is_admin(uid uuid) returns boolean language sql stable security definer set search_path=public as $$select exists(select 1 from public.profiles where id=uid and role='admin' and status='active')$$;
create or replace function public.is_staff(uid uuid) returns boolean language sql stable security definer set search_path=public as $$select exists(select 1 from public.profiles where id=uid and role in ('employee','admin') and status='active')$$;
create or replace function public.set_ticket_message_staff() returns trigger language plpgsql security definer set search_path=public as $$begin new.sender_id=auth.uid();new.is_staff=public.is_staff(auth.uid());return new;end$$;
drop trigger if exists ticket_message_staff on public.ticket_messages;create trigger ticket_message_staff before insert on public.ticket_messages for each row execute function public.set_ticket_message_staff();
create or replace function public.sync_ticket_status_from_message() returns trigger language plpgsql security definer set search_path=public as $$begin update public.tickets set status=case when new.is_staff then 'waiting_customer' else 'open' end,updated_at=now() where id=new.ticket_id;return new;end$$;
drop trigger if exists ticket_message_status on public.ticket_messages;create trigger ticket_message_status after insert on public.ticket_messages for each row execute function public.sync_ticket_status_from_message();

alter table public.profiles enable row level security;alter table public.user_permissions enable row level security;alter table public.tickets enable row level security;alter table public.ticket_messages enable row level security;alter table public.activity_logs enable row level security;

drop policy if exists "read own profile" on public.profiles;drop policy if exists "read profiles" on public.profiles;
create policy "read profiles" on public.profiles for select to authenticated using(auth.uid()=id or public.is_staff(auth.uid()));
drop policy if exists "read own permissions" on public.user_permissions;create policy "read own permissions" on public.user_permissions for select to authenticated using(auth.uid()=user_id or public.is_admin(auth.uid()));
drop policy if exists "customer reads own tickets" on public.tickets;drop policy if exists "read tickets" on public.tickets;create policy "read tickets" on public.tickets for select to authenticated using(auth.uid()=customer_id or public.is_staff(auth.uid()));
drop policy if exists "customer creates own tickets" on public.tickets;create policy "customer creates own tickets" on public.tickets for insert to authenticated with check(auth.uid()=customer_id);
drop policy if exists "staff updates tickets" on public.tickets;create policy "staff updates tickets" on public.tickets for update to authenticated using(public.is_staff(auth.uid())) with check(public.is_staff(auth.uid()));
drop policy if exists "read ticket messages" on public.ticket_messages;
create policy "read ticket messages" on public.ticket_messages for select to authenticated using(exists(select 1 from public.tickets t where t.id=ticket_id and (t.customer_id=auth.uid() or public.is_staff(auth.uid()))));
drop policy if exists "insert ticket messages" on public.ticket_messages;
create policy "insert ticket messages" on public.ticket_messages for insert to authenticated with check(sender_id=auth.uid() and exists(select 1 from public.tickets t where t.id=ticket_id and (t.customer_id=auth.uid() or public.is_staff(auth.uid()))));
drop policy if exists "admin reads logs" on public.activity_logs;create policy "admin reads logs" on public.activity_logs for select to authenticated using(public.is_admin(auth.uid()));

grant usage on schema public to anon,authenticated;grant select on public.profiles to authenticated;grant select on public.user_permissions to authenticated;grant select,insert,update on public.tickets to authenticated;grant select,insert on public.ticket_messages to authenticated;grant select on public.activity_logs to authenticated;grant usage,select on all sequences in schema public to authenticated;

insert into public.profiles(id,full_name,phone,email,role,status)
select u.id,coalesce(u.raw_user_meta_data->>'full_name',''),nullif(u.raw_user_meta_data->>'phone',''),coalesce(u.email,''),'customer','active' from auth.users u
on conflict(id) do update set full_name=excluded.full_name,phone=excluded.phone,email=excluded.email,updated_at=now();
