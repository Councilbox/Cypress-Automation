import CouncilboxApi from "../api/CouncilboxApi";
import {history} from '../containers/App';

export const saveSignUpInfo = (info) => {
    return({
        type: 'SIGN_UP_INFO',
        value: info
    });
}

export const getCompanyInfo = () => {
    return (dispatch) => {
        return CouncilboxApi.getCompany().then(response => {
            dispatch({type: 'COMPANY_INFO', value: response[0]});
        })
    }
}

export const getRecount = (companyID) => {
    return (dispatch) => {
        return CouncilboxApi.getRecount(companyID).then(response => {
            dispatch({type: 'RECOUNTS', value: response});
        });
    }
}

export const sendNewCompany = (company) => {
    return (dispatch) => {
        return CouncilboxApi.createCompany(company).then(response => {
            if(response){
                history.push('/welcome');
            }
        }).catch(error => {
            if(error.code === 602){
                //Aqui hay que poner funcionalidad para error de usuario existe, renderizando la página con el 
                //nombre de usuario y señalando el error
                console.log('error 602');
            }
            if(error.code === 603){
                //Aqui hay que poner funcionalidad para error de email existe, renderizando la página con el 
                //email y señalando el error
                console.log('error 603');
            }
            //Control de cualquier otro error de servidor
            console.log(error);
        });
    }
} 