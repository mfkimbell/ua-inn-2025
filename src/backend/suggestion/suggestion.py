from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.auth.database import get_db
from backend.auth.models import Suggestion, User
from backend.auth.user_manager import UserManager
from backend.database.database import create_record, read_from_db

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