import { useEffect, useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import eaterverse_banner from "../../../public/eaterverse_page-banner.png";
import { fetchAllRestaurantsThunk } from "../../redux/restaurants";
import StarRating from "../StarRating";
import "./AllRestaurants.css";

function AllRestaurants() {
  const dispatch = useDispatch();
  const restaurants = useSelector((state) => state.restaurants.restaurants);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 7;

  useEffect(() => {
    dispatch(fetchAllRestaurantsThunk());
  }, [dispatch]);

  // Slice the restaurants array to show only 10 per page
  const indexOfLastRestaurant = currentPage * resultsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - resultsPerPage;
  const currentRestaurants = restaurants?.slice(
    indexOfFirstRestaurant,
    indexOfLastRestaurant
  );

  // Change page when next/prev buttons are clicked
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(restaurants?.length / resultsPerPage);

  return (
    <div id="all-restaurants-page">
      <img
        src={eaterverse_banner}
        alt="Eaterverse banner"
        id="eaterverse-banner"
      />
      <div className="restaurants-grid">
        {currentRestaurants?.map((restaurant) => {
          // Calculate the average star rating for each restaurant
          const avgStarRating = restaurant?.reviewStats?.avgStarRating || 0;
          const reviewCount = restaurant?.reviewStats?.reviewCount || 0;

          return (
            <div key={restaurant.id} className="restaurant-tile">
              <Link
                to={`/restaurants/${restaurant.id}`}
                className="restaurant-link"
              >
                <div className="restaurant-tile-container">
                  <div className="restaurant-image-container">
                    {restaurant?.previewImage ? (
                      <img
                        src={restaurant.previewImage}
                        alt={restaurant.name}
                        className="all-restaurants-image"
                      />
                    ) : (
                      <div>No Image Available</div>
                    )}
                  </div>
                  <div className="restaurant-details">
                    <h3 className="restaurant-name">{restaurant.name}</h3>
                    <span className="rating-line">
                      <StarRating rating={avgStarRating} />
                      {avgStarRating > 0 ? (
                        <span>{Number(avgStarRating).toFixed(1)}</span>
                      ) : (
                        <span>New</span>
                      )}
                      <p style={{ fontWeight: "normal", color: "#4c5b61" }}>
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
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AllRestaurants;
