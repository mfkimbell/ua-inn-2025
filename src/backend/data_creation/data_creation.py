from random import choice, randint

from faker import Faker
from sqlalchemy.orm import Session

from backend.auth.models import Order, Request, Suggestion, User

fake = Faker()


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
                user_id=choice(users).id,
                request=fake.text(max_nb_chars=200),
                order_id=choice(orders).id,
                created_at=fake.date_time_between(start_date="-1y"),
            )
            request.updated_at = fake.date_time_between(start_date=request.created_at)
            db.add(request)
        db.commit()
