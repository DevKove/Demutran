-- DEMUTRAN: módulos de Sinalização Viária e Educação para o Trânsito
create table if not exists public.road_signage (
  id uuid primary key default gen_random_uuid(),
  codigo text not null default '',
  tipo text not null check (tipo in ('Placa de regulamentação','Placa de advertência','Placa de indicação','Sinalização horizontal','Semáforo','Dispositivo auxiliar','Outros')),
  descricao text not null,
  local text not null,
  bairro text not null default '',
  referencia text not null default '',
  material text not null default '',
  quantidade integer not null default 1 check (quantidade > 0),
  condicao text not null default 'Boa' check (condicao in ('Boa','Regular','Danificada','Inexistente','Necessita substituição')),
  status text not null default 'Planejada' check (status in ('Planejada','Solicitada','Em instalação','Instalada','Em manutenção','Desativada')),
  data_instalacao date,
  data_manutencao date,
  responsavel text not null default '',
  observacoes text not null default '',
  created_by uuid not null default auth.uid() references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.traffic_education_actions (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  tipo text not null check (tipo in ('Palestra','Ação em escola','Campanha educativa','Blitz educativa','Ação comunitária','Evento','Outro')),
  publico_alvo text not null default '',
  instituicao text not null default '',
  local text not null,
  data date not null,
  horario time,
  responsavel text not null,
  participantes integer not null default 0 check (participantes >= 0),
  status text not null default 'Planejada' check (status in ('Planejada','Agendada','Em andamento','Realizada','Cancelada')),
  descricao text not null default '',
  resultado text not null default '',
  created_by uuid not null default auth.uid() references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.road_signage enable row level security;
alter table public.traffic_education_actions enable row level security;

grant select, insert, update, delete on public.road_signage, public.traffic_education_actions to authenticated;

drop policy if exists road_signage_read on public.road_signage;
create policy road_signage_read on public.road_signage for select to authenticated
using ((select private.has_permission('sinalizacao_viaria','read')));
drop policy if exists road_signage_insert on public.road_signage;
create policy road_signage_insert on public.road_signage for insert to authenticated
with check ((select private.has_permission('sinalizacao_viaria','create')) and created_by = (select auth.uid()));
drop policy if exists road_signage_update on public.road_signage;
create policy road_signage_update on public.road_signage for update to authenticated
using ((select private.has_permission('sinalizacao_viaria','update')))
with check ((select private.has_permission('sinalizacao_viaria','update')));
drop policy if exists road_signage_delete on public.road_signage;
create policy road_signage_delete on public.road_signage for delete to authenticated
using ((select private.has_permission('sinalizacao_viaria','delete')));

drop policy if exists traffic_education_actions_read on public.traffic_education_actions;
create policy traffic_education_actions_read on public.traffic_education_actions for select to authenticated
using ((select private.has_permission('educacao_transito','read')));
drop policy if exists traffic_education_actions_insert on public.traffic_education_actions;
create policy traffic_education_actions_insert on public.traffic_education_actions for insert to authenticated
with check ((select private.has_permission('educacao_transito','create')) and created_by = (select auth.uid()));
drop policy if exists traffic_education_actions_update on public.traffic_education_actions;
create policy traffic_education_actions_update on public.traffic_education_actions for update to authenticated
using ((select private.has_permission('educacao_transito','update')))
with check ((select private.has_permission('educacao_transito','update')));
drop policy if exists traffic_education_actions_delete on public.traffic_education_actions;
create policy traffic_education_actions_delete on public.traffic_education_actions for delete to authenticated
using ((select private.has_permission('educacao_transito','delete')));

insert into public.role_permissions(role,module,action)
select r.role,m.module,a.action
from (values ('admin'),('gestor'),('agente'),('consulta')) as r(role)
cross join (values ('sinalizacao_viaria'),('educacao_transito')) as m(module)
cross join (values ('read'),('create'),('update'),('delete')) as a(action)
where r.role in ('admin','gestor')
   or (r.role='agente' and a.action in ('read','create','update'))
   or (r.role='consulta' and a.action='read')
on conflict(role,module,action) do nothing;

create index if not exists road_signage_created_by_idx on public.road_signage(created_by);
create index if not exists road_signage_local_idx on public.road_signage(local);
create index if not exists road_signage_status_idx on public.road_signage(status);
create index if not exists traffic_education_actions_created_by_idx on public.traffic_education_actions(created_by);
create index if not exists traffic_education_actions_date_idx on public.traffic_education_actions(data desc);
create index if not exists traffic_education_actions_status_idx on public.traffic_education_actions(status);

drop trigger if exists set_updated_at on public.road_signage;
create trigger set_updated_at before update on public.road_signage for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at on public.traffic_education_actions;
create trigger set_updated_at before update on public.traffic_education_actions for each row execute function public.set_updated_at();

drop trigger if exists audit_changes on public.road_signage;
create trigger audit_changes after insert or update or delete on public.road_signage for each row execute function private.audit_row();
drop trigger if exists audit_changes on public.traffic_education_actions;
create trigger audit_changes after insert or update or delete on public.traffic_education_actions for each row execute function private.audit_row();
