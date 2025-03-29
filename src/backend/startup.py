from backend.auth.database import get_db
from backend.data_creation.data_creation import create_fake_data, create_test_users


def on_startup():
    db = next(get_db())
    create_fake_data(db, 50)
    create_test_users(db)
