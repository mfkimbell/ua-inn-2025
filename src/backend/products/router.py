from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.auth.database import get_db
from backend.auth.models import Product, User
from backend.auth.user_manager import UserManager
from backend.database.database import (
    create_record,
    delete_record,
    read_all_from_db,
    read_from_db,
    update_record,
)

router = APIRouter()


class ProductRequest(BaseModel):
    id: int | None = None
    title: str | None = None
    description: str | None = None
    category: str | None = None
    price: float | None = None
    stock: int | None = None
    thumbnail: str | None = None


@router.get("/product")
async def get_product(
    product_id: int,
    _: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    return read_from_db(db, Product, product_id)

@router.get("/product/all")
async def get_all_products(
    _: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    return read_all_from_db(db, Product)


@router.post("/product")
async def create_product(
    product: ProductRequest,
    _: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):

    return create_record(db, Product, product.model_dump())


@router.put("/product")
async def update_product(
    product: ProductRequest,
    _: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    db_product = db.query(Product).filter(Product.id == product.id).first()

    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    return update_record(db, Product, product.model_dump())


class DeleteProductRequest(BaseModel):
    product_id: int


@router.post("/product/delete")
async def delete_product(
    product: DeleteProductRequest,
    _: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    db_product = db.query(Product).filter(Product.id == product.product_id).first()

    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    return delete_record(db, Product, db_product.id)
