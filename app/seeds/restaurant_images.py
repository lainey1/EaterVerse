from ..models import db, RestaurantImage, environment, SCHEMA
from sqlalchemy.sql import text

# Add demo restaurant images
def seed_restaurant_image():
    restaurant_images = [
        RestaurantImage(
            restaurant_id=1,
            user_id=1,
            url='https://media.cntraveler.com/photos/57e1723b248d564c67def5ad/16:9/w_2560,c_limit/au-cheval-burger-cr-courtesy.jpg',
            is_preview=True
        ),
        RestaurantImage(
            restaurant_id=1,
            user_id=1,
            url='https://images.squarespace-cdn.com/content/v1/5c311ba2697a98937f5a1a98/1548628192733-EFD62GOYUO7LHFSKMGYN/Dining-Room-at-Au-Cheval-in-Chicago.JPG',
            is_preview=False
        ),
         RestaurantImage(
            restaurant_id=1,
            user_id=2,
            url='https://farm3.staticflickr.com/2818/12311545455_88e7a26bfb_b.jpg',
            is_preview=False
        ),
        RestaurantImage(
            restaurant_id=1,
            user_id=2,
            url='http://www.sedbona.com/wp-content/uploads/2018/05/Au-Cheval-Chicago-36.jpg',
            is_preview=False
        ),
        RestaurantImage(
            restaurant_id=1,
            user_id=2,
            url='https://images.squarespace-cdn.com/content/v1/530e4e29e4b0ac922f793833/1432790619334-MNXJ3V969L0HV3XCRHIJ/Chopped+chicken+liver%2C+salted+butter+and+toast+%28%2410.95%29.jpg',
            is_preview=False
        ),
        RestaurantImage(
            restaurant_id=1,
            user_id=2,
            url='https://images.squarespace-cdn.com/content/v1/530e4e29e4b0ac922f793833/1432790638172-ADKUJDG8O9P6VUZL4NLT/Foie+gras+and+cabbage+stuffed+with+pork.jpg',
            is_preview=False
        ),
        RestaurantImage(
            restaurant_id=1,
            user_id=2,
            url='http://www.sedbona.com/wp-content/uploads/2018/05/Au-Cheval-Chicago-25.jpg',
            is_preview=False
        ),
        RestaurantImage(
            restaurant_id=1,
            user_id=3,
            url='https://media-cdn.tripadvisor.com/media/photo-p/0d/da/82/ac/foie-gras-with-scrambled.jpg',
            is_preview=False
        ),
        RestaurantImage(
            restaurant_id=2,
            user_id=1,
            url='https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgc7maOK1dkUWE62cXauT05wPgFBIBA8-Fsg3042M3O0BITtxVWluxGUp6p29kdkFURCaL_7hUSGmMCQ0Rhopmj13XtxTTLsOoGHiFdKnJA40DnUg5I9CjZ8ApgGlWZz11ty3fBAu2BxpOG/s1600/75D0ABB2-2B9B-4E3F-AA76-D814A918B931_1_201_a.jpeg',
            is_preview=False
        ),
        RestaurantImage(
            restaurant_id=2,
            user_id=2,
            url='https://s.hdnux.com/photos/01/27/76/43/23062761/3/ratio3x2_1920.jpg',
            is_preview=True
        ),
        RestaurantImage(
            restaurant_id=2,
            user_id=2,
            url='https://cdn.vox-cdn.com/thumbor/hfVoMmEi9rfd0vgBPmQBs2qwIdE=/0x0:3500x2333/1200x675/filters:focal(1470x887:2030x1447)/cdn.vox-cdn.com/uploads/chorus_image/image/73142168/hires_Capos_Detroit_Motorhead_2__2_.0.jpg',
            is_preview=False
        ),
        RestaurantImage(
            restaurant_id=2,
            user_id=1,
            url='https://media-cdn.tripadvisor.com/media/photo-s/0f/d0/6b/d6/photo1jpg.jpg',
            is_preview=False
        ),
        RestaurantImage(
            restaurant_id=2,
            user_id=2,
            url='https://tb-static.uber.com/prod/image-proc/processed_images/bd9b9dd5b7485aae273e811249e3eedd/783282f6131ef2258e5bcd87c46aa87e.jpeg',
            is_preview=False
        ),

        RestaurantImage(
            restaurant_id=3,
            user_id=3,
            url='https://i0.wp.com/pickleballinsider.com/wp-content/uploads/2021/03/Best-Bagel-NYC-1.jpg',
            is_preview=True
        ),

        RestaurantImage(
            restaurant_id=3,
            user_id=1,
            url='https://images.happycow.net/venues/1024/31/96/hcmp319640_1839161.jpeg',
            is_preview=False
        ),

        RestaurantImage(
            restaurant_id=3,
            user_id=2,
            url='https://media.timeout.com/images/105164615/image.jpg',
            is_preview=False
        ),

        RestaurantImage(
            restaurant_id=4,
            user_id=1,
            url='https://pbs.twimg.com/media/Ef4OIscXgAUOCFN.jpg',
            is_preview=True
        ),
        RestaurantImage(
            restaurant_id=4,
            user_id=2,
            url='https://resizer.otstatic.com/v2/photos/wide-xlarge/1/51431814.jpg',
            is_preview=False
        ),
        RestaurantImage(
            restaurant_id=4,
            user_id=2,
            url='https://ohparent.com/wp-content/uploads/2018/08/The-Eagle-OTR.png',
            is_preview=False
        ),
    ]

    db.session.bulk_save_objects(restaurant_images)
    db.session.commit()


def undo_restaurant_image():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.restaurant_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM restaurant_images"))

    db.session.commit()
