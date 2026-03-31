-- PostgreSQL schema for achillhesOS unified productivity ecosystem

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  hourly_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  expected_revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
  criticality SMALLINT NOT NULL DEFAULT 3 CHECK (criticality BETWEEN 1 AND 5),
  repository_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  goal TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (end_date >= start_date)
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES sprints(id) ON DELETE SET NULL,
  title VARCHAR(180) NOT NULL,
  description TEXT,
  kanban_status VARCHAR(20) NOT NULL DEFAULT 'todo' CHECK (kanban_status IN ('todo', 'in_progress', 'review', 'done')),
  priority SMALLINT NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  story_points SMALLINT DEFAULT 0,
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pomodoro_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  duration_minutes INTEGER NOT NULL,
  interrupted BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE timesheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  work_date DATE NOT NULL,
  minutes_worked INTEGER NOT NULL CHECK (minutes_worked > 0),
  source VARCHAR(20) NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'pomodoro', 'import')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE finance_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(80) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  color VARCHAR(7) DEFAULT '#22C55E',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, name, type)
);

CREATE TABLE cashflow_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  category_id UUID REFERENCES finance_categories(id) ON DELETE SET NULL,
  kind VARCHAR(10) NOT NULL CHECK (kind IN ('income', 'expense')),
  amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  description TEXT,
  occurred_at DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE savings_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  target_amount NUMERIC(12,2) NOT NULL CHECK (target_amount > 0),
  current_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE budget_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  threshold_percent NUMERIC(5,2) NOT NULL DEFAULT 80,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE VIEW project_financial_summary AS
SELECT
  p.id AS project_id,
  p.name,
  p.hourly_rate,
  p.expected_revenue,
  COALESCE(SUM(t.minutes_worked), 0) AS total_minutes,
  ROUND((COALESCE(SUM(t.minutes_worked), 0) / 60.0) * p.hourly_rate, 2) AS estimated_cost,
  COALESCE(SUM(CASE WHEN c.kind = 'income' THEN c.amount ELSE 0 END), 0) AS total_income,
  COALESCE(SUM(CASE WHEN c.kind = 'expense' THEN c.amount ELSE 0 END), 0) AS total_expense,
  ROUND(
    COALESCE(SUM(CASE WHEN c.kind = 'income' THEN c.amount ELSE 0 END), 0)
    - (COALESCE(SUM(CASE WHEN c.kind = 'expense' THEN c.amount ELSE 0 END), 0)
      + ((COALESCE(SUM(t.minutes_worked), 0) / 60.0) * p.hourly_rate))
  , 2) AS net_result,
  CASE
    WHEN p.expected_revenue = 0 THEN NULL
    ELSE ROUND(
      ((COALESCE(SUM(CASE WHEN c.kind = 'income' THEN c.amount ELSE 0 END), 0) - ((COALESCE(SUM(t.minutes_worked), 0) / 60.0) * p.hourly_rate))
      / p.expected_revenue) * 100
    , 2)
  END AS roi_percent
FROM projects p
LEFT JOIN timesheets t ON t.project_id = p.id
LEFT JOIN cashflow_entries c ON c.project_id = p.id
GROUP BY p.id;

CREATE INDEX idx_tasks_project_status ON tasks(project_id, kanban_status);
CREATE INDEX idx_timesheets_project_date ON timesheets(project_id, work_date);
CREATE INDEX idx_cashflow_user_date ON cashflow_entries(user_id, occurred_at);
