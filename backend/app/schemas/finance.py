from datetime import date

from pydantic import BaseModel, Field

from app.models.enums import AccountType, ExpenseStatus, TransactionType


class CategoryBase(BaseModel):
    name: str
    type: TransactionType
    color: str = "#3b82f6"


class CategoryCreate(CategoryBase):
    pass


class CategoryOut(CategoryBase):
    id: int

    class Config:
        from_attributes = True


class AccountBase(BaseModel):
    name: str
    type: AccountType
    balance: float = 0


class AccountCreate(AccountBase):
    pass


class AccountOut(AccountBase):
    id: int

    class Config:
        from_attributes = True


class TransactionBase(BaseModel):
    description: str
    amount: float = Field(gt=0)
    date: date
    type: TransactionType
    category_id: int
    account_id: int
    payment_method: str
    status: ExpenseStatus | None = None
    recurrent: bool = False
    notes: str | None = None


class TransactionCreate(TransactionBase):
    pass


class TransactionOut(TransactionBase):
    id: int

    class Config:
        from_attributes = True


class GoalBase(BaseModel):
    name: str
    target_amount: float = Field(gt=0)
    current_amount: float = 0
    due_date: date | None = None


class GoalCreate(GoalBase):
    pass


class GoalOut(GoalBase):
    id: int

    class Config:
        from_attributes = True


class BudgetBase(BaseModel):
    month: str
    category_id: int
    limit_amount: float = Field(gt=0)


class BudgetCreate(BudgetBase):
    pass


class BudgetOut(BudgetBase):
    id: int
    used_amount: float = 0
    exceeded: bool = False


class DashboardResponse(BaseModel):
    current_balance: float
    income_month: float
    expense_month: float
    expected_balance: float
    latest_transactions: list[TransactionOut]
    cashflow_chart: list[dict]
