alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.contract_templates enable row level security;
alter table public.contracts enable row level security;
alter table public.customer_documents enable row level security;
alter table public.customer_status_history enable row level security;
alter table public.activity_logs enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer as $$
  select exists(select 1 from public.profiles where id=auth.uid() and role='admin' and is_active=true);
$$;

create policy "authenticated profiles read" on public.profiles for select to authenticated using (true);
create policy "admin profiles manage" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "authenticated customers read" on public.customers for select to authenticated using (true);
create policy "authenticated customers insert" on public.customers for insert to authenticated with check (true);
create policy "authenticated customers update" on public.customers for update to authenticated using (true);
create policy "admin customers delete" on public.customers for delete to authenticated using (public.is_admin());

create policy "authenticated templates read" on public.contract_templates for select to authenticated using (true);
create policy "admin templates manage" on public.contract_templates for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "authenticated contracts read" on public.contracts for select to authenticated using (true);
create policy "authenticated contracts insert" on public.contracts for insert to authenticated with check (true);
create policy "authenticated contracts update" on public.contracts for update to authenticated using (true);
create policy "admin contracts delete" on public.contracts for delete to authenticated using (public.is_admin());

create policy "authenticated documents read" on public.customer_documents for select to authenticated using (true);
create policy "authenticated documents insert" on public.customer_documents for insert to authenticated with check (true);
create policy "admin documents delete" on public.customer_documents for delete to authenticated using (public.is_admin());

create policy "authenticated status history read" on public.customer_status_history for select to authenticated using (true);
create policy "authenticated status history insert" on public.customer_status_history for insert to authenticated with check (true);

create policy "authenticated activity read" on public.activity_logs for select to authenticated using (true);
create policy "authenticated activity insert" on public.activity_logs for insert to authenticated with check (true);
