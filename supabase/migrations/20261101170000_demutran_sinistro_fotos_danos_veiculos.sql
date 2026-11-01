-- Anexos fotográficos privados para os danos de cada veículo em um sinistro.
alter table public.traffic_accident_reports add column if not exists danos_veiculo1_imagens jsonb not null default '[]'::jsonb, add column if not exists danos_veiculo2_imagens jsonb not null default '[]'::jsonb;
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types) values ('traffic-accident-images','traffic-accident-images',false,8388608,array['image/jpeg','image/png','image/webp','image/gif']) on conflict (id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists traffic_accident_images_read on storage.objects;
create policy traffic_accident_images_read on storage.objects for select to authenticated using (bucket_id='traffic-accident-images' and private.has_permission('rst','read') and exists(select 1 from public.traffic_accident_reports r where r.id::text=(storage.foldername(name))[1]));
drop policy if exists traffic_accident_images_insert on storage.objects;
create policy traffic_accident_images_insert on storage.objects for insert to authenticated with check (bucket_id='traffic-accident-images' and (storage.foldername(name))[2] in ('1','2') and private.has_permission('rst','update') and exists(select 1 from public.traffic_accident_reports r where r.id::text=(storage.foldername(name))[1]));
drop policy if exists traffic_accident_images_update on storage.objects;
create policy traffic_accident_images_update on storage.objects for update to authenticated using (bucket_id='traffic-accident-images' and private.has_permission('rst','update')) with check (bucket_id='traffic-accident-images' and (storage.foldername(name))[2] in ('1','2') and private.has_permission('rst','update'));
drop policy if exists traffic_accident_images_delete on storage.objects;
create policy traffic_accident_images_delete on storage.objects for delete to authenticated using (bucket_id='traffic-accident-images' and private.has_permission('rst','update'));
