from datetime import datetime
from typing import final

from pydantic import BaseModel
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

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
    user_name = Column(String)  # Regular column, not foreign key
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now)
    completed_at = Column(DateTime)
    comments = Column(String)
    cost = Column(Float)

    user = relationship("User", backref="orders")  # Relationship to User


@final
class Suggestion(Base):
    __tablename__ = "suggestion"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    user_name = Column(String)  # Regular column, not foreign key
    suggestion = Column(String)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now)
    completed_at = Column(DateTime)
    comments = Column(String)
    is_anonymous = Column(Boolean, default=False)

    user = relationship("User", backref="suggestions")  # Relationship to User


@final
class Request(Base):
    __tablename__ = "request"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    request = Column(String)
    request_type = Column(String, default="supply")  # maintenance | supply
    status = Column(String, default="pending")
    order_id = Column(Integer, ForeignKey("order.id"))
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now)
    comments = Column(String)
    is_anonymous = Column(Boolean, default=False)
    admin = Column(Integer, ForeignKey("user.id"))
    cost = Column(Float)
    requested_amount = Column(Integer)
    ordered_amount = Column(Integer)
    item_name = Column(String)
    completed_at = Column(DateTime)
    user_name = Column(String)

    # Specify the foreign key for user_id relationship
    user = relationship("User", backref="requests", foreign_keys=[user_id])

    # Specify the foreign key for admin relationship
    admin_user = relationship("User", backref="admin_requests", foreign_keys=[admin])


@final
class Product(Base):
    __tablename__ = "product"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    category = Column(String)
    price = Column(Float)
    stock = Column(Integer)
    thumbnail = Column(String)


Base.metadata.create_all(bind=engine)
