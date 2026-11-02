# Testes automatizados administrativos (QA)

A suíte usa Playwright para entrar pela tela real de login e executar jornadas de cadastro, edição, consulta e exclusão nos módulos operacionais, além de validar pesquisa global e relatórios.

## Requisitos

- Node.js 20+
- Conta administrativa de teste ativa no Supabase, com permissões de criação, edição e exclusão nos módulos operacionais.
- Não use a conta de produção se não aceitar que os registros temporários sejam gravados e removidos no banco real.

## Instalação

```bash
npm install
npx playwright install chromium
```

## Executar no PowerShell

```powershell
$env:DEMUTRAN_ADMIN_EMAIL="admin-de-teste@exemplo.com"
$env:DEMUTRAN_ADMIN_PASSWORD="SENHA_DA_CONTA_DE_TESTE"
npm run qa:admin
```

Opcional: defina `$env:DEMUTRAN_QA_URL` para apontar a suíte a outro ambiente. Para visualizar o navegador, use `$env:QA_HEADLESS="false"`.

## Segurança e escopo

- As credenciais são lidas exclusivamente de variáveis de ambiente; não são gravadas no repositório, logs de teste ou arquivos de configuração.
- Cada jornada usa identificador `QA-AUTO-...`, tenta concluir o CRUD e remove o próprio registro ao final.
- Execute preferencialmente com uma conta administrativa dedicada a QA. Não use uma conta real de operação.
- O módulo Usuários não é submetido a criação/exclusão: perfis estão ligados a identidades do Supabase Auth e sua remoção exige fluxo administrativo específico.
- Definições institucionais, fotos e anexos não são alterados pela suíte.
- Sinistro é ignorado se não houver servidor ativo com matrícula para vínculo.
- A suíte grava dados no ambiente configurado. Para isolar totalmente os testes, use um projeto Supabase de QA; o plano atual não oferece Database Branching.

## Relatórios

O Playwright gera relatório HTML em `qa-report/`, além de trace, screenshot e vídeo quando um teste falha. Os arquivos são locais e não são enviados ao GitHub.
