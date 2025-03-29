from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.auth.database import get_db
from backend.auth.models import Suggestion, User
from backend.auth.user_manager import UserManager
from backend.database.database import (
    create_record,
    delete_record,
    read_from_db,
    update_record,
)

router = APIRouter()


@router.get("/suggestion")
async def get_suggestion(
    user: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    return read_from_db(db, user, Suggestion)


@router.post("/suggestion")
async def create_suggestion(
    suggestion: Suggestion,
    user: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    suggestion.user_id = user.id  # pyright: ignore[reportAttributeAccessIssue]

    return create_record(db, Suggestion, suggestion.model_dump())


@router.put("/suggestion")
async def update_suggestion(
    suggestion: Suggestion,
    user: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    db_suggestion = db.query(Suggestion).filter(Suggestion.id == suggestion.id).first()

    if not db_suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")

    db_suggestion.user_id = user.id  # pyright: ignore[reportAttributeAccessIssue]

    return update_record(db, Suggestion, suggestion.model_dump())


@router.delete("/suggestion")
async def delete_suggestion(
    suggestion_id: int,
    _: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    db_suggestion = (
        db.query(Suggestion).filter(Suggestion.id == suggestion_id).first()
    )

    if not db_suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")

    return delete_record(db, Suggestion, db_suggestion.id)
