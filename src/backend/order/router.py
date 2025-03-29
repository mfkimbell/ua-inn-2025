from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.auth.database import get_db
from backend.auth.models import Order, User
from backend.auth.user_manager import UserManager
from backend.database.database import create_record, read_from_db

router = APIRouter()


@router.get("/order")
async def get_order(
    user: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    return read_from_db(db, user, Order)


@router.post("/order")
async def create_order(
    order: Order,
    user: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    order.user_id = user.id  # pyright: ignore[reportAttributeAccessIssue]

    return create_record(db, Order, order.model_dump())
