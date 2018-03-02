import initialState from './initialState';

export default function companyReducer(state = initialState.company, action) {
    switch (action.type) {

        case 'SIGN_UP_INFO':
            return{
                ...state,
                ...action.value
            }

        case 'COMPANIES':
            return{
                ...state,
                list: action.value,
                selected: 0
            }

        case 'CHANGE_SELECTED':
            console.log(action.value);
            return {
                ...state,
                selected: action.value
            }

        case 'RECOUNTS':
            return {
                ...state,
                recounts: action.value
            }

        case 'DRAFTS':
            return {
                ...state,
                drafts: action.value
            }

        default:
            return {
                ...state
            };
    }
}
