# Rotas da API (prefixo `/api/v1`)

## Auth
- `POST /auth/register`
- `POST /auth/login`

## Dashboard
- `GET /dashboard`

## Categorias
- `GET /categories`
- `POST /categories`
- `PUT /categories/{category_id}`
- `DELETE /categories/{category_id}`

## Contas
- `GET /accounts`
- `POST /accounts`
- `POST /accounts/transfer`

## Transações
- `GET /transactions` (filtros por período, categoria, conta, tipo, status e texto)
- `POST /transactions`

## Relatórios
- `GET /reports/monthly-cashflow`
- `GET /reports/by-category`
- `GET /reports/month-over-month`
- `GET /reports/export.csv`

## Planejamento
- `GET /planning/goals`
- `POST /planning/goals`
- `GET /planning/budgets`
- `POST /planning/budgets`
