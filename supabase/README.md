# DEMUTRAN — Supabase

Projeto: `acqausvydpkvciwmyski`.

## Módulos
- `profiles`: contas, perfis e aprovação.
- `materials`: estoque de materiais.
- `inspections`: vistorias.
- `service_orders`: ordens de serviço.
- `shifts`: escalas.
- `rental_vehicles`: veículos de aluguel, locadora, contrato, vigência e valores.
- `traffic_accident_reports`: RST com protocolo sequencial, data/hora, local, envolvidos, veículos, danos e providências.
- `institutional_settings`: identificação institucional única para documentos oficiais.

## Segurança
Todas as tabelas públicas usam RLS. Veículos de aluguel e RST usam permissões por módulo (`veiculos_aluguel` e `rst`) e auditoria de inserção, alteração e exclusão. Definições institucionais permitem leitura conforme perfil, mas somente `admin` ativo pode inserir/alterar, inclusive por chamadas diretas à API.

## Definições institucionais
O registro singleton `id='principal'` armazena órgão, departamento, endereço, bairro, município/UF/CEP, telefone, celular, e-mail, site, responsável, cargo, CNPJ/identificação, URL do logotipo e textos adicionais de cabeçalho/rodapé. Os campos são carregados pelo frontend e ficam disponíveis para a geração de documentos.
