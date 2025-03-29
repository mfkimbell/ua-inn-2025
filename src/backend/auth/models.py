from datetime import datetime
from typing import final

from pydantic import BaseModel
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String

from backend.auth.database import Base, engine


class BaseUser(BaseModel):
    username: str
    password: str


# Auth Models


@final
class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True, unique=True, autoincrement=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    credits = Column(Integer, default=1)
    api_key_id = Column(Integer, ForeignKey("api_key.id"))
    role = Column(String, default="employee")


@final
class APIKey(Base):
    __tablename__ = "api_key"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    api_key = Column(String)


@final
class Blacklist(Base):
    __tablename__ = "blacklist"
    id = Column(Integer, primary_key=True, index=True)
    jti = Column(String, unique=True, index=True)
    expires_at = Column(DateTime, index=True)


# Website Models


@final
class Order(Base):
    __tablename__ = "order"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now)
    completed_at = Column(DateTime)
    comments = Column(String)   


@final
class Suggestion(Base):
    __tablename__ = "suggestion"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    suggestion = Column(String)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now)
    completed_at = Column(DateTime)
    comments = Column(String)

@final
class Request(Base):
    __tablename__ = "request"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    request = Column(String)
    order_id = Column(Integer, ForeignKey("order.id"))
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now)
    comments = Column(String)


Base.metadata.create_all(bind=engine)
