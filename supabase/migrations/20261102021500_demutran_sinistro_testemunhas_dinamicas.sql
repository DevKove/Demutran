-- Expande o cadastro de testemunhas do Sinistro para até quatro pessoas
-- e oferece descrição manual quando o sexo informado for "Outro".
alter table public.traffic_accident_reports
  add column if not exists v1_sexo_outro text not null default '',
  add column if not exists v2_sexo_outro text not null default '',
  add column if not exists testemunha3_nome text not null default '',
  add column if not exists testemunha3_rg text not null default '',
  add column if not exists testemunha3_endereco text not null default '',
  add column if not exists testemunha3_telefone text not null default '',
  add column if not exists testemunha4_nome text not null default '',
  add column if not exists testemunha4_rg text not null default '',
  add column if not exists testemunha4_endereco text not null default '',
  add column if not exists testemunha4_telefone text not null default '';

-- Normaliza os valores legados para corresponder às opções atuais do formulário.
update public.traffic_accident_reports
set v1_sexo = case v1_sexo when 'M' then 'Masculino' when 'F' then 'Feminino' else v1_sexo end,
    v2_sexo = case v2_sexo when 'M' then 'Masculino' when 'F' then 'Feminino' else v2_sexo end
where v1_sexo in ('M','F') or v2_sexo in ('M','F');
