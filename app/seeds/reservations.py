from datetime import datetime
from app.models import db, Reservation, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_reservations():
    reservations = [
        Reservation(id=1, restaurant_id=3, user_id=1, date=datetime.strptime('2024-12-20 13:45:00', '%Y-%m-%d %H:%M:%S'), party_size=4),
        Reservation(id=2, restaurant_id=2, user_id=3, date=datetime.strptime('2024-12-21 18:00:00', '%Y-%m-%d %H:%M:%S'), party_size=2),
        Reservation(id=3, restaurant_id=1, user_id=2, date=datetime.strptime('2024-12-22 19:30:00', '%Y-%m-%d %H:%M:%S'), party_size=6),
        Reservation(id=4, restaurant_id=2, user_id=1, date=datetime.strptime('2025-03-21 19:45:00', '%Y-%m-%d %H:%M:%S'), party_size=4),
        Reservation(id=5, restaurant_id=1, user_id=1, date=datetime.strptime('2025-01-10 12:00:00', '%Y-%m-%d %H:%M:%S'), party_size=3),
        Reservation(id=6, restaurant_id=4, user_id=1, date=datetime.strptime('2025-02-05 20:00:00', '%Y-%m-%d %H:%M:%S'), party_size=5),
        Reservation(id=7, restaurant_id=3, user_id=1, date=datetime.strptime('2025-02-12 17:30:00', '%Y-%m-%d %H:%M:%S'), party_size=2),
        Reservation(id=8, restaurant_id=4, user_id=1, date=datetime.strptime('2025-03-01 14:15:00', '%Y-%m-%d %H:%M:%S'), party_size=4),
        Reservation(id=9, restaurant_id=2, user_id=1, date=datetime.strptime('2025-03-10 19:00:00', '%Y-%m-%d %H:%M:%S'), party_size=6),
        Reservation(id=10, restaurant_id=1, user_id=1, date=datetime.strptime('2025-03-25 18:45:00', '%Y-%m-%d %H:%M:%S'), party_size=3),
    ]

    db.session.bulk_save_objects(reservations)
    db.session.commit()



# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_reservations():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reservations RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reservations"))
    db.session.commit()
