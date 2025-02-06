import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import {
  fetchReservationThunk,
  updateReservationThunk,
} from "../../redux/reservations";
import "../Reservations/ReservationForm.css";

const UpdateReservations = ({
  reservation_id,
  restaurant_id,
  restuarant_name,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const user = useSelector((store) => store.session.user);
  const reservation = useSelector(
    (state) => state.reservations?.currentReservation
  );

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    date: "",
    time: "19:00", // Default to 7:00 PM
    party_size: 2, // Default to 2 people
  });

  const [displayDate, setDisplayDate] = useState("");

  // Generate time slots in 15-minute increments
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 11; hour < 23; hour++) {
      // 11 AM to 10 PM
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Party size options
  const partySizeOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  // Format date for display
  const formatDisplayDate = (dateString) => {
    try {
      if (!dateString) return "";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ""; // Return empty string if date is invalid
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch (err) {
      console.error("Date formatting error:", err);
      return "";
    }
  };

  // Parse date and time from datetime string
  const parseDateAndTime = (dateTimeStr) => {
    try {
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }

      return {
        date: date.toISOString().split("T")[0],
        time: date.toTimeString().slice(0, 5),
      };
    } catch (err) {
      console.error("Date parsing error:", err);
      // Return default values if parsing fails
      return {
        date: new Date().toISOString().split("T")[0], // Today's date
        time: "19:00", // Default time
      };
    }
  };

  // Fetch reservation data
  useEffect(() => {
    dispatch(fetchReservationThunk(reservation_id));
  }, [reservation_id, dispatch]);

  // Update form data when reservation data is loaded
  useEffect(() => {
    if (reservation?.date) {
      try {
        const { date, time } = parseDateAndTime(reservation.date);

        setFormData((prev) => ({
          ...prev,
          date,
          time,
          party_size: parseInt(reservation.partySize) || 2,
        }));

        setDisplayDate(formatDisplayDate(date));
      } catch (err) {
        console.error("Error setting initial form data:", err);
        setError("There was an error loading the reservation data.");
      }
    }
  }, [reservation]);

  const validateField = (name, value) => {
    if (name === "date") {
      const selectedDate = new Date(value);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      if (selectedDate <= currentDate) {
        return "Date must be after today.";
      }
    }
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      setDisplayDate(formatDisplayDate(value));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const validationError = validateField(name, value);
    setError(validationError);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (error) {
      return;
    }

    setLoading(true);
    setMessage("");

    // Combine date and time for submission
    const dateTime = `${formData.date}T${formData.time}:00`;

    try {
      await dispatch(
        updateReservationThunk(reservation_id, {
          restaurant_id: parseInt(restaurant_id),
          user_id: user.id,
          date: dateTime,
          party_size: formData.party_size,
        })
      );
      setMessage("Reservation updated successfully");
      window.location.reload();
      closeModal();
      navigate(`/user/${user.id}?section=reservations`);
    } catch (err) {
      setError(
        err.message || "An error occurred while updating the reservation"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!reservation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="reservation-form">
      <h2>
        Update Reservation at <br />
        {restuarant_name}
      </h2>

      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="date-time-group">
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <div className="date-picker-wrapper">
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="date-input"
              />
              <div className="selected-date">{displayDate}</div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="time">Time</label>
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="time-input"
            >
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {new Date(`2024-01-01T${time}`).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="party_size">Party Size</label>
          <select
            id="party_size"
            name="party_size"
            value={formData.party_size}
            onChange={handleInputChange}
            className="select-input"
          >
            {partySizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} {size === 1 ? "person" : "people"}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Updating..." : "Update Reservation"}
        </button>
      </form>
    </div>
  );
};

export default UpdateReservations;
