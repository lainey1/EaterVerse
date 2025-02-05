from app.models import db, Restaurant, environment, SCHEMA
from sqlalchemy.sql import text

# Adds demo restaurants
def seed_restaurants():
    restaurant1 = Restaurant(
        owner_id=1,
        name='Au Cheval',
        address='800 W Randolph St',
        city='Chicago',
        state='IL',
        country='USA',
        phone_number='(312) 929-4580',
        email='contact@auchevalchicago.com',
        website='https://www.auchevaldiner.com',
        hours={
            "Monday": ["10:00 AM", "11:15 PM"],
            "Tuesday": ["10:00 AM", "11:15 PM"],
            "Wednesday": ["10:00 AM", "11:15 PM"],
            "Thursday": ["10:00 AM", "11:15 PM"],
            "Friday": ["10:00 AM", "11:15 PM"],
            "Saturday": ["10:00 AM", "11:15 PM"],
            "Sunday": ["10:00 AM", "10:15 PM"]
        },
        cuisine='American',
        price_point=3,
        description='Savor elevated diner fare at legendary bars in, featuring reimagined classics and  the signature cheeseburger that&apos;s a fan favorite'
    )
    restaurant2 = Restaurant(
        owner_id=2,
        name="Tony's Pizza Napoletana",
        address='1570 Stockton St',
        city='San Francisco',
        state='CA',
        country='USA',
        phone_number='(415) 835-9888',
        email='info@tonyspizzanapoletana.com',
        website='https://tonyspizzanapoletana.com/',
        hours={
            "Monday": ["12:00 PM", "9:30 PM"],
            "Tuesday": ["12:00 PM", "9:30 PM"],
            "Wednesday": ["12:00 PM", "10:00 PM"],
            "Thursday": ["12:00 PM", "10:00 PM"],
            "Friday": ["12:00 PM", "11:00 PM"],
            "Saturday": ["12:00 PM", "11:00 PM"],
            "Sunday": ["12:00 PM", "10:30 PM"]
        },
        cuisine='Pizza',
        price_point=2,
        description='Bustling Italian eatery with varied pizza options from coal-fired to Roman-style, plus beer on tap.'
    )
    restaurant3 = Restaurant(
        owner_id=3,
        name='Best Bagel & Coffee',
        address='225 W 35th St A,',
        city='New York',
        state='NY',
        country='USA',
        phone_number='(212) 564-4409',
        email='bestbagel@gmail.com ',
        website='https://www.bestbagelandcoffee.com',
        hours={
            "Monday": ["6:00 AM", "4:00 PM"],
            "Tuesday": ["6:00 AM", "4:00 PM"],
            "Wednesday": ["6:00 AM", "4:00 PM"],
            "Thursday": ["6:00 AM", "4:00 PM"],
            "Friday": ["6:00 AM", "4:00 PM"],
            "Saturday": ["7:00 AM", "4:00 PM"],
            "Sunday": ["7:00 AM", "4:00 PM"]
        },
        cuisine='Breakfast & Brunch',
        price_point=1,
        description='Unleash Your Inner Foodie with Our Delicious Bagels.'
    )
    restaurant4 = Restaurant(
        owner_id=1,
        name='The Eagle OTR',
        address='1342 Vine St',
        city='Cincinnati',
        state='OH',
        country='USA',
        phone_number='(513) 802-5007',
        email='',
        website='https://www.eaglerestaurant.com/',
        hours={
            "Monday": ["11:00 AM", "11:00 PM"],
            "Tuesday": ["11:00 AM", "11:00 PM"],
            "Wednesday": ["11:00 AM", "11:00 PM"],
            "Thursday": ["11:00 AM", "11:00 PM"],
            "Friday": ["11:00 AM", "12:00 AM"],
            "Saturday": ["11:00 AM", "12:00 AM"],
            "Sunday": ["11:00 AM", "10:00 PM"]
        },
        cuisine='American',
        price_point=2,
        description='Convivial eatery & beer hall dishing up Southern classics such as fried chicken & spoonbread.'
    )

    db.session.add(restaurant1)
    db.session.add(restaurant2)
    db.session.add(restaurant3)
    db.session.add(restaurant4)
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the restaurants table.
# SQLAlchemy doesn't have a built-in function to do this.
# With Postgres in production, TRUNCATE removes all the data from the table,
# and RESET IDENTITY resets the auto-incrementing primary key, CASCADE deletes
# any dependent entities. With SQLite in development, use DELETE to remove
# all data and it will reset the primary keys for you as well.
def undo_restaurants():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.restaurants RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM restaurants"))

    db.session.commit()
