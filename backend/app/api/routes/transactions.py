from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_
from sqlalchemy.orm import Session, joinedload

from app.api.deps.auth import get_current_user
from app.db.session import get_db
from app.models.enums import TransactionType
from app.models.models import Account, Budget, Transaction, User
from app.schemas.finance import TransactionCreate, TransactionOut

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.get("", response_model=list[TransactionOut])
def list_transactions(
    start_date: date | None = None,
    end_date: date | None = None,
    category_id: int | None = None,
    account_id: int | None = None,
    tx_type: TransactionType | None = Query(default=None, alias="type"),
    status: str | None = None,
    q: str | None = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    filters = [Transaction.user_id == user.id]
    if start_date:
        filters.append(Transaction.date >= start_date)
    if end_date:
        filters.append(Transaction.date <= end_date)
    if category_id:
        filters.append(Transaction.category_id == category_id)
    if account_id:
        filters.append(Transaction.account_id == account_id)
    if tx_type:
        filters.append(Transaction.type == tx_type)
    if status:
        filters.append(Transaction.status == status)
    if q:
        filters.append(Transaction.description.ilike(f"%{q}%"))

    return (
        db.query(Transaction)
        .options(joinedload(Transaction.account), joinedload(Transaction.category))
        .filter(and_(*filters))
        .order_by(Transaction.date.desc(), Transaction.id.desc())
        .all()
    )


@router.post("", response_model=TransactionOut)
def create_transaction(payload: TransactionCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    account = db.query(Account).filter(Account.id == payload.account_id, Account.user_id == user.id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Conta não encontrada")

    tx = Transaction(**payload.model_dump(), user_id=user.id)
    db.add(tx)

    if payload.type == TransactionType.INCOME:
        account.balance = float(account.balance) + payload.amount
    else:
        account.balance = float(account.balance) - payload.amount

    budget = (
        db.query(Budget)
        .filter(Budget.user_id == user.id, Budget.category_id == payload.category_id, Budget.month == payload.date.strftime("%Y-%m"))
        .first()
    )

    db.commit()
    db.refresh(tx)
    if budget:
        return tx
    return tx
