from datetime import date
from decimal import Decimal

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.enums import TransactionType
from app.models.models import Account, Transaction


def _to_float(value):
    if value is None:
        return 0.0
    if isinstance(value, Decimal):
        return float(value)
    return float(value)


def get_dashboard_data(db: Session, user_id: int):
    today = date.today()
    month_start = today.replace(day=1)

    balance = db.query(func.coalesce(func.sum(Account.balance), 0)).filter(Account.user_id == user_id).scalar()

    income = (
        db.query(func.coalesce(func.sum(Transaction.amount), 0))
        .filter(
            Transaction.user_id == user_id,
            Transaction.type == TransactionType.INCOME,
            Transaction.date >= month_start,
            Transaction.date <= today,
        )
        .scalar()
    )
    expense = (
        db.query(func.coalesce(func.sum(Transaction.amount), 0))
        .filter(
            Transaction.user_id == user_id,
            Transaction.type == TransactionType.EXPENSE,
            Transaction.date >= month_start,
            Transaction.date <= today,
        )
        .scalar()
    )

    latest = (
        db.query(Transaction)
        .filter(Transaction.user_id == user_id)
        .order_by(Transaction.date.desc(), Transaction.id.desc())
        .limit(8)
        .all()
    )

    rows = (
        db.query(Transaction.date, Transaction.type, func.coalesce(func.sum(Transaction.amount), 0))
        .filter(Transaction.user_id == user_id, Transaction.date >= month_start)
        .group_by(Transaction.date, Transaction.type)
        .order_by(Transaction.date)
        .all()
    )
    by_date = {}
    for tx_date, tx_type, amount in rows:
        key = tx_date.isoformat()
        if key not in by_date:
            by_date[key] = {"date": key, "income": 0.0, "expense": 0.0}
        by_date[key]["income" if tx_type == TransactionType.INCOME else "expense"] = _to_float(amount)

    return {
        "current_balance": _to_float(balance),
        "income_month": _to_float(income),
        "expense_month": _to_float(expense),
        "expected_balance": _to_float(balance) + _to_float(income) - _to_float(expense),
        "latest_transactions": latest,
        "cashflow_chart": list(by_date.values()),
    }
