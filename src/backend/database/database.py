from typing import Any

from sqlalchemy.orm import Session

from backend.auth.models import User


def read_from_db(db: Session, user: User, model: Any, sort: bool = False) -> Any:
    if sort:
        return (
            db.query(model)
            .filter(model.user_id == user.id)
            .order_by(model.created_at.desc())
            .all()
        )
    return db.query(model).filter(model.user_id == user.id).all()


def read_all_from_db(db: Session, model: Any, sort: bool = False) -> Any:
    if sort:
        return db.query(model).order_by(model.created_at.desc()).all()
    return db.query(model).all()


def create_record(db: Session, model: Any, data: Any) -> Any:
    db_model = model(**data)
    db.add(db_model)
    db.commit()
    db.refresh(db_model)
    return db_model


def update_record(db: Session, model: Any, data: Any) -> Any:
    db_model = db.query(model).filter(model.id == data["id"]).first()

    if db_model:
        for key, value in data.items():
            setattr(db_model, key, value)

        db.commit()
        db.refresh(db_model)

    return db_model


def delete_record(db: Session, model: Any, id: int) -> Any:
    db_model = db.query(model).filter(model.id == id).first()

    if db_model:
        db.delete(db_model)
        db.commit()

    return True


def create_in_db(db: Session, model: Any, data: Any) -> Any:
    db_model = model(**data)
    db.add(db_model)
    db.commit()
    db.refresh(db_model)
