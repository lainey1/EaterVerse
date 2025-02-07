from app.models import db, Review, environment, SCHEMA
from sqlalchemy.sql import text

# Adds demo reviews
def seed_reviews():
    review1 = Review(
        user_id=2,  # Not owner of Au Cheval
        restaurant_id=1,  # Au Cheval
        review='The burger lives up to the hype! Perfectly cooked, great balance of toppings. The atmosphere is lively and service was attentive.',
        stars=5
    )
    review1b = Review(
        user_id=3,  # Not owner of Au Cheval
        restaurant_id=1,
        review='Came for the burger, stayed for the bologna sandwich! Their craft beer selection is excellent too. Go early or be prepared to wait.',
        stars=4
    )
    review2 = Review(
        user_id=3,  # Not owner of Tony's Pizza
        restaurant_id=2,  # Tony's Pizza
        review='Best pizza in SF! The Margherita with buffalo mozzarella was exceptional. Love that they offer different styles of pizza.',
        stars=5
    )
    review2b = Review(
        user_id=1,  # Not owner of Tony's Pizza
        restaurant_id=2,
        review='The coal-fired pizza is incredible - perfect char on the crust. The wait can be long but the pizza is worth it. Try the Sicilian style!',
        stars=5
    )
    review3 = Review(
        user_id=1,  # Not owner of Best Bagel
        restaurant_id=3,  # Best Bagel & Coffee
        review='Fresh bagels and great coffee. The everything bagel with scallion cream cheese is my go-to breakfast spot in Midtown.',
        stars=4
    )
    review3b = Review(
        user_id=2,  # Not owner of Best Bagel
        restaurant_id=3,
        review='Real NY bagels - chewy, fresh, and perfectly toasted. The egg sandwich on a sesame bagel is fantastic. Fast service even during rush hour.',
        stars=5
    )
    review4 = Review(
        user_id=3,  # Not owner of The Eagle OTR
        restaurant_id=4,  # The Eagle OTR
        review='The fried chicken is incredible - crispy outside, juicy inside. The spoonbread side is a must-try!',
        stars=5
    )
    review4b = Review(
        user_id=2,  # Not owner of The Eagle OTR
        restaurant_id=4,
        review='Great southern comfort food in Cincinnati! The mac & cheese is decadent and the collard greens are perfectly seasoned. Cool atmosphere too.',
        stars=4
    )
    review5 = Review(
        user_id=1,  # Not owner of Nobu
        restaurant_id=5,  # Nobu
        review='Outstanding sushi and service. The black cod miso is their signature dish for a reason. Worth the splurge for special occasions.',
        stars=5
    )
    review5b = Review(
        user_id=3,  # Not owner of Nobu
        restaurant_id=5,
        review='Exceptional omakase experience. Every piece was fresh and beautifully presented. The yellowtail jalapeño is a must-order. Impeccable service.',
        stars=5
    )
    review6 = Review(
        user_id=2,  # Not owner of The French Laundry
        restaurant_id=6,  # The French Laundry
        review='An exceptional culinary experience. Each course was beautifully presented and the flavors were extraordinary.',
        stars=5
    )
    review7 = Review(
        user_id=1,  # Not owner of Joe's Stone Crab
        restaurant_id=7,  # Joe's Stone Crab
        review='Classic Miami Beach institution. The stone crabs were sweet and fresh, and the key lime pie is legendary.',
        stars=4
    )
    review8 = Review(
        user_id=2,  # Not owner of Eleven Madison Park
        restaurant_id=8,  # Eleven Madison Park
        review='Innovative and refined dining experience. The service is impeccable and the plant-based tasting menu is creative and satisfying.',
        stars=5
    )
    review9 = Review(
        user_id=3,  # Not owner of Hell's Kitchen
        restaurant_id=9,  # Gordon Ramsay Hell's Kitchen
        review='Fun atmosphere and great food. The beef wellington was cooked perfectly and the sticky toffee pudding was divine.',
        stars=4
    )
    review10 = Review(
        user_id=1,  # Not owner of The Spotted Pig
        restaurant_id=10,  # The Spotted Pig
        review="The burger with roquefort is fantastic and the devil's on horseback appetizer is addictive. Great gastropub atmosphere.",
        stars=4
    )
    review11 = Review(
        user_id=1,  # Not owner of Denny's
        restaurant_id=11,  # Denny's Times Square
        review='Reliable late-night spot in Times Square. The Grand Slam breakfast hits the spot after a night out.',
        stars=4
    )
    review12 = Review(
        user_id=2,  # Not owner of Honolulu Kitchen
        restaurant_id=12,  # Honolulu Kitchen
        review='Amazing local Hawaiian food! The loco moco is perfect any time of day and the portions are generous.',
        stars=4
    )

    all_reviews = [review1, review1b, review2, review2b, review3, review3b,
                  review4, review4b, review5, review5b, review6, review7,
                  review8, review9, review10, review11, review12]

    for review in all_reviews:
        db.session.add(review)

    db.session.commit()

def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))

    db.session.commit()
