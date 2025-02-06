// react-vite/src/redux/reservations.js
// Action Type Constants
const LOAD_RESERVATION = "/reservations/LOAD_RESERVATION";
const LOAD_RESERVATIONS = "/reservations/LOAD_RESERVATIONS";
const SET_ERRORS = "/reservations/SET_ERRORS";
const CREATE_RESERVATION = "/reservations/CREATE_RESERVATION";
const UPDATE_RESERVATION = "/reservations/UPDATE_RESERVATION";
const DELETE_RESERVATION = "/reservations/DELETE_RESERVATION";

// Action Creators encapsulate the creation of action objects (POJOs) to describe events or changes in app state.
const loadReservation = (reservation) => ({
  type: LOAD_RESERVATION,
  payload: reservation,
});

const loadReservations = (reservations) => ({
  type: LOAD_RESERVATIONS,
  payload: reservations,
});

const setErrors = (errors) => ({
  type: SET_ERRORS,
  errors,
});

export const createReservation = (reservation) => ({
  type: CREATE_RESERVATION,
  payload: reservation,
});

export const updateReservation = (reservation) => ({
  type: UPDATE_RESERVATION,
  payload: reservation,
});

export const deleteReservation = (reservationId) => ({
  type: DELETE_RESERVATION,
  payload: reservationId,
});

// Thunk Action Creators handle async logic using redux-thunk middleware to dispatch actions and access the current state.
export const fetchReservationThunk = (reservation_id) => async (dispatch) => {
  try {
    console.log("hitting thunk");
    const response = await fetch(`/api/reservations/${reservation_id}`);

    if (response.ok) {
      const reservation = await response.json();
      dispatch(loadReservation(reservation));
    } else {
      const errors = await response.json();
      dispatch(setErrors(errors));
    }
  } catch (err) {
    dispatch(setErrors({ message: "Network error" }));
  }
};

export const fetchAllReservationsThunk = () => async (dispatch) => {
  try {
    const response = await fetch("/api/reservations/user");
    if (response.ok) {
      const reservations = await response.json();
      dispatch(loadReservations(reservations.reservations));
    } else {
      const errors = await response.json();
      dispatch(setErrors(errors));
    }
  } catch (err) {
    dispatch(setErrors({ message: "Network error" }));
  }
};

export const createReservationThunk =
  (restaurantId, reservationData) => async (dispatch) => {
    try {
      const response = await fetch(
        `/api/reservations/restaurant/${restaurantId}/new`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reservationData),
        }
      );

      if (response.ok) {
        const reservation = await response.json();
        dispatch(createReservation(reservation.reservation));
      } else {
        const errors = await response.json();
        dispatch(setErrors(errors));
      }
    } catch (err) {
      dispatch(setErrors({ message: "Network error" }));
    }
  };

export const updateReservationThunk =
  (reservationId, reservationData) => async (dispatch) => {
    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      });

      if (response.ok) {
        const reservation = await response.json();
        dispatch(updateReservation(reservation.reservation));
      } else {
        const errors = await response.json();
        dispatch(setErrors(errors));
      }
    } catch (err) {
      dispatch(setErrors({ message: "Network error" }));
    }
  };

export const deleteReservationThunk = (reservationId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/reservations/${reservationId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      dispatch(deleteReservation(reservationId));
    } else {
      const errors = await response.json();
      dispatch(setErrors(errors));
    }
  } catch (err) {
    dispatch(setErrors({ message: "Network error" }));
  }
};

// Reducer handles state updates based on dispatch actions. They take current state as inputs and return a new state.

const initialState = {
  reservations: [],
  currentReservation: {},
  errors: null,
};

export default function reservationsReducer(
  state = initialState,
  { type, payload }
) {
  switch (type) {
    case LOAD_RESERVATION:
      return { ...state, currentReservation: payload };
    case LOAD_RESERVATIONS:
      return { ...state, reservations: payload };
    case CREATE_RESERVATION:
      return { ...state, reservations: [...state.reservations, payload] };
    case UPDATE_RESERVATION:
      return {
        ...state,
        reservations: state.reservations.map((reservation) =>
          reservation.id === payload.id ? payload : reservation
        ),
      };
    case DELETE_RESERVATION:
      return {
        ...state,
        reservations: state.reservations.filter(
          (reservation) => reservation.id !== payload
        ),
      };
    case SET_ERRORS:
      return { ...state, errors: payload };
    default:
      return state;
  }
}
