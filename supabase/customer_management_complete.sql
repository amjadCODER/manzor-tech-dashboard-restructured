create extension if not exists "pgcrypto";
create schema if not exists customer_management;

do $$ begin
  create type customer_management.customer_status as enum ('مشترك','جاري خدمته','منجز','متوقف','ملغي');
exception when duplicate_object then null; end $$;

do $$ begin
  create type customer_management.contract_status as enum ('ساري','قارب على الانتهاء','منتهي','ملغي');
exception when duplicate_object then null; end $$;

create sequence if not exists customer_management.customer_code_seq start 1;
create sequence if not exists customer_management.contract_code_seq start 1;

create table if not exists customer_management.customers (
  id uuid primary key default gen_random_uuid(),
  customer_code text unique,
  name text not null,
  organization_name text,
  phone text not null,
  email text,
  city text,
  national_id text,
  commercial_registration text,
  status customer_management.customer_status not null default 'مشترك',
  assigned_to text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists customer_management.contract_templates (
  id text primary key,
  name text not null,
  description text,
  fields jsonb not null default '[]'::jsonb,
  clauses jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists customer_management.contracts (
  id uuid primary key default gen_random_uuid(),
  contract_code text unique,
  customer_id uuid not null references customer_management.customers(id) on delete cascade,
  template_id text references customer_management.contract_templates(id) on delete set null,
  contract_type text not null,
  title text not null,
  start_date date not null,
  end_date date,
  amount numeric(14,2),
  status customer_management.contract_status not null default 'ساري',
  version integer not null default 1,
  fields jsonb not null default '{}'::jsonb,
  pdf_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contracts_dates_check check (end_date is null or end_date >= start_date),
  constraint contracts_amount_check check (amount is null or amount >= 0),
  constraint contracts_version_check check (version >= 1)
);

create table if not exists customer_management.customer_documents (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customer_management.customers(id) on delete cascade,
  contract_id uuid references customer_management.contracts(id) on delete set null,
  file_name text not null,
  file_path text not null,
  document_type text not null default 'contract',
  created_at timestamptz not null default now()
);

create table if not exists customer_management.customer_status_history (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customer_management.customers(id) on delete cascade,
  old_status customer_management.customer_status,
  new_status customer_management.customer_status not null,
  created_at timestamptz not null default now()
);

create table if not exists customer_management.contract_status_history (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references customer_management.contracts(id) on delete cascade,
  old_status customer_management.contract_status,
  new_status customer_management.contract_status not null,
  created_at timestamptz not null default now()
);

create table if not exists customer_management.activity_logs (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function customer_management.set_updated_at()
returns trigger language plpgsql set search_path = customer_management as $$
begin new.updated_at = now(); return new; end; $$;

create or replace function customer_management.set_customer_code()
returns trigger language plpgsql security definer set search_path = customer_management as $$
begin
  if new.customer_code is null or btrim(new.customer_code) = '' then
    new.customer_code := 'MT-C-' || extract(year from current_date)::text || '-' || lpad(nextval('customer_management.customer_code_seq')::text, 5, '0');
  end if;
  return new;
end; $$;

create or replace function customer_management.set_contract_code()
returns trigger language plpgsql security definer set search_path = customer_management as $$
begin
  if new.contract_code is null or btrim(new.contract_code) = '' then
    new.contract_code := 'MT-CON-' || extract(year from current_date)::text || '-' || lpad(nextval('customer_management.contract_code_seq')::text, 5, '0');
  end if;
  return new;
end; $$;

create or replace function customer_management.log_customer_status_change()
returns trigger language plpgsql security definer set search_path = customer_management as $$
begin
  if old.status is distinct from new.status then
    insert into customer_management.customer_status_history(customer_id,old_status,new_status)
    values(new.id,old.status,new.status);
  end if;
  return new;
end; $$;

create or replace function customer_management.log_contract_status_change()
returns trigger language plpgsql security definer set search_path = customer_management as $$
begin
  if old.status is distinct from new.status then
    insert into customer_management.contract_status_history(contract_id,old_status,new_status)
    values(new.id,old.status,new.status);
  end if;
  return new;
end; $$;

create or replace function customer_management.update_contract_statuses()
returns void language plpgsql security definer set search_path = customer_management as $$
begin
  update customer_management.contracts set status='منتهي',updated_at=now()
  where end_date is not null and end_date < current_date and status not in ('منتهي','ملغي');

  update customer_management.contracts set status='قارب على الانتهاء',updated_at=now()
  where end_date is not null and end_date between current_date and current_date + 30 and status='ساري';

  update customer_management.contracts set status='ساري',updated_at=now()
  where (end_date is null or end_date > current_date + 30) and status='قارب على الانتهاء';
end; $$;

drop trigger if exists trg_customers_updated_at on customer_management.customers;
create trigger trg_customers_updated_at before update on customer_management.customers for each row execute function customer_management.set_updated_at();
drop trigger if exists trg_contracts_updated_at on customer_management.contracts;
create trigger trg_contracts_updated_at before update on customer_management.contracts for each row execute function customer_management.set_updated_at();
drop trigger if exists trg_templates_updated_at on customer_management.contract_templates;
create trigger trg_templates_updated_at before update on customer_management.contract_templates for each row execute function customer_management.set_updated_at();
drop trigger if exists trg_customer_code on customer_management.customers;
create trigger trg_customer_code before insert on customer_management.customers for each row execute function customer_management.set_customer_code();
drop trigger if exists trg_contract_code on customer_management.contracts;
create trigger trg_contract_code before insert on customer_management.contracts for each row execute function customer_management.set_contract_code();
drop trigger if exists trg_customer_status_history on customer_management.customers;
create trigger trg_customer_status_history after update of status on customer_management.customers for each row execute function customer_management.log_customer_status_change();
drop trigger if exists trg_contract_status_history on customer_management.contracts;
create trigger trg_contract_status_history after update of status on customer_management.contracts for each row execute function customer_management.log_contract_status_change();

create index if not exists customers_phone_idx on customer_management.customers(phone);
create index if not exists customers_email_idx on customer_management.customers(email);
create index if not exists customers_status_idx on customer_management.customers(status);
create index if not exists contracts_customer_idx on customer_management.contracts(customer_id);
create index if not exists contracts_status_idx on customer_management.contracts(status);
create index if not exists contracts_end_date_idx on customer_management.contracts(end_date);
create index if not exists documents_customer_idx on customer_management.customer_documents(customer_id);

alter table customer_management.customers enable row level security;
alter table customer_management.contract_templates enable row level security;
alter table customer_management.contracts enable row level security;
alter table customer_management.customer_documents enable row level security;
alter table customer_management.customer_status_history enable row level security;
alter table customer_management.contract_status_history enable row level security;
alter table customer_management.activity_logs enable row level security;

do $$ declare t text; begin
  foreach t in array array['customers','contract_templates','contracts','customer_documents','customer_status_history','contract_status_history','activity_logs'] loop
    execute format('drop policy if exists %I on customer_management.%I', t || '_read', t);
    execute format('create policy %I on customer_management.%I for select to anon, authenticated using (true)', t || '_read', t);
    execute format('drop policy if exists %I on customer_management.%I', t || '_insert', t);
    execute format('create policy %I on customer_management.%I for insert to anon, authenticated with check (true)', t || '_insert', t);
    execute format('drop policy if exists %I on customer_management.%I', t || '_update', t);
    execute format('create policy %I on customer_management.%I for update to anon, authenticated using (true) with check (true)', t || '_update', t);
    execute format('drop policy if exists %I on customer_management.%I', t || '_delete', t);
    execute format('create policy %I on customer_management.%I for delete to anon, authenticated using (true)', t || '_delete', t);
  end loop;
end $$;

grant usage on schema customer_management to anon, authenticated, service_role;
grant select, insert, update, delete on all tables in schema customer_management to anon, authenticated, service_role;
grant usage, select on all sequences in schema customer_management to anon, authenticated, service_role;
grant execute on all functions in schema customer_management to anon, authenticated, service_role;
alter default privileges in schema customer_management grant select, insert, update, delete on tables to anon, authenticated, service_role;
alter default privileges in schema customer_management grant usage, select on sequences to anon, authenticated, service_role;
alter default privileges in schema customer_management grant execute on functions to anon, authenticated, service_role;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('customer-contracts','customer-contracts',false,10485760,array['application/pdf'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists customer_contracts_read on storage.objects;
create policy customer_contracts_read on storage.objects for select to anon, authenticated using(bucket_id='customer-contracts');
drop policy if exists customer_contracts_insert on storage.objects;
create policy customer_contracts_insert on storage.objects for insert to anon, authenticated with check(bucket_id='customer-contracts');
drop policy if exists customer_contracts_update on storage.objects;
create policy customer_contracts_update on storage.objects for update to anon, authenticated using(bucket_id='customer-contracts') with check(bucket_id='customer-contracts');
drop policy if exists customer_contracts_delete on storage.objects;
create policy customer_contracts_delete on storage.objects for delete to anon, authenticated using(bucket_id='customer-contracts');

insert into customer_management.contract_templates(id,name,description,fields,clauses,is_active) values
('website','عقد تصميم وتطوير موقع إلكتروني','لتنفيذ المواقع والمتاجر والبوابات الإلكترونية','[]','[]',true),
('software','عقد تطوير نظام أو منصة إلكترونية','للأنظمة والمنصات والحلول المخصصة','[]','[]',true),
('saas','عقد اشتراك في نظام سحابي','لاشتراكات الأنظمة السحابية','[]','[]',true),
('support','عقد دعم فني وصيانة','للدعم والصيانة ومعالجة الأعطال','[]','[]',true),
('hosting','عقد استضافة وإدارة بنية تقنية','لاستضافة وإدارة الأنظمة والخوادم','[]','[]',true),
('creative','عقد تصميم وهوية وخدمات إبداعية','للتصميم والهوية والمحتوى والواجهات','[]','[]',true),
('operations','عقد إدارة وتشغيل خدمات تقنية','لتشغيل وإدارة الخدمات التقنية','[]','[]',true),
('license','عقد ترخيص استخدام برنامج','لمنح حق استخدام برنامج دون نقل ملكيته','[]','[]',true),
('source','عقد بيع وتسليم نظام مع الكود المصدري','لتسليم النظام والكود والوثائق','[]','[]',true),
('nda','اتفاقية سرية وعدم إفصاح','لحماية البيانات والمعلومات المتبادلة','[]','[]',true)
on conflict(id) do update set name=excluded.name,description=excluded.description,is_active=excluded.is_active,updated_at=now();

notify pgrst, 'reload schema';
