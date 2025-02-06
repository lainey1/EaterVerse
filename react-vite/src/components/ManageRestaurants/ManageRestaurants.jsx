import { useEffect, useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllRestaurantsThunk } from "../../redux/restaurants";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteRestaurant from "./DeleteRestaurant";

import StarRating from "../StarRating";
import "./ManageRestaurants.css";

function ManageRestaurants() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const restaurants = useSelector((state) => state.restaurants.restaurants);
  const currentUser = useSelector((state) => state.session.user);
  const [loading, setLoading] = useState(true);

  const userRestaurants = restaurants?.filter(
    (restaurant) => restaurant.owner_id === currentUser.id
  );
  useEffect(() => {
    setLoading(true);
    dispatch(fetchAllRestaurantsThunk())
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (!currentUser)
    return <div>You must be logged in to manage restaurants.</div>;

  return (
    <div id="manage-restaurants-section">
      <h2>Manage Your Restaurants</h2>

      <div className="create-restaurant-container">
        <p>Use the buttons below to create, update, or delete a restaurant.</p>
        <button
          id="create-restaurant-button"
          onClick={() => {
            navigate("/restaurants/new");
          }}
        >
          Create a New Restaurant
        </button>
      </div>

      <div>
        {userRestaurants?.map((restaurant) => {
          // Calculate the average star rating for each restaurant
          const avgStarRating = restaurant?.reviewStats?.avgStarRating || 0;
          const reviewCount = restaurant?.reviewStats?.reviewCount || 0;

          return (
            <>
              <div key={restaurant.id} className="restaurant-item">
                <div className="restaurant-image">
                  {restaurant?.previewImage ? (
                    <img src={restaurant.previewImage} alt={restaurant.name} />
                  ) : (
                    <div>No Image Available</div>
                  )}
                </div>
                <div className="restaurant-details">
                  <br />
                  <h3 className="restaurant-name">{restaurant.name}</h3>
                  <span className="rating-line">
                    {/* Pass the avgStarRating to the StarRating component */}
                    <StarRating rating={avgStarRating} />
                    {avgStarRating > 0 ? (
                      <span>{Number(avgStarRating).toFixed(1)}</span>
                    ) : (
                      <span>New</span>
                    )}
                    <p style={{ fontWeight: "normal", color: "4c5b61" }}>
                      ({reviewCount} Reviews)
                    </p>
                  </span>

                  <div id="restaurant-price-location">
                    <span>
                      {restaurant?.price_point
                        ? "$".repeat(restaurant.price_point)
                        : "Price not available"}
                    </span>
                    <span style={{ padding: "0 0.5em" }}>•</span>
                    <p className="restaurant-location">
                      <IoLocationOutline />
                      {restaurant.city}
                    </p>
                    <span style={{ padding: "0 0.5em" }}>•</span>
                    <span>{restaurant?.cuisine}</span>
                  </div>
                </div>

                <span className="manage-buttons">
                  <button
                    onClick={() =>
                      navigate(`/restaurants/${restaurant.id}/images`)
                    }
                  >
                    Photos
                  </button>
                  <button
                    className="update-button"
                    onClick={() => {
                      navigate(`/restaurants/${restaurant.id}/`);
                    }}
                  >
                    View
                  </button>
                  <button
                    className="update-button"
                    onClick={() => {
                      navigate(`/restaurants/${restaurant.id}/edit`);
                    }}
                  >
                    Edit
                  </button>
                  <OpenModalButton
                    buttonText={"Delete"}
                    modalComponent={
                      <DeleteRestaurant restaurantId={restaurant.id} />
                    }
                    className="delete-button"
                  />
                </span>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
}

export default ManageRestaurants;
