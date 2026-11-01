-- Fotos dos usuários: upload e manutenção exclusivos do administrador.
alter table public.profiles
  add column if not exists avatar_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('user-photos', 'user-photos', false, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists user_photos_read_active on storage.objects;
create policy user_photos_read_active
on storage.objects for select
to authenticated
using (
  bucket_id = 'user-photos'
  and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.status = 'active'
  )
);

drop policy if exists user_photos_insert_admin on storage.objects;
create policy user_photos_insert_admin
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'user-photos'
  and (storage.foldername(name))[1] is not null
  and exists (
    select 1 from public.profiles admin
    where admin.id = (select auth.uid())
      and admin.role = 'admin'
      and admin.status = 'active'
  )
  and exists (
    select 1 from public.profiles target
    where target.id::text = (storage.foldername(name))[1]
  )
);

drop policy if exists user_photos_update_admin on storage.objects;
create policy user_photos_update_admin
on storage.objects for update
to authenticated
using (
  bucket_id = 'user-photos'
  and exists (
    select 1 from public.profiles admin
    where admin.id = (select auth.uid())
      and admin.role = 'admin'
      and admin.status = 'active'
  )
)
with check (
  bucket_id = 'user-photos'
  and exists (
    select 1 from public.profiles admin
    where admin.id = (select auth.uid())
      and admin.role = 'admin'
      and admin.status = 'active'
  )
  and exists (
    select 1 from public.profiles target
    where target.id::text = (storage.foldername(name))[1]
  )
);

drop policy if exists user_photos_delete_admin on storage.objects;
create policy user_photos_delete_admin
on storage.objects for delete
to authenticated
using (
  bucket_id = 'user-photos'
  and exists (
    select 1 from public.profiles admin
    where admin.id = (select auth.uid())
      and admin.role = 'admin'
      and admin.status = 'active'
  )
);
