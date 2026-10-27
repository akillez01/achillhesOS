# achillhesOS

Ecossistema unificado de produtividade pessoal com módulos de **Projetos (Dev-Centric)**, **Gestão de Tempo** e **Finanças Pessoais**.

## Estrutura entregue

- `apps/web`: frontend pronto em Next.js + Tailwind (dark mode + acentos verdes)
- `apps/api`: backend pronto em Node.js + Express com rotas iniciais v1
- `db/schema.sql`: modelagem relacional completa (Tempo -> Projeto -> Finanças)
- `docs/escopo-tecnico.md`: escopo técnico, arquitetura e roadmap MVP

## Rodando o frontend

```bash
cd apps/web
npm install
npm run dev
```

## Rodando o backend

```bash
cd apps/api
npm install
npm run dev
```

## Rotas iniciais

### Frontend (Next API routes)
- `GET /api/v1/projects`
- `GET /api/v1/tasks`
- `GET /api/v1/time`
- `GET /api/v1/finance`

### Backend (Express)
- `GET /health`
- `GET /api/v1/projects`
- `GET /api/v1/time/summary`
- `GET /api/v1/finance/summary`
