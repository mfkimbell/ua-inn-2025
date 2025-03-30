import hashlib
import json
import os
from random import choice, randint

from faker import Faker
from sqlalchemy.orm import Session

from backend.auth.models import Product, Request, Suggestion, User

fake = Faker()

# Predefined realistic office texts
OFFICE_SUPPLY_REQUESTS = [
    "Order new printer paper",
    "Restock office pens and pencils",
    "Purchase notepads",
    "Buy whiteboard markers",
    "Replenish staplers and staples",
    "Order adhesive tape rolls",
    "Get envelopes for mailings",
    "Restock printer ink",
]

MAINTENANCE_REQUESTS = [
    "Repair broken office chair",
    "Fix the air conditioning unit",
    "Service the office printer",
    "Replace flickering lights",
    "Repair the conference room projector",
    "Fix the door lock in reception",
    "Service the copier machine",
    "Repair noise from the air conditioner",
]

OFFICE_SUGGESTIONS = [
    "Upgrade the coffee machine",
    "Install standing desks in the office",
    "Improve break room facilities",
    "Introduce flexible work hours",
    "Host monthly team-building events",
    "Add more plants for a greener workspace",
    "Implement a recycling program",
    "Upgrade the office Wi-Fi network",
]


def insert_test_data(db: Session):
    """
    Insert product data from JSON files located in the 'data' directory.
    """
    for file in os.listdir("data"):
        with open(os.path.join("data", file), "r") as f:
            print(f"Inserting data from {file}")
            try:
                data = json.load(f)
                for product in data.get("products", []):
                    if (
                        not db.query(Product)
                        .filter(Product.id == product["id"])
                        .first()
                    ):
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


def create_fake_data(db: Session, num_records: int = 50) -> None:
    """
    Generate realistic fake data for Order, Suggestion, and Request models.
    Generates a default of 50 records for each model.

    Args:
        db (Session): SQLAlchemy database session
        num_records (int): Number of records to generate for each model
    """
    # Get or create some users for associations.
    users = db.query(User).all()
    if not users:
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

    # Create fake suggestions using realistic office suggestion texts
    suggestions = db.query(Suggestion).all()
    if not suggestions:
        for _ in range(num_records):
            suggestion = Suggestion(
                user_id=choice(users).id,
                suggestion=choice(OFFICE_SUGGESTIONS),
                created_at=fake.date_time_between(start_date="-1y"),
                user_name=choice(users).username,
            )
            suggestion.updated_at = fake.date_time_between(
                start_date=suggestion.created_at
            )
            # 50% chance of being marked completed
            if randint(0, 1):
                suggestion.completed_at = fake.date_time_between(
                    start_date=suggestion.updated_at
                )
            db.add(suggestion)
        db.commit()

    # Create fake requests using realistic office request texts
    requests = db.query(Request).all()
    if not requests:
        product_list = db.query(Product).all()
        for _ in range(num_records):
            req_type = choice(["maintenance", "supply"])
            if req_type == "supply":
                request_text = choice(OFFICE_SUPPLY_REQUESTS)
                # For supply requests, choose a product title from the available products
                product = (
                    choice(product_list).title if product_list else "Office Supplies"
                )
                item_name = product
            else:
                request_text = choice(MAINTENANCE_REQUESTS)
                item_name = ""  # Maintenance requests typically don't have an item name

            request = Request(
                user_id=999,  # using the employee id for test data
                request=request_text,
                created_at=fake.date_time_between(start_date="-1y"),
                user_name="employee",
                request_type=req_type,
                status=choice(["pending", "approved", "denied", "delivered"]),
                item_name=item_name,
            )
            request.updated_at = fake.date_time_between(start_date=request.created_at)
            db.add(request)
        db.commit()
