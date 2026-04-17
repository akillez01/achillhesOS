# Achillhes Finance OS

Sistema web completo de gestão financeira pessoal com arquitetura separada entre backend e frontend.

## Stack

- **Backend:** FastAPI + SQLAlchemy
- **Frontend:** Next.js (App Router) + TypeScript
- **UI:** Tailwind CSS + componentes estilo shadcn/ui
- **Banco:** PostgreSQL
- **Auth:** JWT com email/senha
- **Infra:** Docker Compose

## Estrutura

```bash
.
├── backend
│   ├── app
│   │   ├── api/routes
│   │   ├── core
│   │   ├── db
│   │   ├── models
│   │   ├── schemas
│   │   └── services
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
├── frontend
│   ├── app
│   ├── components
│   ├── lib
│   ├── Dockerfile
│   └── .env.example
└── docker-compose.yml
```

## Como rodar localmente

1. Copie variáveis de ambiente:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2. Suba os containers:

```bash
docker compose up --build
```

3. Acessos:

- Frontend: http://localhost:3000
- Backend (Swagger): http://localhost:8000/docs
- Healthcheck: http://localhost:8000/health

## Usuário seed

- **Email:** `demo@achillhes.local`
- **Senha:** `123456`

## Principais funcionalidades implementadas

- Dashboard com saldo atual, receitas, despesas, saldo previsto e gráfico.
- Cadastro de receitas e despesas com filtros básicos.
- CRUD de categorias personalizadas.
- Gestão de contas e transferência entre contas.
- Relatórios: fluxo mensal, por categoria e exportação CSV.
- Planejamento com metas financeiras e orçamento por categoria.
- Estrutura inicial para calendário financeiro e notificações.
- Base pronta para evolução (multiusuário futuro, recorrência avançada e importador CSV).

## Modelo de banco (resumo)

- `users`
- `categories`
- `accounts`
- `transactions`
- `financial_goals`
- `budgets`

Veja também: `docs/database_model.md` e `docs/api_routes.md`.
