-- MANZOR TECH - ticket replies upgrade
-- Safe to run more than once. Does not delete existing users or tickets.

create sequence if not exists public.ticket_number_seq start 1001;

alter table public.tickets
  add column if not exists ticket_number bigint;

alter table public.tickets
  alter column ticket_number set default nextval('public.ticket_number_seq');

update public.tickets
set ticket_number = nextval('public.ticket_number_seq')
where ticket_number is null;

alter table public.tickets
  alter column ticket_number set not null;

create unique index if not exists tickets_ticket_number_uidx
  on public.tickets(ticket_number);

select setval(
  'public.ticket_number_seq',
  greatest(coalesce((select max(ticket_number) from public.tickets), 1000), 1000),
  true
);

create table if not exists public.ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  is_staff boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists ticket_messages_ticket_idx
  on public.ticket_messages(ticket_id, created_at);

create or replace function public.is_staff(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = uid
      and role in ('employee', 'admin')
      and status = 'active'
  );
$$;

create or replace function public.set_ticket_message_staff()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.sender_id := auth.uid();
  new.is_staff := public.is_staff(auth.uid());
  return new;
end;
$$;

drop trigger if exists ticket_message_staff on public.ticket_messages;
create trigger ticket_message_staff
before insert on public.ticket_messages
for each row execute function public.set_ticket_message_staff();

create or replace function public.sync_ticket_status_from_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.tickets
  set status = case when new.is_staff then 'waiting_customer' else 'open' end,
      updated_at = now()
  where id = new.ticket_id;
  return new;
end;
$$;

drop trigger if exists ticket_message_status on public.ticket_messages;
create trigger ticket_message_status
after insert on public.ticket_messages
for each row execute function public.sync_ticket_status_from_message();

alter table public.ticket_messages enable row level security;

drop policy if exists "read ticket messages" on public.ticket_messages;
create policy "read ticket messages"
on public.ticket_messages
for select
to authenticated
using (
  exists (
    select 1
    from public.tickets t
    where t.id = ticket_id
      and (t.customer_id = auth.uid() or public.is_staff(auth.uid()))
  )
);

drop policy if exists "insert ticket messages" on public.ticket_messages;
create policy "insert ticket messages"
on public.ticket_messages
for insert
to authenticated
with check (
  sender_id = auth.uid()
  and exists (
    select 1
    from public.tickets t
    where t.id = ticket_id
      and (t.customer_id = auth.uid() or public.is_staff(auth.uid()))
  )
);

grant select, insert on public.ticket_messages to authenticated;
grant usage, select on sequence public.ticket_number_seq to authenticated;

notify pgrst, 'reload schema';
