insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('contracts','contracts',false,10485760,array['application/pdf'])
on conflict (id) do nothing;

create policy "authenticated contract files read"
on storage.objects for select to authenticated
using (bucket_id='contracts');

create policy "authenticated contract files upload"
on storage.objects for insert to authenticated
with check (bucket_id='contracts');

create policy "admin contract files delete"
on storage.objects for delete to authenticated
using (bucket_id='contracts' and public.is_admin());
