import { getCompanies } from './companyActions';
import { client } from '../containers/App';
import { getMe, getTranslations, login } from '../queries';
import moment from 'moment';

export let language = 'es';
let interval = null;

export const loginSuccess = (token, user, password) => {
    return (dispatch) => {
        sessionStorage.setItem('token', token);
        dispatch(initUserData());
        dispatch(getCompanies());
        dispatch({type: 'LOGIN_SUCCESS'}); 
        interval = setInterval(() => refreshToken(user, password), 15000000);       
    }
};

const refreshToken = async (user, password) => {
    const response = await client.mutate({
        mutation: login, 
        errorPolicy: 'all',
        variables: {
            email: user,
            password: password
        }
    });
    if(!response.errors){
        sessionStorage.setItem('token', response.data.login.token);
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
};

export const setUserData = (user) => {
    return (dispatch) => {
        console.log(user);
        dispatch({type: 'SET_USER_DATA', value: user});
        dispatch(setLanguage(user.preferred_language));
    }
};


export const logout = () => {
    sessionStorage.clear();
    clearInterval(interval);
    return({type: 'LOGOUT'});
};

export const setLanguage = (language) => {
    return async (dispatch) => {
        const response = await client.query({query: getTranslations, variables: { language: language }});
        const translationObject = {};
        response.data.translations.forEach(translation => {
            translationObject[translation.label] = translation.text;
        });
        let locale = language;
        if(language === 'cat' || language === 'gal'){
            locale = 'es';
        }
        moment.locale(locale, {
            months: translationObject.datepicker_months.split(','),
            monthsShort: translationObject.datepicker_months.split(',').map(month => month.substring(0,3))
        });
        dispatch({type: 'LOADED_LANG', value: translationObject, selected: language});
    }
};