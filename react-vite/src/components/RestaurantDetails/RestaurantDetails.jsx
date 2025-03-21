// react-vite/src/components/RestaurantDetails/RestaurantDetails.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ReviewFormPage from "../ReviewFormPage/ReviewFormPage";
import CreateReservations from "../Reservations/CreateReservations";
import RestaurantMapWrapper from "../RestaurantMap/RestaurantMap";

import { IoIosInformationCircle, IoIosStarOutline } from "react-icons/io";
import { MdAddAPhoto, MdClose } from "react-icons/md";
import { fetchRestaurantThunk } from "../../redux/restaurants";
import {
  formatReviewCount,
  formatStarRating,
  getAvgStarRating,
  getReviewCount,
} from "../../utils/restaurantHelpers";
import { formatTimeAgo, parseTimeToMinutes } from "../../utils/timeHelpers";
import ReviewsRestaurant from "../ReviewsRestaurant";
import StarRating from "../StarRating";
import RestaurantHours from "./RestaurantHours";

import "./RestaurantDetails.css";

function RestaurantDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const currentUser = useSelector((state) => state.session.user);
  const restaurant = useSelector(
    (state) => state.restaurants.currentRestaurant
  );
  const isOwner = currentUser?.id === restaurant?.owner_id;
  const avgStarRating = getAvgStarRating(restaurant?.reviewStats);
  const reviewCount = getReviewCount(restaurant?.reviewStats);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchRestaurantThunk(restaurantId))
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [dispatch, restaurantId]);

  useEffect(() => {
    if (restaurant?.hours) {
      const today = new Date();

      // Convert current time to restaurant's timezone
      const timeInRestaurantTZ = new Date(
        today.toLocaleString("en-US", {
          timeZone:
            restaurant.timezone ||
            Intl.DateTimeFormat().resolvedOptions().timeZone,
        })
      );

      const todayHours =
        restaurant.hours[
          timeInRestaurantTZ.toLocaleString("en-US", { weekday: "long" })
        ];

      if (todayHours) {
        let [openTime, closeTime] = todayHours.map((time) =>
          parseTimeToMinutes(time)
        );
        const nowMinutes =
          timeInRestaurantTZ.getHours() * 60 + timeInRestaurantTZ.getMinutes();

        // Handle special cases
        if (closeTime === 0) {
          // If closing time is midnight (00:00)
          closeTime = 24 * 60; // Convert to 1440 minutes
        }

        // Handle cases where closing time is past midnight or same as opening
        if (closeTime <= openTime) {
          // For Friday's case where it might be AM-AM
          if (closeTime === openTime) {
            setIsOpen(false); // If open and close time are same, consider it closed
          } else {
            // For cases like Saturday's midnight closing
            setIsOpen(nowMinutes >= openTime || nowMinutes <= closeTime);
          }
        } else {
          // Normal case
          setIsOpen(nowMinutes >= openTime && nowMinutes <= closeTime);
        }
      } else {
        setIsOpen(false);
      }
    }
  }, [restaurant?.hours, restaurant?.timezone]);

  const handleImageClick = (index) => {
    setSelectedImage(restaurant.images[index].url);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  const handleNavigateToImages = () => {
    navigate("images");
  };

  // Navigate to UserProfile with active section
  const navigateToSection = (section) => {
    navigate(`/user/${currentUser.id}?section=${section}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="restaurant-page">
      <div className="carousel-container">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={10}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
          loop={true}
        >
          {restaurant.images.map((image, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={image.url}
                alt={`Restaurant image ${idx + 1}`}
                style={{
                  maxHeight: "400px",
                  width: "100%",
                  objectFit: "cover",
                }}
                onClick={() => handleImageClick(idx)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {modalOpen && selectedImage && (
        <div className="image-modal">
          <div className="image-modal-overlay" onClick={handleCloseModal}></div>
          <div className="image-modal-content">
            <button className="image-modal-close" onClick={handleCloseModal}>
              <MdClose size={30} />
            </button>
            <img
              src={selectedImage}
              alt="Enlarged restaurant image"
              className="modal-image"
            />
          </div>
        </div>
      )}
      <div className="restaurant-page-banner">
        <h2 className="restaurant-name">{restaurant?.name}</h2>
        <span>
          <div className="highlights">
            <StarRating rating={avgStarRating} />
            <span style={{ padding: "0 0.5em" }}></span>
            {formatStarRating(avgStarRating)}
            <span style={{ padding: "0 0.5em" }}></span>
            {formatReviewCount(reviewCount)}
          </div>
          <div className="highlights">
            <span
              className="open-or-closed"
              style={{
                color: isOpen ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {isOpen ? "Open Now" : "Closed"}
            </span>

            <span style={{ padding: "0 0.5em" }}>•</span>
            <span>{restaurant?.timezone?.replace("_", " ")}</span>

            <span style={{ padding: "0 0.5em" }}></span>
            {restaurant?.price_point
              ? "$".repeat(restaurant.price_point)
              : "Price not available"}

            <span style={{ padding: "0 0.5em" }}>•</span>
            <span>{restaurant?.cuisine}</span>
            <span style={{ padding: "0 0.15em 0 0.5em" }}>
              <IoIosInformationCircle style={{ color: "navy" }} />
            </span>

            <span style={{ color: "navy" }}>
              Last updated {formatTimeAgo(restaurant.updated_at)}
            </span>
          </div>
        </span>
      </div>
      <div id="restaurant-layout">
        <div id="restaurant-main-panel">
          <div id="restaurant-menu-buttons">
            {!isOwner && (
              <div className="button-wrapper">
                <OpenModalButton
                  className="custom-open-modal-button"
                  buttonText={
                    <>
                      <IoIosStarOutline className="button-icon" /> Write a
                      Review
                    </>
                  }
                  modalComponent={
                    <ReviewFormPage restaurantId={restaurant.id} />
                  }
                />
              </div>
            )}

            <button className="menu-button" onClick={handleNavigateToImages}>
              <MdAddAPhoto className="button-icon" />
              Add Photo
            </button>

            {isOwner && (
              <button
                className="menu-button"
                onClick={() => navigateToSection("restaurants")}
              >
                Manage Restaurant
              </button>
            )}
          </div>
          <div className="sub-panel">
            <h3>Location & Hours</h3>
            {/* Adding map component */}
            <RestaurantMapWrapper restaurant={restaurant} />
            <strong>Timezone: </strong>
            {restaurant?.timezone?.replace("_", " ")}
            <RestaurantHours hours={restaurant?.hours} />
          </div>
          <div>
            <ReviewsRestaurant />
          </div>
        </div>

        <div>
          <div className="restaurant-side-panel">
            <h3>Make a Reservation</h3>
            <div className="button-wrapper">
              <OpenModalButton
                className="custom-open-modal-button"
                buttonText="Book a Table"
                modalComponent={
                  <CreateReservations restaurantId={restaurant.id} />
                }
              />
            </div>
          </div>
          <div className="restaurant-side-panel">
            <div className="restaurant-info">
              <div className="profile-text">
                <a
                  href={restaurant.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {restaurant.website}
                </a>
                <hr />
                <p>{restaurant.phone_number}</p>
                <hr />
                <p>
                  {restaurant.address}
                  <br />
                  {restaurant.city}, {restaurant.state}
                  <br />
                </p>
                <hr />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDetails;
