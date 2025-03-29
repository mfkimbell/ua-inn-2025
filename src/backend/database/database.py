from typing import Any

from sqlalchemy.orm import Session

from backend.auth.models import User


def read_from_db(db: Session, user: User, model: Any) -> Any:
    return db.query(model).filter(f"{user.role}.id == {model.user_id}").all()


def create_in_db(db: Session, model: Any, data: Any) -> Any:
    db_model = model(**data)
    db.add(db_model)
    db.commit()
    db.refresh(db_model)
