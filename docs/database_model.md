# Modelo de Banco de Dados

## users
- id (PK)
- email (único)
- full_name
- hashed_password
- created_at

## categories
- id (PK)
- name
- type (`income` | `expense`)
- color
- user_id (FK -> users)

## accounts
- id (PK)
- name
- type (`wallet` | `checking` | `savings` | `credit_card` | `other`)
- balance
- user_id (FK -> users)

## transactions
- id (PK)
- description
- amount
- date
- type (`income` | `expense`)
- payment_method
- status (`paid` | `pending` | `overdue`, apenas despesa)
- recurrent
- notes
- user_id (FK -> users)
- category_id (FK -> categories)
- account_id (FK -> accounts)
- created_at

## financial_goals
- id (PK)
- name
- target_amount
- current_amount
- due_date
- user_id (FK -> users)

## budgets
- id (PK)
- month (YYYY-MM)
- limit_amount
- user_id (FK -> users)
- category_id (FK -> categories)
