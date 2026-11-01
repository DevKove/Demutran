-- Permite anexar fotos tanto no cadastro quanto na edição e limita cada veículo a 10 imagens.
drop policy if exists traffic_accident_images_insert on storage.objects;
create policy traffic_accident_images_insert on storage.objects for insert to authenticated
with check (bucket_id='traffic-accident-images' and (storage.foldername(name))[2] in ('1','2')
  and (private.has_permission('rst','create') or private.has_permission('rst','update'))
  and exists(select 1 from public.traffic_accident_reports r where r.id::text=(storage.foldername(name))[1]));
alter table public.traffic_accident_reports drop constraint if exists traffic_accident_images_vehicle1_limit;
alter table public.traffic_accident_reports add constraint traffic_accident_images_vehicle1_limit check (jsonb_typeof(danos_veiculo1_imagens)='array' and jsonb_array_length(danos_veiculo1_imagens)<=10);
alter table public.traffic_accident_reports drop constraint if exists traffic_accident_images_vehicle2_limit;
alter table public.traffic_accident_reports add constraint traffic_accident_images_vehicle2_limit check (jsonb_typeof(danos_veiculo2_imagens)='array' and jsonb_array_length(danos_veiculo2_imagens)<=10);
