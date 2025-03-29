from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.auth.database import get_db
from backend.auth.models import Request as DatabaseRequest
from backend.auth.models import User
from backend.auth.user_manager import UserManager
from backend.database.database import create_record, read_from_db, update_record

router = APIRouter()


@router.get("/request")
async def get_request(
    user: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    return read_from_db(db, user, DatabaseRequest)


@router.post("/request")
async def create_request(
    request: DatabaseRequest,
    user: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    request.user_id = user.id  # pyright: ignore[reportAttributeAccessIssue]

    return create_record(db, DatabaseRequest, request.model_dump())


@router.put("/request")
async def update_request(
    request: DatabaseRequest,
    _: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    db_request = (
        db.query(DatabaseRequest).filter(DatabaseRequest.id == request.id).first()
    )

    if not db_request:
        raise HTTPException(status_code=404, detail="Request not found")

    return update_record(db, DatabaseRequest, request.model_dump())
