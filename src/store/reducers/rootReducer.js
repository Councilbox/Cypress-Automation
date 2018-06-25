import { combineReducers } from "redux";
import main from "./main";
import companies from "./companies";
import council from "./council";
import user from "./user";
import translate from "./translate";
import detectRTC from './detectRTC';


const rootReducer = combineReducers({
	main,
	companies,
	user,
	council,
	translate,
	detectRTC
});

export default rootReducer;
