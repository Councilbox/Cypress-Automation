import CouncilboxApi from '../api/CouncilboxApi';

export let language = 'es';

export const login = (creds) => {
    return (dispatch) => {
        return CouncilboxApi.login(creds).then(response => {
            if(response.token){
                dispatch({type: 'LOGIN_SUCCESS'});
                dispatch(setUserData(response.token));                
                sessionStorage.setItem('token', response.token);
            }else{
                return ({type: 'LOGIN_FAILED'});
            }
        }).catch(error => {
            console.log(error);
        });
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
        const translationObject = {
            [language]: {}
        };
        translations.forEach(translation => {
            (translationObject[language])[translation.label] = translation.text;
        });
        console.log('se cargó el idioma');
        console.log(translationObject);
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