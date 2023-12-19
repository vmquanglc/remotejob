import { combineReducers } from "redux";
import { AuthReducer } from "../auth/reducer";
import { Calculator } from "../calculator/reducer";

export default combineReducers({
	auth: AuthReducer,
	calculator: Calculator,
});
