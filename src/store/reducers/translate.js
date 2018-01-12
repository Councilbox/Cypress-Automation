import initialState from './initialState';
// import errorCodes from './errorCodes';

export default function translateReducer(state = initialState.translate, action) {
    switch (action.type) {
        case 'TRANSLATE_DONE':
            return {
                ...state,
                loaded: true
            }
        default:
            return {
                ...state
            }
    }
}