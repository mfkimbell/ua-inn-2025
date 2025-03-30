import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.auth.database import get_db
from backend.auth.models import Suggestion, User
from backend.auth.user_manager import UserManager
from backend.database.database import (
    create_record,
    delete_record,
    read_all_from_db,
    read_from_db,
    update_record,
)

router = APIRouter()


class SuggestionRequest(BaseModel):
    id: int | None = None
    user_id: int | None = None
    user_name: str | None = None
    suggestion: str | None = None
    created_at: datetime.datetime | None = None
    updated_at: datetime.datetime | None = None
    completed_at: datetime.datetime | None = None
    comments: str | None = None


@router.get("/suggestion")
async def get_suggestion(
    user: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    return read_from_db(db, user, Suggestion)


@router.get("/suggestion/all")
async def get_all_suggestions(
    _: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    return read_all_from_db(db, Suggestion, sort=True)


@router.post("/suggestion")
async def create_suggestion(
    suggestion: SuggestionRequest,
    user: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    suggestion.user_id = user.id
    suggestion.user_name = user.username

    return create_record(db, Suggestion, suggestion.model_dump())


@router.put("/suggestion")
async def update_suggestion(
    suggestion: SuggestionRequest,
    _: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    db_suggestion = db.query(Suggestion).filter(Suggestion.id == suggestion.id).first()

    if not db_suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")

    return update_record(db, Suggestion, suggestion.model_dump())


class DeleteSuggestionRequest(BaseModel):
    suggestion_id: int


@router.post("/suggestion/delete")
async def delete_suggestion(
    request: DeleteSuggestionRequest,
    _: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    db_suggestion = (
        db.query(Suggestion).filter(Suggestion.id == request.suggestion_id).first()
    )

    if not db_suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")

    return delete_record(db, Suggestion, db_suggestion.id)
