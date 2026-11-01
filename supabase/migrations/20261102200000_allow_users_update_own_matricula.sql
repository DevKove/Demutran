-- Permite que cada usuário informe/atualize somente a própria matrícula.
create unique index if not exists profiles_matricula_unique
  on public.profiles (lower(btrim(matricula)))
  where nullif(btrim(matricula), '') is not null;

create or replace function public.update_my_matricula(p_matricula text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_matricula text := btrim(coalesce(p_matricula, ''));
begin
  if v_user_id is null then
    raise exception 'Autenticação necessária.';
  end if;
  if length(v_matricula) < 1 or length(v_matricula) > 30 then
    raise exception 'A matrícula deve conter entre 1 e 30 caracteres.';
  end if;
  update public.profiles
    set matricula = v_matricula
    where id = v_user_id;
  if not found then
    raise exception 'Perfil não encontrado.';
  end if;
exception
  when unique_violation then
    raise exception 'Esta matrícula já está cadastrada para outro usuário.';
end;
$$;

revoke all on function public.update_my_matricula(text) from public, anon;
grant execute on function public.update_my_matricula(text) to authenticated;
