// import CouncilboxApi from '../api/CouncilboxApi';
//import langs from '../lang/langIndex';
//import { store } from '../App';

export let language = 'es';

export const login = (creds) => {
    console.log('intentando login');
	return({type: 'LOGIN_SUCCESS'});
};

export const logout = (creds) => {
    console.log('intentando login');
    return({type: 'LOGOUT'});
};

export const createUser = (data) => {

}

export const userCreatedSuccess = () => {
    return ({
        type: 'USER_CREATED'
    });
}