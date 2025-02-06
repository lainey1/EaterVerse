import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useModal } from "../../context/Modal";
import "./ReservationForm.css";

const CreateReservations = () => {
  const { restaurantId } = useParams();
  const { closeModal } = useModal();
  const navigate = useNavigate();
  const user = useSelector((store) => store.session.user);

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
      if (isNaN(date.getTime())) return "";
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

    if (!restaurantId) {
      setError("Invalid restaurant ID");
      return;
    }

    if (!user?.id) {
      setError("Please log in to make a reservation");
      return;
    }

    setLoading(true);
    setMessage("");

    // Combine date and time for submission
    const dateTime = `${formData.date}T${formData.time}:00`;

    const reservationData = {
      restaurant_id: parseInt(restaurantId),
      user_id: user.id,
      date: dateTime,
      party_size: parseInt(formData.party_size),
    };

    try {
      const response = await fetch(
        `/api/reservations/restaurant/${restaurantId}/new`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(reservationData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create reservation");
      }

      setMessage(data.message || "Reservation created successfully");
      navigate(`/user/${user.id}?section=reservations`);
      closeModal();
    } catch (err) {
      setError(
        err.message || "An error occurred while creating the reservation"
      );
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reservation-form">
      <h2>Make a Reservation</h2>

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
          {loading ? "Creating..." : "Complete Reservation"}
        </button>
      </form>
    </div>
  );
};

export default CreateReservations;
