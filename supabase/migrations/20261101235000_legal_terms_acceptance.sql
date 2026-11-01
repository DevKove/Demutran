create table if not exists public.legal_acceptances (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 terms_version text not null,
 privacy_version text not null,
 accepted_at timestamptz not null default now(),
 accepted_via text not null default 'signup',
 constraint legal_acceptances_versions_check check (terms_version='1.0' and privacy_version='1.0'),
 constraint legal_acceptances_source_check check (accepted_via='signup'),
 constraint legal_acceptances_user_versions_unique unique(user_id,terms_version,privacy_version)
);
alter table public.legal_acceptances enable row level security;
revoke all on public.legal_acceptances from anon,authenticated;
grant select on public.legal_acceptances to authenticated;
create policy "Users can read their own legal acceptance" on public.legal_acceptances
 for select to authenticated using ((select auth.uid())=user_id);
create or replace function public.validate_signup_legal_acceptance()
returns trigger language plpgsql security definer set search_path=''
as $$
begin
 if new.raw_user_meta_data->>'terms_accepted' is distinct from 'true'
 or new.raw_user_meta_data->>'privacy_accepted' is distinct from 'true'
 or new.raw_user_meta_data->>'terms_version' is distinct from '1.0'
 or new.raw_user_meta_data->>'privacy_version' is distinct from '1.0' then
  raise exception 'É obrigatório aceitar os Termos de Uso e a Política de Privacidade para criar uma conta.' using errcode='23514';
 end if;
 return new;
end;
$$;
create or replace function public.record_signup_legal_acceptance()
returns trigger language plpgsql security definer set search_path=''
as $$
begin
 insert into public.legal_acceptances(user_id,terms_version,privacy_version,accepted_via)
 values(new.id,'1.0','1.0','signup') on conflict(user_id,terms_version,privacy_version) do nothing;
 return new;
end;
$$;
revoke all on function public.validate_signup_legal_acceptance() from public,anon,authenticated;
revoke all on function public.record_signup_legal_acceptance() from public,anon,authenticated;
drop trigger if exists validate_signup_legal_acceptance on auth.users;
create trigger validate_signup_legal_acceptance before insert on auth.users
 for each row execute function public.validate_signup_legal_acceptance();
drop trigger if exists record_signup_legal_acceptance on auth.users;
create trigger record_signup_legal_acceptance after insert on auth.users
 for each row execute function public.record_signup_legal_acceptance();
