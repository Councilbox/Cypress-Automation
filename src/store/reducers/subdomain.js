import initialState from './initialState';

export default function subdomainReducer(state = initialState.subdomain, action) {
	switch (action.type) {
		case 'LOAD_SUBDOMAIN_CONFIG':
			return {
				...state,
				...action.value
			};

		default:
			return {
				...state
			};
	}
}
