import initialState from './initialState';

export default function councilReducer(state = initialState.council, action) {
	switch (action.type) {
	case 'COUNCIL_DATA':
		return {
			...state,
			...action.value
		};

	case 'COUNCIL_PARTICIPANTS':
		return {
			...state,
			participants: action.value
		};

	default:
		return {
			...state
		};
	}
}
