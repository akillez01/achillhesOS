import csv
import io
from datetime import date

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps.auth import get_current_user
from app.db.session import get_db
from app.models.enums import TransactionType
from app.models.models import Transaction, User

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/monthly-cashflow")
def monthly_cashflow(month: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rows = (
        db.query(Transaction.type, func.coalesce(func.sum(Transaction.amount), 0))
        .filter(Transaction.user_id == user.id, func.to_char(Transaction.date, "YYYY-MM") == month)
        .group_by(Transaction.type)
        .all()
    )
    result = {"month": month, "income": 0.0, "expense": 0.0}
    for tx_type, amount in rows:
        result["income" if tx_type == TransactionType.INCOME else "expense"] = float(amount)
    result["net"] = result["income"] - result["expense"]
    return result


@router.get("/by-category")
def by_category(month: str, tx_type: TransactionType, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rows = (
        db.query(Transaction.category_id, func.coalesce(func.sum(Transaction.amount), 0))
        .filter(
            Transaction.user_id == user.id,
            Transaction.type == tx_type,
            func.to_char(Transaction.date, "YYYY-MM") == month,
        )
        .group_by(Transaction.category_id)
        .all()
    )
    return [{"category_id": category_id, "total": float(total)} for category_id, total in rows]


@router.get("/month-over-month")
def month_over_month(months: int = 6, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rows = (
        db.query(func.to_char(Transaction.date, "YYYY-MM").label("month"), Transaction.type, func.coalesce(func.sum(Transaction.amount), 0))
        .filter(Transaction.user_id == user.id, Transaction.date >= date.today().replace(day=1))
        .group_by("month", Transaction.type)
        .order_by("month")
        .all()
    )
    grouped = {}
    for month, tx_type, total in rows:
        grouped.setdefault(month, {"month": month, "income": 0.0, "expense": 0.0})
        grouped[month]["income" if tx_type == TransactionType.INCOME else "expense"] = float(total)
    return list(grouped.values())[-months:]


@router.get("/export.csv")
def export_csv(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    transactions = db.query(Transaction).filter(Transaction.user_id == user.id).order_by(Transaction.date.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["descricao", "valor", "data", "tipo", "metodo", "status", "recorrente"]) 
    for tx in transactions:
        writer.writerow([tx.description, float(tx.amount), tx.date.isoformat(), tx.type.value, tx.payment_method, tx.status.value if tx.status else "", tx.recurrent])

    output.seek(0)
    return StreamingResponse(iter([output.getvalue()]), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=transacoes.csv"})
