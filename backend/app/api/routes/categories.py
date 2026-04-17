from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps.auth import get_current_user
from app.db.session import get_db
from app.models.models import Category, User
from app.schemas.finance import CategoryCreate, CategoryOut

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Category).filter(Category.user_id == user.id).order_by(Category.name).all()


@router.post("", response_model=CategoryOut)
def create_category(payload: CategoryCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    category = Category(**payload.model_dump(), user_id=user.id)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.put("/{category_id}", response_model=CategoryOut)
def update_category(category_id: int, payload: CategoryCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    category = db.query(Category).filter(Category.id == category_id, Category.user_id == user.id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    for k, v in payload.model_dump().items():
        setattr(category, k, v)
    db.commit()
    db.refresh(category)
    return category


@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    category = db.query(Category).filter(Category.id == category_id, Category.user_id == user.id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    db.delete(category)
    db.commit()
    return {"message": "Categoria removida"}
