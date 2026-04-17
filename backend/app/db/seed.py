from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.enums import AccountType, TransactionType
from app.models.models import Account, Category, User

DEFAULT_INCOME_CATEGORIES = ["Salário", "Freelas", "Investimentos"]
DEFAULT_EXPENSE_CATEGORIES = ["Alimentação", "Transporte", "Moradia", "Lazer"]


def seed_defaults(db: Session):
    user = db.query(User).filter(User.email == "demo@achillhes.local").first()
    if user:
        return

    user = User(email="demo@achillhes.local", full_name="Usuário Demo", hashed_password=get_password_hash("123456"))
    db.add(user)
    db.flush()

    for name in DEFAULT_INCOME_CATEGORIES:
        db.add(Category(name=name, type=TransactionType.INCOME, user_id=user.id, color="#10b981"))

    for name in DEFAULT_EXPENSE_CATEGORIES:
        db.add(Category(name=name, type=TransactionType.EXPENSE, user_id=user.id, color="#ef4444"))

    db.add(Account(name="Carteira", type=AccountType.WALLET, balance=500, user_id=user.id))
    db.add(Account(name="Conta Corrente", type=AccountType.CHECKING, balance=1500, user_id=user.id))
    db.commit()
