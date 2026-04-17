from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps.auth import get_current_user
from app.db.session import get_db
from app.models.enums import TransactionType
from app.models.models import Budget, FinancialGoal, Transaction, User
from app.schemas.finance import BudgetCreate, BudgetOut, GoalCreate, GoalOut

router = APIRouter(prefix="/planning", tags=["Planning"])


@router.get("/goals", response_model=list[GoalOut])
def list_goals(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(FinancialGoal).filter(FinancialGoal.user_id == user.id).all()


@router.post("/goals", response_model=GoalOut)
def create_goal(payload: GoalCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    goal = FinancialGoal(**payload.model_dump(), user_id=user.id)
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


@router.get("/budgets", response_model=list[BudgetOut])
def list_budgets(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    budgets = db.query(Budget).filter(Budget.user_id == user.id).all()
    result = []
    for budget in budgets:
        used = (
            db.query(func.coalesce(func.sum(Transaction.amount), 0))
            .filter(
                Transaction.user_id == user.id,
                Transaction.category_id == budget.category_id,
                Transaction.type == TransactionType.EXPENSE,
                func.to_char(Transaction.date, "YYYY-MM") == budget.month,
            )
            .scalar()
        )
        result.append(
            BudgetOut(
                id=budget.id,
                month=budget.month,
                category_id=budget.category_id,
                limit_amount=float(budget.limit_amount),
                used_amount=float(used),
                exceeded=float(used) > float(budget.limit_amount),
            )
        )
    return result


@router.post("/budgets", response_model=BudgetOut)
def create_budget(payload: BudgetCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    budget = Budget(**payload.model_dump(), user_id=user.id)
    db.add(budget)
    db.commit()
    db.refresh(budget)
    return BudgetOut(id=budget.id, month=budget.month, category_id=budget.category_id, limit_amount=float(budget.limit_amount))
