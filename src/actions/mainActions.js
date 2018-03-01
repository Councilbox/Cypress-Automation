import CouncilboxApi from '../api/CouncilboxApi';
import { getCompanyInfo } from './companyActions';

export let language = 'es';

export const login = (creds) => {
    return (dispatch) => {
        return CouncilboxApi.login(creds).then(response => {
            if(response.token){
                dispatch({type: 'LOGIN_SUCCESS'});
                sessionStorage.setItem('token', response.token);                
                dispatch(setUserData(response.token));
                dispatch(getCompanyInfo());             
            }else{
                return ({type: 'LOGIN_FAILED'});
            }
        }).catch(error => {
            console.log(error);
        });
    }
};

export const loginSuccess = (token) => {
    return (dispatch) => {
        sessionStorage.setItem('token', token);
        dispatch(setUserData(token));
        dispatch(getCompanyInfo());
        dispatch({type: 'LOGIN_SUCCESS'});        
    }
};


export const loadingFinished = () => (
    {type: 'LOADING_FINISHED'}
);


export const setUserData = (token) => {
    const encodedProfile = token.split('.')[1];
    const profile = JSON.parse(atob(encodedProfile));
    return {type: 'SET_USER_DATA', value: profile.data};
}


export const logout = () => {
    sessionStorage.clear();
    return({type: 'LOGOUT'});
};

export const setLanguage = (language) => {
    return async (dispatch) => {
        const translations = await CouncilboxApi.getTranslations(language);
        const translationObject = {};
        translations.forEach(translation => {
            translationObject[translation.label] = translation.text;
        });
        dispatch({type: 'LOADED_LANG', value: translationObject});
        //store.dispatch(loadTranslations(translationsObject));
    }
}

export const createUser = (data) => {

}

export const userCreatedSuccess = () => {
    return ({
        type: 'USER_CREATED'
    });
}