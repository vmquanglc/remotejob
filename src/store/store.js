import { createStore, applyMiddleware } from "redux";
import RootReducer from "./reducers/RootReducer";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

const middlewares = [thunk];

const store = createStore(
  RootReducer,
  composeWithDevTools(applyMiddleware(...middlewares))
);

export default store;
