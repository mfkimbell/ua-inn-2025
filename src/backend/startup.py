from backend.auth.database import get_db
from backend.data_creation.data_creation import create_fake_data


def on_startup():
    db = next(get_db())
    create_fake_data(db, 50)
