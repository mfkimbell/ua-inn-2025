from datetime import datetime
from typing import final

from pydantic import BaseModel
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String

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
    first_name = Column(String)
    last_name = Column(String)
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
    user_name = Column(String, ForeignKey("user.first_name"))
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now)
    completed_at = Column(DateTime)
    comments = Column(String)
    cost = Column(Float)


@final
class Suggestion(Base):
    __tablename__ = "suggestion"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    user_name = Column(String, ForeignKey("user.first_name"))
    suggestion = Column(String)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now)
    completed_at = Column(DateTime)
    comments = Column(String)
    is_anonymous = Column(Boolean, default=False)


@final
class Request(Base):
    __tablename__ = "request"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    user_name = Column(String, ForeignKey("user.first_name"))
    request = Column(String)
    request_type = Column(String, default="supply")  # maintenance | supply
    status = Column(String, default="pending")
    order_id = Column(Integer, ForeignKey("order.id"))
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now)
    comments = Column(String)
    is_anonymous = Column(Boolean, default=False)
    admin = Column(Integer, ForeignKey("user.id"))
    admin_name = Column(String, ForeignKey("user.first_name"))
    cost = Column(Float)


Base.metadata.create_all(bind=engine)
