from typing import Any

from sqlalchemy.orm import Session

from backend.auth.models import User


def read_from_db(db: Session, user: User, model: Any) -> Any:
    return db.query(model).filter(f"{user.role}.id == {model.user_id}").all()


def read_all_from_db(db: Session, model: Any) -> Any:
    return db.query(model).all()


def create_record(db: Session, model: Any, data: Any) -> Any:
    db_model = model(**data)
    db.add(db_model)
    db.commit()
    db.refresh(db_model)
    return 200


def update_record(db: Session, model: Any, data: Any) -> Any:
    db_model = db.query(model).filter(f"{model.user_id} == {data.user_id}").first()

    if db_model:
        db_model.update(data)
        db.commit()
        db.refresh(db_model)

    return db_model


def delete_record(db: Session, model: Any, id: int) -> Any:
    db_model = db.query(model).filter(f"{model.id} == {id}").first()

    if db_model:
        db.delete(db_model)
        db.commit()


def create_in_db(db: Session, model: Any, data: Any) -> Any:
    db_model = model(**data)
    db.add(db_model)
    db.commit()
    db.refresh(db_model)
