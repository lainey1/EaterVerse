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
        latitude=41.884567,
        longitude=-87.647713,
        phone_number='(312) 929-4580',
        email='contact@auchevalchicago.com',
        website='https://www.auchevaldiner.com',
        timezone='US/Central',
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
        description="Savor elevated diner fare at legendary bars in, featuring reimagined classics and  the signature cheeseburger that's a fan favorite"
    )
    restaurant2 = Restaurant(
        owner_id=2,
        name="Tony's Pizza Napoletana",
        address='1570 Stockton St',
        city='San Francisco',
        state='CA',
        country='USA',
        latitude=37.800342,
        longitude=-122.409487,
        phone_number='(415) 835-9888',
        email='info@tonyspizzanapoletana.com',
        website='https://tonyspizzanapoletana.com/',
        timezone='US/Pacific',
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
        latitude=40.752647,
        longitude=-73.991508,
        phone_number='(212) 564-4409',
        email='bestbagel@gmail.com ',
        website='https://www.bestbagelandcoffee.com',
        timezone='US/Eastern',
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
        latitude=39.111846,
        longitude=-84.515887,
        phone_number='(513) 802-5007',
        email='',
        website='https://www.eaglerestaurant.com/',
        timezone="US/Eastern",
        hours={
            "Monday": ["11:00 AM", "11:00 PM"],
            "Tuesday": ["11:00 AM", "11:00 PM"],
            "Wednesday": ["11:00 AM", "11:00 PM"],
            "Thursday": ["11:00 AM", "11:00 PM"],
            "Friday": ["11:00 AM", "11:00 PM"],
            "Saturday": ["11:00 AM", "12:00 AM"],
            "Sunday": ["11:00 AM", "10:00 PM"]
        },
        cuisine='American',
        price_point=2,
        description='Convivial eatery & beer hall dishing up Southern classics such as fried chicken & spoonbread.'
    )

    restaurant5 = Restaurant(

        owner_id=2,
        name='Nobu',
        address='105 Hudson St',
        city='New York',
        state='NY',
        country='USA',
        latitude=40.719692,
        longitude=-74.008848,
        phone_number='(212) 219-0500',
        email='info@noburestaurants.com',
        website='https://www.noburestaurants.com/',
        timezone='US/Eastern',
        hours={
            "Monday": ["5:30 PM", "11:00 PM"],
            "Tuesday": ["5:30 PM", "11:00 PM"],
            "Wednesday": ["5:30 PM", "11:00 PM"],
            "Thursday": ["5:30 PM", "11:00 PM"],
            "Friday": ["5:30 PM", "11:30 PM"],
            "Saturday": ["5:30 PM", "11:30 PM"],
            "Sunday": ["5:30 PM", "11:00 PM"]
        },
        cuisine='Japanese',
        price_point=5,
        description='Upscale sushi and Japanese dishes in sleek, minimalist surroundings.'
    )

    restaurant6 = Restaurant(
        owner_id=1,
        name='The French Laundry',
        address='6640 Washington St',
        city='Yountville',
        state='CA',
        country='USA',
        latitude=38.404107,
        longitude=-122.364350,
        phone_number='(707) 944-2380',
        email='info@frenchlaundry.com',
        website='https://www.thomaskeller.com/the-french-laundry',
        timezone='US/Pacific',
        hours={
            "Monday": ["5:00 PM", "10:00 PM"],
            "Tuesday": ["5:00 PM", "10:00 PM"],
            "Wednesday": ["5:00 PM", "10:00 PM"],
            "Thursday": ["5:00 PM", "10:00 PM"],
            "Friday": ["5:00 PM", "10:00 PM"],
            "Saturday": ["5:00 PM", "10:00 PM"],
            "Sunday": ["5:00 PM", "10:00 PM"]
        },
        cuisine='French',
        price_point=5,
        description="Thomas Keller's acclaimed fine dining destination with a renowned tasting menu."
    )

    restaurant7 = Restaurant(
        owner_id=2,
        name='Joe\'s Stone Crab',
        address='11 Washington Ave',
        city='Miami Beach',
        state='FL',
        country='USA',
        latitude=25.767914,
        longitude=-80.132457,
        phone_number='(305) 673-0365',
        email='info@joesstonecrab.com',
        website='https://www.joesstonecrab.com/',
        timezone="US/Eastern",
        hours={
            "Monday": ["11:30 AM", "2:30 PM"],
            "Tuesday": ["11:30 AM", "2:30 PM"],
            "Wednesday": ["11:30 AM", "2:30 PM"],
            "Thursday": ["11:30 AM", "2:30 PM"],
            "Friday": ["11:30 AM", "2:30 PM"],
            "Saturday": ["11:30 AM", "2:30 PM"],
            "Sunday": ["11:30 AM", "2:30 PM"]
        },
        cuisine='Seafood',
        price_point=4,
        description='Old-school spot for fresh stone crab, seafood, and American fare in a relaxed setting.'
    )
    restaurant8 = Restaurant(
        owner_id=3,
        name='Eleven Madison Park',
        address='11 Madison Ave',
        city='New York',
        state='NY',
        country='USA',
        latitude=40.741492,
        longitude=-73.987823,
        phone_number='(212) 889-0905',
        email='info@elevenmadisonpark.com',
        website='https://www.elevenmadisonpark.com/',
        timezone="US/Eastern",
        hours={
            "Monday": ["5:30 PM", "10:00 PM"],
            "Tuesday": ["5:30 PM", "10:00 PM"],
            "Wednesday": ["5:30 PM", "10:00 PM"],
            "Thursday": ["5:30 PM", "10:00 PM"],
            "Friday": ["5:30 PM", "10:00 PM"],
            "Saturday": ["5:30 PM", "10:00 PM"],
            "Sunday": ["5:30 PM", "10:00 PM"]
        },
        cuisine='Modern American',
        price_point=5,
        description='Refined seasonal American cuisine with a focus on innovation.'
    )
    restaurant9 = Restaurant(
        owner_id=1,
        name='Gordon Ramsay Hell\'s Kitchen',
        address='1128 W 7th St',
        city='Los Angeles',
        state='CA',
        country='USA',
        latitude=34.051254,
        longitude=-118.263468,
        phone_number='(213) 821-1051',
        email='info@hellskitchenrestaurant.com',
        website='https://www.hellskitchenrestaurant.com/',
        timezone="US/Pacific",
        hours={
            "Monday": ["11:00 AM", "10:00 PM"],
            "Tuesday": ["11:00 AM", "10:00 PM"],
            "Wednesday": ["11:00 AM", "10:00 PM"],
            "Thursday": ["11:00 AM", "10:00 PM"],
            "Friday": ["11:00 AM", "10:00 PM"],
            "Saturday": ["11:00 AM", "10:00 PM"],
            "Sunday": ["11:00 AM", "10:00 PM"]
        },
        cuisine='Contemporary American',
        price_point=4,
        description="Gordon Ramsay's celebrated restaurant featuring a signature Hell's Kitchen experience."
    )
    
    restaurant10 = Restaurant(
        owner_id=2,
        name='The Spotted Pig',
        address='314 W 11th St',
        city='New York',
        state='NY',
        country='USA',
        latitude=40.735638,
        longitude=-74.007147,
        phone_number='(212) 620-0393',
        email='info@thespottedpig.com',
        website='https://www.thespottedpig.com/',
        timezone="US/Eastern",
        hours={
            "Monday": ["12:00 PM", "11:00 PM"],
            "Tuesday": ["12:00 PM", "11:00 PM"],
            "Wednesday": ["12:00 PM", "11:00 PM"],
            "Thursday": ["12:00 PM", "11:00 PM"],
            "Friday": ["12:00 PM", "11:00 PM"],
            "Saturday": ["12:00 PM", "11:00 PM"],
            "Sunday": ["12:00 PM", "11:00 PM"]
        },
        cuisine='Gastropub',
        price_point=3,
        description='Trendy gastropub serving inventive, upscale British & American comfort fare.'
    )

    restaurant11 = Restaurant(
        owner_id=3,
        name='Denny\'s Times Square',
        address='150 W 38th St',
        city='New York',
        state='NY',
        country='USA',
        latitude=40.753662,
        longitude=-73.988114,
        phone_number='(212) 768-1940',
        email='info@dennys.com',
        website='https://www.dennys.com',
        timezone='US/Eastern',
        hours={
            "Monday": ["00:00 AM", "11:59 PM"],    # 24 hours
            "Tuesday": ["00:00 AM", "11:59 PM"],
            "Wednesday": ["00:00 AM", "11:59 PM"],
            "Thursday": ["00:00 AM", "11:59 PM"],
            "Friday": ["00:00 AM", "11:59 PM"],
            "Saturday": ["00:00 AM", "11:59 PM"],
            "Sunday": ["00:00 AM", "11:59 PM"]
        },
        cuisine='American Diner',
        price_point=1,
        description='Classic American diner serving breakfast, lunch and dinner 24/7.'
    )

    restaurant12 = Restaurant(
        owner_id=3,
        name='Honolulu Kitchen',  # Example for timezone handling
        address='2600 S King St',
        city='Honolulu',
        state='HI',
        country='USA',
        latitude=21.293872,
        longitude=-157.827791,
        phone_number='(808) 555-1234',
        email='info@honolulukitchen.com',
        website='https://www.honolulukitchen.com',
        timezone='Pacific/Honolulu',
        hours={
            "Monday": ["6:00 AM", "2:00 AM"],     # Late night/early morning hours
            "Tuesday": ["6:00 AM", "2:00 AM"],
            "Wednesday": ["6:00 AM", "2:00 AM"],
            "Thursday": ["6:00 AM", "2:00 AM"],
            "Friday": ["6:00 AM", "3:00 AM"],     # Extended weekend hours
            "Saturday": ["6:00 AM", "3:00 AM"],
            "Sunday": ["6:00 AM", "2:00 AM"]
        },
        cuisine='Hawaiian',
        price_point=2,
        description='Local Hawaiian cuisine served late into the night, perfect for early birds and night owls.'
    )


    db.session.add(restaurant1)
    db.session.add(restaurant2)
    db.session.add(restaurant3)
    db.session.add(restaurant4)
    db.session.add(restaurant5)
    db.session.add(restaurant6)
    db.session.add(restaurant7)
    db.session.add(restaurant8)
    db.session.add(restaurant9)
    db.session.add(restaurant10)
    db.session.add(restaurant11)
    db.session.add(restaurant12)

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
