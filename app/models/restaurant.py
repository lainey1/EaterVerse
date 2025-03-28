from .user import User
from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod


class Restaurant(db.Model):
    __tablename__ = "restaurants"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    name = db.Column(db.String(95), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    phone_number = db.Column(db.String(15), nullable=True)
    email = db.Column(db.String(255), nullable=True)
    website = db.Column(db.String(255), nullable=True)
    timezone = db.Column(db.String(50), nullable=False, default='America/Los_Angeles')
    hours = db.Column(db.JSON, nullable=True)
    cuisine = db.Column(db.String(50), nullable=False)
    price_point = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True
    )

    reservations = db.relationship(
        "Reservation", backref="restaurant", cascade="all, delete-orphan"
    )

    restaurant_images = db.relationship(
        "RestaurantImage", back_populates="restaurant", cascade="all, delete-orphan"
    )

    reviews = db.relationship(
        "Review", backref="restaurant", cascade="all, delete-orphan"
    )


    # review_images = db.relationship(
    #     "ReviewImage", back_populates="restaurant", cascade="all, delete-orphan"
    # )



    def to_dict(self, form=None):

        preview_image = next(
        (image for image in self.restaurant_images if image.is_preview), None
        )

        # Initialize the dictionary with all other fields
        restaurants_dict = {
            "id": self.id,
            "owner_id": self.owner_id,
            "name": self.name,
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "country": self.country,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "phone_number": self.phone_number,
            "email": self.email,
            "website": self.website,
            "cuisine": self.cuisine,
            "price_point": self.price_point,
            "description": self.description,
            'preview_image': preview_image.url if preview_image else None,
            'timezone': self.timezone,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

        # Use the stored hours directly from the database
        if self.hours:
            restaurants_dict["hours"] = self.hours
        else:
            restaurants_dict["hours"] = {
                day: ["Closed", "Closed"]
                for day in [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                ]
            }

        return restaurants_dict
