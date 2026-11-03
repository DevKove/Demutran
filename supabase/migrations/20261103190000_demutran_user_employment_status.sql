alter table public.profiles
  add column if not exists employment_status text not null default 'Ativo';

alter table public.profiles
  drop constraint if exists profiles_employment_status_check;

alter table public.profiles
  add constraint profiles_employment_status_check
  check (employment_status in ('Ativo', 'Afastado', 'Inativo'));
