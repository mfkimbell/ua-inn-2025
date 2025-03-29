from backend.auth.database import get_db
from backend.data_creation.data_creation import (
    create_fake_data,
    create_test_users,
    insert_test_data,
)


def on_startup():
    db = next(get_db())
    create_fake_data(db, 50)
    create_test_users(db)
    insert_test_data(db)
