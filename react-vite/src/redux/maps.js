// src/redux/maps.js - UPDATED VERSION
import Cookies from "js-cookie";

const LOAD_API_KEY = "maps/LOAD_API_KEY";
const LOAD_MAPS_ID = "maps/LOAD_MAPS_ID";

const loadApiKey = (key) => ({
  type: LOAD_API_KEY,
  payload: key,
});

const loadMapId = (id) => ({
  type: LOAD_MAPS_ID,
  payload: id,
});

export const getKey = () => async (dispatch, getState) => {
  // Check if we already have the key in the state to prevent duplicate calls
  const state = getState();
  if (state.maps && state.maps.key) {
    return; // Already have the key, no need to fetch again
  }

  const res = await fetch("/api/maps/key", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrf_token"),
    },
  });

  const data = await res.json();
  dispatch(loadApiKey(data.googleMapsAPIKey));
};

export const getMapId = () => async (dispatch, getState) => {
  // Check if we already have the ID in the state to prevent duplicate calls
  const state = getState();
  if (state.maps && state.maps.id) {
    return; // Already have the ID, no need to fetch again
  }

  const res = await fetch("/api/maps/id", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrf_token"),
    },
  });

  const data = await res.json();
  dispatch(loadMapId(data.googleMapsID));
};

const initialState = { key: null, id: null };

const mapsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_API_KEY:
      return { ...state, key: action.payload };
    case LOAD_MAPS_ID:
      return { ...state, id: action.payload };
    default:
      return state;
  }
};

export default mapsReducer;
