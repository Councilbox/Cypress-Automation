import { getCompanies } from './companyActions';
import { client } from '../containers/App';
import { getMe, getTranslations } from '../queries';

export let language = 'es';

export const loginSuccess = (token) => {
    return (dispatch) => {
        sessionStorage.setItem('token', token);
        dispatch(initUserData());
        dispatch(getCompanies());
        dispatch({type: 'LOGIN_SUCCESS'});        
    }
};

export const loadingFinished = () => (
    {type: 'LOADING_FINISHED'}
);

export const initUserData = () => {
    return async (dispatch) => {
        const response = await client.query({query: getMe, errorPolicy: 'all'});
        if(!response.errors){
            dispatch({type: 'SET_USER_DATA', value: response.data.me});
            dispatch(getCompanies(response.data.me.id));
            dispatch(setLanguage(response.data.me.preferred_language));
        }else{
            response.errors[0].code === 440 && sessionStorage.removeItem('token');
        }
    }
}

export const setUserData = (user) => {
    return (dispatch) => {
        console.log(user);
        dispatch({type: 'SET_USER_DATA', value: user});
        dispatch(setLanguage(user.preferred_language));
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
        dispatch({type: 'LOADED_LANG', value: translationObject, selected: language});
    }
}