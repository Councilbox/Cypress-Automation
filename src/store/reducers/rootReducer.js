import { combineReducers } from "redux";
import main from "./main";
import companies from "./companies";
import council from "./council";
import user from "./user";
import subdomain from "./subdomain";
import translate from "./translate";
import detectRTC from './detectRTC';


const rootReducer = combineReducers({
	main,
	companies,
	user,
	council,
	translate,
	subdomain,
	detectRTC
});

export default rootReducer;
