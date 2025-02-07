import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  editRestaurantThunk,
  fetchRestaurantThunk,
} from "../../redux/restaurants";
import "./RestaurantForm.css";

const UpdateRestaurant = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { restaurantId } = useParams();

  // Selector
  const restaurant = useSelector(
    (state) => state.restaurants.currentRestaurant
  );

  // State Hooks
  const [constants, setConstants] = useState({
    time_choices: [],
    popular_cuisines: [],
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    owner_id: "",
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    phone_number: "",
    email: "",
    website: "",
    cuisine: "",
    price_point: "",
    description: "",
    hours: {
      Monday: { open: "Closed", close: "Closed" },
      Tuesday: { open: "Closed", close: "Closed" },
      Wednesday: { open: "Closed", close: "Closed" },
      Thursday: { open: "Closed", close: "Closed" },
      Friday: { open: "Closed", close: "Closed" },
      Saturday: { open: "Closed", close: "Closed" },
      Sunday: { open: "Closed", close: "Closed" },
    },
  });

  const DAYS_ORDER = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    fetch("/api/restaurants/constants")
      .then((response) => response.json())
      .then((data) => setConstants(data))
      .catch((error) => console.error("Error fetching constants:", error));
  }, []);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchRestaurantThunk(restaurantId))
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [dispatch, restaurantId]);

  // Separate useEffect for handling restaurant data
  useEffect(() => {
    if (restaurant && restaurant.hours) {
      // console.log("Restaurant hours received:", restaurant.hours);

      const convertedHours = Object.fromEntries(
        Object.entries(restaurant.hours).map(([day, timeArray]) => [
          day,
          {
            open: timeArray[0],
            close: timeArray[1],
          },
        ])
      );

      // console.log("Converted hours:", convertedHours);

      setFormData((prev) => ({
        ...prev,
        owner_id: restaurant.owner_id || "",
        name: restaurant.name || "",
        address: restaurant.address || "",
        city: restaurant.city || "",
        state: restaurant.state || "",
        country: restaurant.country || "",
        phone_number: restaurant.phone_number || "",
        email: restaurant.email || "",
        website: restaurant.website || "",
        cuisine: restaurant.cuisine || "",
        price_point: restaurant.price_point || "",
        description: restaurant.description || "",
        hours: convertedHours,
      }));
    }
  }, [restaurant]);

  // Validation helper functions

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value)
          error = `${
            name.charAt(0).toUpperCase() + name.slice(1)
          } is required.`;
        break;
      case "address":
        if (!value) error = "Address is required.";
        break;
      case "city":
        if (!value) error = "City is required.";
        break;
      case "state":
        if (!value) error = "State is required.";
        break;
      case "country":
        if (!value) error = "Country is required.";
        break;
      case "cuisine":
        if (!value) error = "Cuisine type is required.";
        break;
      case "price_point":
        if (!value) error = "Price range is required.";
        break;
      case "description":
        if (!value || value.length < 30)
          error = "Description needs 30 or more characters.";
        break;
      default:
        break;
    }
    return error;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name of your restaurant is required";

    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.cuisine)
      newErrors.cuisine =
        "Cuisine type is required. Please select cuisine from the options provided.";
    if (!formData.price_point)
      newErrors.price_point =
        "Price range is required. Please select a range from the options provided.";
    if (!formData.description || formData.description.length < 30)
      newErrors.description = "Description needs 30 or more characters";
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trimStart(),
    }));

    const error = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleHoursChange = (day, type, value) => {
    console.log(`Updating ${day} ${type} to:`, value);

    setFormData((prev) => {
      const newHours = {
        ...prev.hours,
        [day]: {
          ...prev.hours[day],
          [type]: value,
        },
      };

      // If setting open to "Closed", also set close to "Closed"
      if (type === "open" && value === "Closed") {
        newHours[day].close = "Closed";
      }

      console.log(`New hours for ${day}:`, newHours[day]);

      return {
        ...prev,
        hours: newHours,
      };
    });
  };

  // Modified hours rendering section
  const renderHours = () => {
    // Use DAYS_ORDER to render days in the correct order
    return DAYS_ORDER.map((day) => {
      const times = formData.hours[day];

      return (
        <div key={day} className="form-group">
          <h3>{day}</h3>
          <div className="form-hours">
            <select
              name={`${day}_open`}
              value={times.open}
              onChange={(e) => handleHoursChange(day, "open", e.target.value)}
              required
            >
              {constants.time_choices.map((choice) => (
                <option key={choice[0]} value={choice[0]}>
                  {choice[1]}
                </option>
              ))}
            </select>

            <select
              name={`${day}_close`}
              value={times.close}
              onChange={(e) => handleHoursChange(day, "close", e.target.value)}
              required
              disabled={times.open === "Closed"}
            >
              {times.open === "Closed" ? (
                <option value="Closed">Closed</option>
              ) : (
                constants.time_choices.map((choice) => (
                  <option key={choice[0]} value={choice[0]}>
                    {choice[1]}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Convert hours back to array format before sending to backend
    const convertedHours = {};
    Object.entries(formData.hours).forEach(([day, times]) => {
      convertedHours[day] = [times.open, times.close];
    });

    const updatedRestaurantData = {
      ...formData,
      price_point: parseFloat(formData.price_point),
      hours: convertedHours,
    };

    try {
      await dispatch(editRestaurantThunk(restaurantId, updatedRestaurantData));
      navigate(`/restaurants/${restaurantId}`);
    } catch (error) {
      console.error("Failed to update restaurant:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="restaurant-form">
      <form onSubmit={handleSubmit}>
        <h1 className="form-title">Update Your Restaurant</h1>

        {/* Restaurant Name */}
        <section className="form-section">
          <h2>Create a title for your restaurant</h2>
          <p>
            Catch guests&apos; attention with a restaurant title that highlights
            what makes your place special.
          </p>

          {/* Name */}
          <div className="form-group">
            <input
              className="form-input"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name of your restaurant"
              required
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>
        </section>

        {/* Address and Contact Information */}
        <section className="form-section">
          <h2>Where&apos;s your place located?</h2>
          <p>
            Guests will only get your exact address once they booked a
            reservation.
          </p>

          {/* Address */}
          <div className="form-group">
            <input
              className="form-input"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Street Address"
              required
            />
            {errors.address && <p className="form-error">{errors.address}</p>}
          </div>

          {/* City */}
          <div className="form-group">
            <input
              className="form-input"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="City"
              required
            />
            {errors.city && <p className="form-error">{errors.city}</p>}
          </div>

          {/* State */}
          <div className="form-group">
            <input
              className="form-input"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="State"
              required
            />
            {errors.state && <p className="form-error">{errors.state}</p>}
          </div>

          {/* Country */}
          <div className="form-group">
            <select
              className="form-input"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Select a Country
              </option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="France">France</option>
              <option value="Germany">Germany</option>
              <option value="Australia">Australia</option>
              <option value="Japan">Japan</option>
              <option value="Mexico">Mexico</option>
              <option value="Italy">Italy</option>
              <option value="Spain">Spain</option>
            </select>
            {errors.country && <p className="form-error">{errors.country}</p>}
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <input
              className="form-input"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              placeholder="Phone Number"
            />
            {errors.phone_number && (
              <p className="form-error">{errors.phone_number}</p>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <input
              className="form-input"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          {/* Website */}
          <div className="form-group">
            <input
              className="form-input"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="Website"
            />
            {errors.website && <p className="form-error">{errors.website}</p>}
          </div>
        </section>

        {/* Restaurant Price Point and Cuisine */}
        <section className="form-section">
          <h2>Set your restaurant&apos;s price point and cuisine</h2>
          <p>
            Choose a price range and cuisine type that best describes your
            restaurant.
          </p>

          {/* Price Point */}
          <div className="form-group">
            <select
              className="form-input"
              name="price_point"
              value={formData.price_point}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Select a Price Range
              </option>
              <option value="1">$10 and under</option>
              <option value="2">$11 - $30</option>
              <option value="3">$31 - $60</option>
              <option value="4">$61-$100</option>
              <option value="5">Over $100</option>
            </select>
            {errors.price_point && (
              <p className="form-error">{errors.price_point}</p>
            )}
          </div>

          {/* Cuisine */}
          <div className="form-group">
            <select
              className="form-input"
              name="cuisine"
              value={formData.cuisine}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Select a Cuisine Type
              </option>
              {constants.popular_cuisines.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
            {errors.cuisine && <p className="form-error">{errors.cuisine}</p>}
          </div>
        </section>

        {/* Restaurant Description */}
        <section className="form-section">
          <h2>Describe your place to guests</h2>
          <p>
            Mention the best features of your space, any special amenities like
            fast wifi or parking, and what you love about the neighborhood.
          </p>
          <div className="form-group">
            <textarea
              className="form-input"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Please write at least 30 characters"
              required
            />
            {errors.description && (
              <p className="form-error">{errors.description}</p>
            )}
          </div>
        </section>

        {/* Restaurant Hours */}
        <section className="form-section">
          <h2>Set your restaurant&apos;s hours</h2>
          {renderHours()}
        </section>

        <button className="form-submit" type="submit">
          Update Restaurant
        </button>
      </form>
    </div>
  );
};

export default UpdateRestaurant;
