-- Matrícula funcional dos servidores e diretório mínimo para seleção no termo de Sinistro.
alter table public.profiles add column if not exists matricula text not null default '';

create table if not exists public.server_directory (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  full_name text not null,
  matricula text not null unique
);
alter table public.server_directory enable row level security;
revoke all on public.server_directory from anon;
revoke insert, update, delete on public.server_directory from authenticated;
grant select on public.server_directory to authenticated;

drop policy if exists server_directory_active_users_select on public.server_directory;
create policy server_directory_active_users_select on public.server_directory
for select to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = (select auth.uid()) and p.status = 'active'
));

create or replace function public.sync_server_directory()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if new.status = 'active' and nullif(btrim(new.matricula), '') is not null then
    insert into public.server_directory(user_id, full_name, matricula)
    values (new.id, new.full_name, btrim(new.matricula))
    on conflict (user_id) do update
      set full_name = excluded.full_name, matricula = excluded.matricula;
  else
    delete from public.server_directory where user_id = new.id;
  end if;
  return new;
end;
$$;
revoke all on function public.sync_server_directory() from public, anon, authenticated;

drop trigger if exists profiles_sync_server_directory on public.profiles;
create trigger profiles_sync_server_directory
after insert or update of full_name, matricula, status on public.profiles
for each row execute function public.sync_server_directory();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles(id, full_name, email, matricula, status, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'matricula', ''),
    'pending',
    'consulta'
  );
  return new;
end;
$$;

insert into public.server_directory(user_id, full_name, matricula)
select id, full_name, btrim(matricula)
from public.profiles
where status = 'active' and nullif(btrim(matricula), '') is not null
on conflict (user_id) do update
set full_name = excluded.full_name, matricula = excluded.matricula;
