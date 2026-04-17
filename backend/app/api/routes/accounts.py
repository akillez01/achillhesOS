from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps.auth import get_current_user
from app.db.session import get_db
from app.models.models import Account, User
from app.schemas.finance import AccountCreate, AccountOut

router = APIRouter(prefix="/accounts", tags=["Accounts"])


@router.get("", response_model=list[AccountOut])
def list_accounts(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Account).filter(Account.user_id == user.id).order_by(Account.name).all()


@router.post("", response_model=AccountOut)
def create_account(payload: AccountCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    account = Account(**payload.model_dump(), user_id=user.id)
    db.add(account)
    db.commit()
    db.refresh(account)
    return account


@router.post("/transfer")
def transfer_between_accounts(from_account_id: int, to_account_id: int, amount: float, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    source = db.query(Account).filter(Account.id == from_account_id, Account.user_id == user.id).first()
    target = db.query(Account).filter(Account.id == to_account_id, Account.user_id == user.id).first()
    if not source or not target:
        raise HTTPException(status_code=404, detail="Conta não encontrada")
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Valor inválido")
    if float(source.balance) < amount:
        raise HTTPException(status_code=400, detail="Saldo insuficiente")

    source.balance = float(source.balance) - amount
    target.balance = float(target.balance) + amount
    db.commit()
    return {"message": "Transferência realizada"}
