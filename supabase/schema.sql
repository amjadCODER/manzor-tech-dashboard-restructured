-- نفذ هذا الملف داخل Supabase SQL Editor
create extension if not exists "pgcrypto";

create type public.customer_status as enum ('مشترك','جاري خدمته','منجز','متوقف','ملغي');
create type public.contract_status as enum ('ساري','قارب على الانتهاء','منتهي','ملغي');
create type public.user_role as enum ('admin','employee');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.user_role not null default 'employee',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  customer_code text unique,
  name text not null,
  organization_name text,
  phone text not null,
  email text,
  city text,
  national_id text,
  commercial_registration text,
  status public.customer_status not null default 'مشترك',
  assigned_to uuid references public.profiles(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create sequence public.customer_code_seq start 1;
create or replace function public.set_customer_code()
returns trigger language plpgsql as $$
begin
  if new.customer_code is null then
    new.customer_code := 'MT-' || extract(year from now())::text || '-' || lpad(nextval('public.customer_code_seq')::text, 5, '0');
  end if;
  return new;
end $$;
create trigger trg_customer_code before insert on public.customers for each row execute function public.set_customer_code();

create table public.contract_templates (
  id text primary key,
  name text not null,
  description text,
  fields jsonb not null default '[]',
  clauses jsonb not null default '[]',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  contract_code text unique,
  customer_id uuid not null references public.customers(id) on delete cascade,
  template_id text references public.contract_templates(id),
  contract_type text not null,
  title text not null,
  start_date date not null,
  end_date date,
  amount numeric(14,2),
  status public.contract_status not null default 'ساري',
  version integer not null default 1,
  fields jsonb not null default '{}',
  pdf_path text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create sequence public.contract_code_seq start 1;
create or replace function public.set_contract_code()
returns trigger language plpgsql as $$
begin
  if new.contract_code is null then
    new.contract_code := 'MT-CON-' || extract(year from now())::text || '-' || lpad(nextval('public.contract_code_seq')::text, 5, '0');
  end if;
  return new;
end $$;
create trigger trg_contract_code before insert on public.contracts for each row execute function public.set_contract_code();

create table public.customer_documents (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  contract_id uuid references public.contracts(id) on delete set null,
  file_name text not null,
  file_path text not null,
  document_type text not null default 'contract',
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.customer_status_history (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  old_status public.customer_status,
  new_status public.customer_status not null,
  changed_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  entity_type text not null,
  entity_id uuid,
  action text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create or replace function public.update_contract_statuses()
returns void language plpgsql security definer as $$
begin
  update public.contracts set status='منتهي'
  where end_date < current_date and status not in ('منتهي','ملغي');

  update public.contracts set status='قارب على الانتهاء'
  where end_date between current_date and current_date + interval '30 days'
    and status='ساري';
end $$;

create index customers_phone_idx on public.customers(phone);
create index customers_email_idx on public.customers(email);
create index contracts_customer_idx on public.contracts(customer_id);
create index contracts_end_date_idx on public.contracts(end_date);
