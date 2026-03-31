# Escopo Técnico — Ecossistema Unificado de Produtividade Pessoal

## 1) Visão Geral
Plataforma fullstack para unificar **projetos de desenvolvimento**, **gestão de tempo** e **finanças pessoais** em uma única experiência. A arquitetura prioriza:

- rastreabilidade entre esforço e resultado financeiro;
- usabilidade (fluxos rápidos para operação diária);
- visual moderno com tema escuro e acentos verdes;
- evolução incremental por módulos.

## 2) Arquitetura Sugerida
- **Frontend:** Next.js (React + Tailwind CSS)
- **Backend:** Route Handlers/API do Next.js (ou migração futura para Node.js + Nest/Express)
- **Banco de dados:** PostgreSQL (modelo relacional)
- **ORM:** Prisma (opcional, recomendado)
- **Autenticação:** NextAuth/Auth.js (fase 2)

### Fluxo macro de dados
1. Usuário cria projeto e define `hourly_rate`.
2. Tarefas e sprints são organizadas no Kanban/Backlog.
3. Sessões Pomodoro e timesheets alimentam o log de tempo.
4. Módulo financeiro calcula custo real por projeto (tempo × custo/hora) e ROI.
5. Dashboard consolida produtividade + finanças + alertas.

## 3) Módulos Funcionais

### 3.1 Gestão de Projetos (Dev-Centric)
**Funcionalidades**
- Kanban por projeto (`todo`, `in_progress`, `review`, `done`)
- Backlog de sprints com prioridade por criticidade
- Integração com repositórios (simulada via webhooks/mock events)
- Campo `hourly_rate` por projeto

**KPIs**
- lead time por tarefa
- throughput por sprint
- custo estimado por sprint

### 3.2 Gestão de Tempo
**Funcionalidades**
- Pomodoro vinculado a tarefa
- Timesheet por sessão (manual + automático)
- Dashboard diário/semanal
- Burn-down chart por sprint

**KPIs**
- horas focadas/dia
- aderência ao plano da sprint
- taxa de interrupções

### 3.3 Finanças Pessoais
**Funcionalidades**
- fluxo de caixa (entradas/saídas)
- categorias de despesas e receitas
- metas de economia
- ROI por projeto
- alertas de orçamento por relação **tempo gasto vs. lucro esperado**

**KPIs**
- saldo mensal
- taxa de poupança
- ROI por projeto e consolidado

## 4) Requisitos Não Funcionais
- suporte dark mode nativo
- design system com cor principal verde (`#22C55E`)
- APIs REST versionadas (`/api/v1`)
- auditoria simples (`created_at`, `updated_at`)
- preparação para multiusuário (fase futura)

## 5) Estrutura Inicial de Pastas
```text
achillhesOS/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── components/
│   │   │   │   └── dashboard/
│   │   │   │       └── MainDashboard.tsx
│   │   │   ├── modules/
│   │   │   │   ├── projects/
│   │   │   │   ├── time/
│   │   │   │   └── finance/
│   │   │   └── lib/
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   └── api/
│       ├── src/
│       │   ├── routes/
│       │   │   └── v1/
│       │   │       ├── projects.routes.ts
│       │   │       ├── tasks.routes.ts
│       │   │       ├── time.routes.ts
│       │   │       └── finance.routes.ts
│       │   ├── services/
│       │   └── server.ts
│       └── package.json
├── db/
│   └── schema.sql
├── docs/
│   └── escopo-tecnico.md
└── README.md
```

## 6) Roadmap de Implementação (MVP)
1. **Semana 1**: modelagem SQL + APIs base de projetos/tarefas
2. **Semana 2**: Kanban + backlog + simulação de integração de repositório
3. **Semana 3**: Pomodoro + timesheet + burn-down
4. **Semana 4**: fluxo de caixa + metas + ROI + alertas
5. **Semana 5**: polish UI/UX + dark mode + testes básicos
