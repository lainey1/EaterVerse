import { useState, useEffect } from "react";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import UpdateReservations from "../Reservations/UpdateReservations";
import "./ManageReservations.css";

const ManageReservations = () => {
  const [reservations, setReservations] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const resultsPerPage = 3;

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch("/api/reservations/user", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Error fetching reservations");
        }
        const data = await response.json();

        const now = new Date();
        const sortedReservations = {
          upcoming: [],
          past: [],
        };

        data.reservations.forEach((reservation) => {
          const reservationDate = new Date(reservation.date);
          if (reservationDate >= now) {
            sortedReservations.upcoming.push(reservation);
          } else {
            sortedReservations.past.push(reservation);
          }
        });

        sortedReservations.upcoming.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        sortedReservations.past.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setReservations(sortedReservations);
      } catch (err) {
        console.error("Error fetching reservations:", err);
        setError("There was an error fetching your reservations.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleOnClick = async (reservationId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error deleting reservation");
      }

      setReservations((prev) => ({
        upcoming: prev.upcoming.filter((res) => res.id !== reservationId),
        past: prev.past.filter((res) => res.id !== reservationId),
      }));
    } catch (err) {
      console.error("Error deleting reservation:", err);
      setError("There was an error deleting your reservation.");
    } finally {
      setLoading(false);
    }
  };

  const paginate = (reservations, page) => {
    const start = (page - 1) * resultsPerPage;
    return reservations.slice(start, start + resultsPerPage);
  };

  const ReservationList = ({ reservations, title, page, setPage }) => {
    const paginatedReservations = paginate(reservations, page);
    return (
      <div className="reservation-section">
        <h3>{title}</h3>
        {paginatedReservations.length === 0 ? (
          <p>No {title.toLowerCase()} found.</p>
        ) : (
          paginatedReservations.map((reservation) => (
            <div key={reservation.id} className="reservation-item">
              <div className="restaurant-image">
                {reservation.restaurant.preview_image ? (
                  <img
                    src={reservation.restaurant.preview_image}
                    alt={reservation.restaurant.name}
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
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </span>
            </div>
          ))
        )}
        <div className="pagination">
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>
            Previous
          </button>
          <span> Page {page} </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page * resultsPerPage >= reservations.length}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (loading) return <div>Loading reservations...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div id="manage-reservations-section">
      <h2>Your Reservations</h2>
      <ReservationList
        reservations={reservations.upcoming}
        title="Upcoming Reservations"
        page={upcomingPage}
        setPage={setUpcomingPage}
      />
      <div style={{ margin: "20px 0", borderTop: "1px solid #e0e0e0" }}></div>
      <ReservationList
        reservations={reservations.past}
        title="Past Reservations"
        page={pastPage}
        setPage={setPastPage}
      />
    </div>
  );
};

export default ManageReservations;
