import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.auth.database import get_db
from backend.auth.models import Product
from backend.auth.models import Request as DatabaseRequest
from backend.auth.models import User
from backend.auth.user_manager import UserManager
from backend.database.database import (
    create_record,
    delete_record,
    read_all_from_db,
    read_from_db,
    update_record,
)

router = APIRouter()


class RequestRequest(BaseModel):
    id: int | None = None
    user_id: int | None = None
    user_name: str | None = None
    request: str | None = None
    created_at: datetime.datetime | None = None
    updated_at: datetime.datetime | None = None
    comments: str | None = None
    status: str | None = None
    request_type: str | None = None
    admin: int | None = None
    admin_name: str | None = None
    cost: float | None = None
    requested_amount: int | None = None
    ordered_amount: int | None = None
    item_name: str | None = None


@router.get("/request")
async def get_request(
    user: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    return read_from_db(db, user, DatabaseRequest, sort=True)


@router.get("/request/all")
async def get_all_requests(
    _: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    return read_all_from_db(db, DatabaseRequest, sort=True)


@router.post("/request")
async def create_request(
    request: RequestRequest,
    user: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    request.user_id = user.id

    return create_record(db, DatabaseRequest, request.model_dump())


class UpdateRequestRequest(RequestRequest):
    product_name: str | None = None
    amount: int | None = None


@router.put("/request")
async def update_request(
    request: UpdateRequestRequest,
    _: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    db_request = (
        db.query(DatabaseRequest).filter(DatabaseRequest.id == request.id).first()
    )

    if not db_request:
        raise HTTPException(status_code=404, detail="Request not found")

    if request.status == "delivered" and request.item_name and request.amount:
        product = db.query(Product).filter(Product.title == request.item_name).first()

        if product:
            product.stock += (  # pyright: ignore[reportAttributeAccessIsssue]
                request.amount
            )
        else:
            raise HTTPException(status_code=404, detail="Product not found")

        db.commit()
        db.refresh(product)

    return update_record(db, DatabaseRequest, request.model_dump())


class DeleteRequestRequest(BaseModel):
    request_id: int


@router.post("/request/delete")
async def delete_request(
    request: DeleteRequestRequest,
    _: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    db_request = (
        db.query(DatabaseRequest)
        .filter(DatabaseRequest.id == request.request_id)
        .first()
    )

    if not db_request:
        raise HTTPException(status_code=404, detail="Request not found")

    return delete_record(db, DatabaseRequest, db_request.id)
