import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import restaurantsReducer from "./restaurants";
import reviewsReducer from "./review";
import restaurantImagesReducer from "./restaurantImages";
import reservationsReducer from "./reservations";
import mapsReducer from "./maps";

const rootReducer = combineReducers({
  maps: mapsReducer,
  reservations: reservationsReducer,
  restaurants: restaurantsReducer,
  restaurantImages: restaurantImagesReducer,
  reviews: reviewsReducer,
  session: sessionReducer,
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
