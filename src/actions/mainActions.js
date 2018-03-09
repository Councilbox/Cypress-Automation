import { getCompanies } from './companyActions';
import { client } from '../containers/App';
import { getMe, getTranslations } from '../queries';

export let language = 'es';

export const loginSuccess = (token) => {
    return (dispatch) => {
        sessionStorage.setItem('token', token);
        dispatch(setUserData(token));
        dispatch(getCompanies());
        dispatch({type: 'LOGIN_SUCCESS'});        
    }
};

export const loadingFinished = () => (
    {type: 'LOADING_FINISHED'}
);

export const setUserData = (token) => {
    return async (dispatch) => {
        const response = await client.query({query: getMe});
        dispatch({type: 'SET_USER_DATA', value: response.data.me});
        dispatch(getCompanies(response.data.me.id));
    }
}


export const logout = () => {
    sessionStorage.clear();
    return({type: 'LOGOUT'});
};

export const setLanguage = (language) => {
    return async (dispatch) => {
        const response = await client.query({query: getTranslations, variables: { language: language }});
        const translationObject = {};
        response.data.translations.forEach(translation => {
            translationObject[translation.label] = translation.text;
        });
        dispatch({type: 'LOADED_LANG', value: translationObject});
    }
}