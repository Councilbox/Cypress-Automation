import initialState from './initialState';

export default function mainReducer(state = initialState.main, action) {
	switch(action.type) {

		case 'LOGIN_SUCCESS':
			return{
				...state,
                isLogged: true
			}

		case 'LOGOUT':
			return {
				...state,
				isLogged: false
			}
			
		default:
			return {
				...state
            };
	}
}
