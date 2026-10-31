<!-- DEMUTRAN README -->

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:F5C400,55:FFD83D,100:171717&height=190&section=header&text=DEMUTRAN&fontSize=54&fontColor=171717&fontAlignY=38&desc=Gest%C3%A3o%20inteligente%20do%20tr%C3%A2nsito%20municipal&descAlignY=60&descSize=16" width="100%" alt="DEMUTRAN — Gestão inteligente do trânsito municipal" />

<strong>Plataforma de gestão do Departamento Municipal de Trânsito</strong>

Organização, rastreabilidade e eficiência para as operações de trânsito.

<img src="https://img.shields.io/badge/status-em%20desenvolvimento-F5C400?style=for-the-badge&labelColor=171717" alt="Em desenvolvimento" />
<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=171717" alt="React 19" />
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />

<a href="#-visão-geral">Visão geral</a> •
<a href="#-módulos">Módulos</a> •
<a href="#-tecnologias">Tecnologias</a> •
<a href="#-executar-localmente">Executar</a> •
<a href="#-próximas-etapas">Próximas etapas</a>

</div>

---

## 🚦 Visão geral

O **DEMUTRAN** é uma aplicação web concebida para centralizar rotinas administrativas e operacionais do Departamento Municipal de Trânsito. A proposta é reunir informações, facilitar o acompanhamento das atividades e oferecer uma interface clara para o trabalho diário das equipes.

A identidade visual combina **amarelo institucional**, **preto** e tons neutros, com foco em legibilidade, hierarquia visual e uso em computadores, tablets e celulares.

## 🧭 Módulos

<table>
<tr>
<td width="50%">

### 📊 Início
Painel operacional, indicadores e visão resumida das atividades.

</td>
<td width="50%">

### 📦 Material
Estrutura para catálogo, controle de estoque e movimentações.

</td>
</tr>
<tr>
<td>

### 👥 Usuários
Área destinada ao gerenciamento de usuários e permissões.

</td>
<td>

### 📝 Vistorias
Organização de inspeções, registros e histórico de vistorias.

</td>
</tr>
<tr>
<td>

### 🛠️ Ordens de Serviço
Abertura, acompanhamento e controle de solicitações de serviço.

</td>
<td>

### 🗓️ Escala
Planejamento de equipes, agentes, turnos e plantões.

</td>
</tr>
</table>

> **Estado atual:** a estrutura inicial da interface e a navegação entre os módulos estão criadas. Os módulos ainda precisam receber suas operações completas, integração com banco de dados, autenticação e regras de acesso.

## 🎨 Identidade visual

<div align="center">
<img src="https://img.shields.io/badge/Amarelo%20institucional-%23F5C400?style=for-the-badge&labelColor=F5C400" alt="Amarelo institucional #F5C400" />
<img src="https://img.shields.io/badge/Preto-%23171717?style=for-the-badge&labelColor=171717" alt="Preto #171717" />
<img src="https://img.shields.io/badge/Grafite-%23242424?style=for-the-badge&labelColor=242424" alt="Grafite #242424" />
<img src="https://img.shields.io/badge/Fundo%20claro-%23F4F5F7?style=for-the-badge&labelColor=F4F5F7" alt="Fundo claro #F4F5F7" />
</div>

- **Amarelo #F5C400:** destaque, identidade e ações prioritárias.
- **Preto #171717 e grafite #242424:** navegação, contraste e estrutura.
- **Cinza claro #F4F5F7:** áreas de conteúdo e leitura confortável.

## ⚙️ Tecnologias

| Tecnologia | Finalidade |
|---|---|
| [React](https://react.dev/) | Construção da interface |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem e segurança durante o desenvolvimento |
| [Vite](https://vite.dev/) | Servidor de desenvolvimento e build |
| [Lucide React](https://lucide.dev/) | Ícones da interface |
| CSS | Estilização responsiva e identidade visual |

## 💻 Executar localmente

### Requisitos

- Node.js 20 ou superior
- npm

### Instalação

~~~bash
# 1. Clone o repositório
git clone https://github.com/DevKove/Demutran.git

# 2. Acesse a pasta
cd Demutran

# 3. Instale as dependências
npm install

# 4. Inicie o ambiente de desenvolvimento
npm run dev
~~~

O Vite exibirá no terminal o endereço local para abrir a aplicação no navegador.

### Comandos disponíveis

~~~bash
npm run dev       # Ambiente de desenvolvimento
npm run build     # Build de produção e verificação TypeScript
npm run preview   # Pré-visualização do build
~~~

## 🗂️ Estrutura do projeto

~~~text
Demutran/
├── src/
│   ├── App.tsx        # Aplicação e navegação dos módulos
│   ├── main.tsx       # Ponto de entrada React
│   └── styles.css     # Estilos e identidade visual
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
~~~

## 🛣️ Próximas etapas

- [ ] Definir e integrar a camada de dados.
- [ ] Implementar autenticação e controle de permissões.
- [ ] Desenvolver cadastro, consulta, edição e exclusão nos módulos.
- [ ] Implementar filtros, pesquisa e relatórios.
- [ ] Adicionar validações, auditoria e tratamento de erros.
- [ ] Executar testes funcionais e validar o build de produção.

## 🔐 Segurança e qualidade

A implementação das funcionalidades deverá considerar validação de dados no servidor, controle de acesso por perfil/permissão, proteção de credenciais e registro de operações relevantes. A interface não deve ser considerada uma barreira de segurança: as regras de autorização precisam ser aplicadas também na camada de dados e no backend.

## 📌 Situação do projeto

O projeto está em fase inicial de desenvolvimento. Recursos descritos como módulos representam o escopo planejado; não significam que todas as operações já estejam implementadas ou conectadas a uma base persistente.

---

<div align="center">

**DEMUTRAN** · Gestão pública com organização e transparência.

<sub>Desenvolvido para apoiar a gestão municipal de trânsito.</sub>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:171717,100:F5C400&height=90&section=footer" width="100%" alt="" />

</div>
