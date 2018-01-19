import initialState from './initialState';

export default function companyReducer(state = initialState.company, action) {
    switch (action.type) {

        case 'SIGN_UP_INFO':
            return{
                ...state,
                ...action.value
            }

        case 'COMPANY_INFO':
            return{
                ...state,
                ...action.value
            }

        case 'RECOUNTS':
            return {
                ...state,
                recounts: action.value
            }

        default:
            return {
                ...state
            };
    }
}
