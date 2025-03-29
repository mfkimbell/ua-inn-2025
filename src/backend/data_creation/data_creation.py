import hashlib
import json
import os
from random import choice, randint

from faker import Faker
from sqlalchemy.orm import Session

from backend.auth.models import Order, Product, Request, Suggestion, User

fake = Faker()


def insert_test_data(db: Session):
    for file in os.listdir("data"):
        with open(os.path.join("data", file), "r") as f:
            print(f"Inserting data from {file}")
            try:
                data = json.load(f)

                for product in data["products"]:
                    db.add(
                        Product(
                            id=product["id"],
                            title=product["title"],
                            description=product["description"],
                            category=product["category"],
                            price=product["price"],
                            stock=product["stock"],
                            thumbnail=product["thumbnail"],
                        )
                    )

                db.commit()
            except json.JSONDecodeError:
                print(f"Error decoding JSON from {file}")
                continue


def create_test_users(db: Session) -> None:
    if not db.query(User).filter(User.username == "admin").first():
        admin_user = User(
            id=997,
            username="admin",
            email="admin@cgi.com",
            hashed_password=hashlib.sha256("admin".encode()).hexdigest(),
            credits=randint(0, 100),
            role="admin",
        )
        db.add(admin_user)

    if not db.query(User).filter(User.username == "hr").first():
        hr_user = User(
            id=998,
            username="hr",
            email="hr@cgi.com",
            hashed_password=hashlib.sha256("hr".encode()).hexdigest(),
            credits=randint(0, 100),
            role="hr",
        )
        db.add(hr_user)

    if not db.query(User).filter(User.username == "employee").first():
        employee_user = User(
            id=999,
            username="employee",
            email="employee@cgi.com",
            hashed_password=hashlib.sha256("employee".encode()).hexdigest(),
            credits=randint(0, 100),
            role="employee",
        )
        db.add(employee_user)

    db.commit()


def create_fake_data(db: Session, num_records: int = 10) -> None:
    """
    Generate fake data for Order, Suggestion, and Request models.

    Args:
        db (Session): SQLAlchemy database session
        num_records (int): Number of records to generate for each model
    """
    # First, get or create some users to associate with the records
    users = db.query(User).all()

    if not users:
        # Create some fake users if none exist
        users = []
        for _ in range(3):
            user = User(
                username=fake.user_name(),
                email=fake.email(),
                hashed_password="fake_hashed_password",
                credits=randint(0, 100),
                role=choice(["employee", "admin"]),
            )
            db.add(user)
            users.append(user)
        db.commit()

    # Create fake orders
    orders = db.query(Order).all()
    if not orders:
        for _ in range(num_records):
            order = Order(
                user_id=choice(users).id,
                status=choice(["pending", "processing", "completed", "cancelled"]),
                created_at=fake.date_time_between(start_date="-1y"),
                user_name=choice(users).username,
                cost=randint(0, 100),
            )
            order.updated_at = fake.date_time_between(start_date=order.created_at)
            if order.status == "completed":
                order.completed_at = fake.date_time_between(start_date=order.updated_at)
            db.add(order)
            orders.append(order)
        db.commit()

    suggestions = db.query(Suggestion).all()
    if not suggestions:
        for _ in range(num_records):
            suggestion = Suggestion(
                user_id=choice(users).id,
                suggestion=fake.text(max_nb_chars=200),
                created_at=fake.date_time_between(start_date="-1y"),
                user_name=choice(users).username,
            )
            suggestion.updated_at = fake.date_time_between(
                start_date=suggestion.created_at
            )
            if randint(0, 1):  # 50% chance of being completed
                suggestion.completed_at = fake.date_time_between(
                    start_date=suggestion.updated_at
                )
            db.add(suggestion)
        db.commit()

    # Create fake requests
    requests = db.query(Request).all()
    if not requests:
        for _ in range(num_records):
            request = Request(
                user_id=999,
                request=fake.text(max_nb_chars=20),
                order_id=choice(orders).id,
                created_at=fake.date_time_between(start_date="-1y"),
                user_name=choice(users).username,
                request_type=choice(["maintenance", "supply"]),
                status=choice(["pending", "approved", "denied", "delivered"]),
            )
            request.updated_at = fake.date_time_between(start_date=request.created_at)
            db.add(request)
        db.commit()
