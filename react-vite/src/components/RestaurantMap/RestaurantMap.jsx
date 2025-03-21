// src/components/RestaurantMap/RestaurantMap.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getKey, getMapId } from "../../redux/maps";
import "./RestaurantMap.css";

function RestaurantMap({ restaurant }) {
  const dispatch = useDispatch();
  const apiKey = useSelector((state) => state.maps.key);
  const mapId = useSelector((state) => state.maps.id);

  useEffect(() => {
    // Only dispatch these actions once when the component mounts
    // Not dependent on apiKey or mapId to prevent cycling
    dispatch(getKey());
    dispatch(getMapId());
  }, [dispatch]);

  useEffect(() => {
    // Check if we have both the API key and map ID first
    if (!apiKey || !mapId || !restaurant) {
      return; // Don't proceed if any are missing
    }

    // Initialize map when we have all required data
    const loadGoogleMapsAPI = () => {
      // Check if the Google Maps API is already loaded
      if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=places,marker&v=weekly`;
        script.async = true;
        script.defer = true;
        script.setAttribute("loading", "async");

        window.initMap = () => {
          renderMap();
        };

        document.head.appendChild(script);
      } else {
        renderMap();
      }
    };

    const renderMap = () => {
      // Add a slight delay to ensure the DOM is fully ready
      setTimeout(() => {
        const mapElement = document.getElementById("restaurant-map");

        if (mapElement && restaurant.latitude && restaurant.longitude) {
          const latLng = {
            lat: parseFloat(restaurant.latitude),
            lng: parseFloat(restaurant.longitude),
          };

          const map = new window.google.maps.Map(mapElement, {
            center: latLng,
            zoom: 15,
            mapId: mapId,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: true,
            zoomControl: true,
          });

          // Use the newer AdvancedMarkerElement API if available
          if (
            window.google.maps.marker &&
            window.google.maps.marker.AdvancedMarkerElement
          ) {
            // Create a marker using the new API
            new window.google.maps.marker.AdvancedMarkerElement({
              map: map,
              position: latLng,
              title: restaurant.name,
            });
          } else {
            // Fallback to traditional marker
            new window.google.maps.Marker({
              position: latLng,
              map: map,
              title: restaurant.name,
              animation: window.google.maps.Animation.DROP,
            });
          }
        }
      }, 100); // Small delay to ensure DOM is ready
    };

    loadGoogleMapsAPI();
  }, [apiKey, mapId, restaurant]);

  // Handle cases where restaurant data might be incomplete
  if (!restaurant) {
    return (
      <div className="restaurant-map-container">
        <div className="restaurant-map-placeholder">
          Loading restaurant information...
        </div>
      </div>
    );
  }

  // Check if we have location data
  if (!restaurant.latitude || !restaurant.longitude) {
    // If no coords but we have an address, show the address instead
    if (restaurant.address) {
      return (
        <div className="restaurant-map-container">
          <div className="restaurant-map-placeholder">
            <p>Map view not available</p>
            <p>
              {restaurant.address}
              <br />
              {restaurant.city}, {restaurant.state}
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="restaurant-map-container">
          <div className="restaurant-map-placeholder">
            Location information not available
          </div>
        </div>
      );
    }
  }

  return (
    <div className="restaurant-map-container">
      <div id="restaurant-map"></div>
    </div>
  );
}

// Wrapper component to handle the case when the restaurant doesn't have coordinates yet
function RestaurantMapWrapper({ restaurant }) {
  return (
    <div>
      <RestaurantMap restaurant={restaurant} />
      <div className="map-address">
        <p>
          {restaurant.address}
          <br />
          {restaurant.city}, {restaurant.state} {restaurant.zip_code}
        </p>

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
            `${restaurant.address}, ${restaurant.city}, ${restaurant.state} ${
              restaurant.zip_code || ""
            }`
          )}&travelmode=driving`}
          className="get-directions-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get Directions
        </a>
      </div>
    </div>
  );
}

export default RestaurantMapWrapper;
