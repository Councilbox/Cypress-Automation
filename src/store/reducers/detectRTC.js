import initialState from './initialState';
// import errorCodes from './errorCodes';

export default function translateReducer(
	state = initialState.detectRTC,
	action
) {
	switch (action.type) {
		case 'LOADED_DETECTRTC':
			return {
				...action.detectRTC
			};
		default:
			return {
				...state
			};
	}
}
