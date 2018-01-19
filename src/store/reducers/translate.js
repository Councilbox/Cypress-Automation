import initialState from './initialState';
// import errorCodes from './errorCodes';

export default function translateReducer(state = initialState.translate, action) {
    switch (action.type) {
        case 'LOADED_LANG':
            console.log('translate reducer');
            return {
                ...action.value
            }
        default:
            return {
                ...state
            }
    }
}