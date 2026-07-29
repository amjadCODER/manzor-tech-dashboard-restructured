create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization text,
  category text,
  status text default 'active',
  created_at timestamptz default now()
);

create table if not exists client_mails (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  email text not null,
  inbox_url text,
  status text default 'active',
  notes text,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text,
  url text,
  status text default 'development',
  version text,
  host text,
  created_at timestamptz default now()
);
