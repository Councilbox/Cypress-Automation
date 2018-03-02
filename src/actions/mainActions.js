import CouncilboxApi from '../api/CouncilboxApi';
import { getCompanies } from './companyActions';
import { client } from '../containers/App';
import gql from 'graphql-tag';

export let language = 'es';

export const login = (creds) => {
    return (dispatch) => {
        return CouncilboxApi.login(creds).then(response => {
            if(response.token){
                dispatch({type: 'LOGIN_SUCCESS'});
                sessionStorage.setItem('token', response.token);                
                dispatch(setUserData(response.token));
                dispatch(getCompanies());             
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
        dispatch(getCompanies());
        dispatch({type: 'LOGIN_SUCCESS'});        
    }
};


export const loadingFinished = () => (
    {type: 'LOADING_FINISHED'}
);

const me = gql`
    query Me{
        me {
            name
            surname
            id
        }
    }
`;



export const setUserData = (token) => {
    return async (dispatch) => {
        const response = await client.query({query: me});
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