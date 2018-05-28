import initialState from "./initialState";
// import errorCodes from './errorCodes';

export default function translateReducer(
	state = initialState.translate,
	action
) {
	switch (action.type) {
		case "LOADED_LANG":
			return {
				...action.value,
				selectedLanguage: action.selected
			};
		default:
			return {
				...state
			};
	}
}
