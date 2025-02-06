import { useState, useEffect } from "react";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import UpdateReservations from "../Reservations/UpdateReservations";
import "./ManageReservations.css";

const ManageReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reservations on mount
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch("/api/reservations/user", {
          method: "GET",
          credentials: "include", // Include cookies for authentication (session-based login)
        });
        if (!response.ok) {
          throw new Error("Error fetching reservations");
        }
        const data = await response.json();
        setReservations(data.reservations);
      } catch (err) {
        console.error("Error fetching reservations:", err);
        setError("There was an error fetching your reservations.");
      } finally {
        setLoading(false); // Ensure loading is turned off
      }
    };

    fetchReservations();
  }, []);

  // Handle reservation deletion
  const handleOnClick = async (reservationId) => {
    setLoading(true); // Set loading true while deleting
    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error deleting reservation");
      }
      // const data = await response.json();
      // Remove deleted reservation from the list
      setReservations((prevReservations) =>
        prevReservations.filter(
          (reservation) => reservation.id !== reservationId
        )
      );
    } catch (err) {
      console.error("Error deleting reservation:", err);
      setError("There was an error deleting your reservation.");
    } finally {
      setLoading(false); // Ensure loading is turned off
    }
  };

  if (loading) return <div>Loading reservations...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div id="manage-reservations-section">
      <h2>Your Reservations</h2>
      <div>
        {reservations.length === 0 ? (
          <p>No reservations found.</p>
        ) : (
          reservations.map((reservation) => (
            <div key={reservation.id} className="reservation-item">
              <div className="restaurant-image">
                {reservation.restaurant.preview_image ? (
                  <img
                    src={reservation.restaurant?.preview_image}
                    alt={reservation.restaurant?.name}
                  />
                ) : (
                  <div>No Image Available</div>
                )}
              </div>
              <div className="restaurant-details">
                <h3>{reservation.restaurant.name}</h3>
                <p>
                  <strong>Date: </strong>
                  {new Date(reservation.date).toLocaleString("en-US", {
                    weekday: "long",
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                    timeZoneName: "short",
                  })}
                </p>

                <p>
                  <strong>Party Size: </strong>
                  {reservation.party_size}
                </p>
              </div>
              <span className="manage-buttons">
                <OpenModalButton
                  className="custom-open-modal-button"
                  buttonText="Update"
                  modalComponent={
                    <UpdateReservations
                      reservation_id={reservation.id}
                      restaurant_id={reservation.restaurant_id}
                      restaurant_name={reservation.name}
                    />
                  }
                />
                <button
                  onClick={() => handleOnClick(reservation.id)}
                  disabled={loading} // Disable button while loading
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageReservations;
