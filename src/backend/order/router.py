import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.auth.database import get_db
from backend.auth.models import Order, User
from backend.auth.user_manager import UserManager
from backend.database.database import (
    create_record,
    delete_record,
    read_all_from_db,
    read_from_db,
    update_record,
)

router = APIRouter()


class OrderRequest(BaseModel):
    id: int | None = None
    user_id: int | None = None
    user_name: str | None = None
    status: str | None = None
    created_at: datetime.datetime | None = None
    updated_at: datetime.datetime | None = None
    completed_at: datetime.datetime | None = None
    comments: str | None = None


@router.get("/order")
async def get_order(
    user: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    return read_from_db(db, user, Order)


@router.get("/order/all")
async def get_all_orders(
    _: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    return read_all_from_db(db, Order)


@router.post("/order")
async def create_order(
    order: OrderRequest,
    user: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    order.user_id = user.id

    create_record(db, Order, order.model_dump())
    return 200


@router.put("/order")
async def update_order(
    order: OrderRequest,
    _: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    db_order = db.query(Order).filter(Order.id == order.id).first()

    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    return update_record(db, Order, db_order.model_dump())


@router.delete("/order")
async def delete_order(
    order_id: int,
    _: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    db_order = db.query(Order).filter(Order.id == order_id).first()

    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    return delete_record(db, Order, db_order.id)
