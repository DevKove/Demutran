<!-- DEMUTRAN README -->

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:F5C400,55:FFD83D,100:171717&height=210&section=header&text=DEMUTRAN&fontSize=58&fontColor=171717&fontAlignY=38&desc=Gest%C3%A3o%20inteligente%20do%20tr%C3%A2nsito%20municipal&descAlignY=61&descSize=17" width="100%" alt="DEMUTRAN — Gestão inteligente do trânsito municipal" />

# DEMUTRAN

**Sistema de gestão do Departamento Municipal de Trânsito**

Gestão operacional, organização de equipes e controle das atividades municipais de trânsito em uma única plataforma.

[![Aplicação](https://img.shields.io/badge/Acessar%20sistema-GitHub%20Pages-F5C400?style=for-the-badge&logo=github&logoColor=171717)](https://devkove.github.io/Demutran/)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=171717)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)

</div>

---

## 🚦 Sobre o projeto

O **DEMUTRAN** é uma aplicação web voltada à gestão das rotinas administrativas e operacionais do Departamento Municipal de Trânsito. Seu objetivo é centralizar registros, facilitar o acompanhamento das atividades e melhorar a rastreabilidade das operações.

A interface utiliza identidade visual em amarelo institucional, preto e tons neutros, com layout responsivo para computadores, tablets e celulares.

**Aplicação publicada:** https://devkove.github.io/Demutran/

## 🧭 Módulos do sistema

| Módulo | Finalidade |
|---|---|
| 📊 **Início** | Painel com indicadores e visão resumida das atividades. |
| 📦 **Material** | Organização e controle de materiais e estoque. |
| 👥 **Usuários** | Gestão de contas, perfis e permissões de acesso. |
| 📝 **Ordens de Serviço** | Registro e acompanhamento de solicitações e serviços. |
| 🗓️ **Escala** | Organização de equipes, agentes, turnos e plantões. |
| 🚧 **Sinalização Viária** | Cadastro e acompanhamento de placas, sinalização horizontal, semáforos e dispositivos auxiliares. |
| 🎓 **Educação para o Trânsito** | Registro de campanhas, palestras, ações educativas e atividades comunitárias. |
| 🚕 **Veículos de Aluguel** | Cadastro e gestão de veículos vinculados ao serviço de transporte por aluguel. |
| 🚨 **Sinistro** | Registro de ocorrências de trânsito e preenchimento do Termo de Declaração de Acidente de Trânsito. |
| ⚙️ **Definições** | Configurações institucionais e dados utilizados na identificação dos documentos. |

### Recursos do módulo Sinistro

- Formulário para registro de acidente de trânsito.
- Cadastro opcional de até quatro testemunhas.
- Registro de sexo com opção de preenchimento personalizado.
- Anexos de até dez imagens de danos para cada veículo.
- Campo de assinatura com suporte a toque, caneta e mouse.
- Identificação do servidor por matrícula.

## 🔐 Acesso e segurança

O sistema utiliza autenticação e serviços de backend do **Supabase**.

- Sessões de usuário gerenciadas pelo Supabase Auth.
- Perfis e permissões para controlar o acesso às funcionalidades.
- Políticas de segurança em nível de linha (RLS) no banco de dados.
- Operações de dados submetidas às regras de autorização do banco.
- Armazenamento privado para imagens de perfil e anexos de sinistros.
- Matrícula individual do servidor, com atualização restrita à própria conta.

> A chave publishable do Supabase é apropriada para uso no cliente. Chaves secretas ou `service_role` nunca devem ser incluídas no frontend, no README ou no histórico do Git.

## 🎨 Identidade visual

<div align="center">
<img src="https://img.shields.io/badge/Amarelo-%23F5C400?style=for-the-badge&labelColor=F5C400" alt="Amarelo institucional #F5C400" />
<img src="https://img.shields.io/badge/Preto-%23171717?style=for-the-badge&labelColor=171717" alt="Preto #171717" />
<img src="https://img.shields.io/badge/Grafite-%23242424?style=for-the-badge&labelColor=242424" alt="Grafite #242424" />
<img src="https://img.shields.io/badge/Cinza%20claro-%23F4F5F7?style=for-the-badge&labelColor=F4F5F7" alt="Cinza claro #F4F5F7" />
</div>

- **Amarelo #F5C400:** identidade institucional e ações de destaque.
- **Preto #171717 / grafite #242424:** navegação, estrutura e contraste.
- **Cinza claro #F4F5F7:** superfícies de conteúdo e leitura.

A experiência inclui navegação responsiva, transições, animações sutis, gradientes e elementos visuais de apoio.

## 🧰 Tecnologias

| Tecnologia | Utilização |
|---|---|
| [React 19](https://react.dev/) | Interface e componentes |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [Vite 6](https://vite.dev/) | Desenvolvimento e build |
| [Supabase](https://supabase.com/) | Autenticação, banco de dados e armazenamento |
| [Lucide React](https://lucide.dev/) | Ícones |
| CSS | Layout, responsividade e animações |
| GitHub Actions | Validação e publicação |

## 💻 Executar localmente

### Requisitos

- Node.js 20 ou superior
- npm

### Instalação

```bash
git clone https://github.com/DevKove/Demutran.git
cd Demutran
npm install
npm run dev
```

O Vite informará no terminal o endereço local para acessar a aplicação.

### Scripts

```bash
npm run dev       # Servidor local de desenvolvimento
npm run build     # Verificação TypeScript e build de produção
npm run preview   # Pré-visualização do build
```

### Configuração do backend

O cliente Supabase está configurado em `src/lib/supabase.ts`. O projeto utiliza a URL e a chave publishable do ambiente DEMUTRAN. Não substitua esses valores por chaves secretas e não exponha credenciais administrativas no navegador.

As alterações de estrutura do banco ficam versionadas em `supabase/migrations/`. Ao desenvolver novas funcionalidades que dependam do banco, inclua a migração correspondente e as políticas RLS necessárias.

## 🗂️ Estrutura do repositório

```text
Demutran/
├── .github/
│   └── workflows/          # Validação e deploy automático
├── src/
│   ├── components/          # Componentes reutilizáveis
│   ├── lib/                 # Cliente Supabase e camada de dados
│   ├── App.tsx              # Aplicação e navegação
│   ├── main.tsx             # Inicialização React
│   ├── styles.css           # Estilos principais
│   ├── auth.css             # Estilos de autenticação
│   └── visual-enhancements.css
├── supabase/
│   ├── migrations/          # Migrações SQL versionadas
│   └── README.md
├── favicon.svg              # Favicon do sistema
├── index.html
├── package.json
└── vite.config.ts
```

## 🚀 Publicação

O projeto é publicado pelo **GitHub Pages**. Os workflows do GitHub Actions executam a validação e o processo de deploy quando alterações são integradas à branch principal.

- **Produção:** https://devkove.github.io/Demutran/
- **Repositório:** https://github.com/DevKove/Demutran
- **Histórico de execuções:** https://github.com/DevKove/Demutran/actions

## 🛡️ Diretrizes para contribuição

1. Crie uma branch específica para cada alteração.
2. Preserve as regras de negócio e os dados existentes.
3. Para mudanças no banco, adicione uma migração SQL versionada.
4. Aplique políticas RLS para leitura e escrita; não dependa apenas de controles visuais na interface.
5. Execute `npm run build` antes de abrir o pull request.
6. Integre alterações à `main` por pull request após a validação.

## 📌 Estado do projeto

O DEMUTRAN está em desenvolvimento contínuo. Os módulos e recursos descritos neste documento representam o escopo e as funcionalidades presentes no repositório; a disponibilidade de cada operação depende das permissões do usuário e da configuração correspondente no Supabase.

---

<div align="center">

**DEMUTRAN** · Gestão pública com organização, eficiência e transparência.

<sub>Desenvolvido para apoiar a gestão municipal de trânsito.</sub>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:171717,100:F5C400&height=100&section=footer" width="100%" alt="" />

</div>
