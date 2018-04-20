import CouncilboxApi from "../api/CouncilboxApi";
import { bHistory, client, store } from '../containers/App';
import { loadingFinished } from './mainActions';
import { companies } from '../queries';

export const saveSignUpInfo = (info) => {
    return({
        type: 'SIGN_UP_INFO',
        value: info
    });
}

export const getCompanies = (userId) => {
    return async (dispatch) => {
        if(userId){
            const response = await client.query({query: companies, variables: { userId: userId}});
            dispatch({type: 'COMPANIES', value: response.data.userCompanies.map((item) => {return{...item.company}})})
            dispatch(loadingFinished());
        }
    }
}

export const setCompany = (company) => {
    const index = store.getState().companies.selected;
    const companies = [...store.getState().companies.list];
    companies[index] = company;
    return({type: 'COMPANIES', value: companies});
}

export const changeCompany = (index) => (
    { type: 'CHANGE_SELECTED', value: index}
)

export const getRecount = (companyID) => {
    return (dispatch) => {
        return CouncilboxApi.getRecount(companyID).then(response => {
            dispatch({type: 'RECOUNTS', value: response});
        });
    }
}

export const getCouncils = (info) => {
    return (dispatch) => {
        return CouncilboxApi.getCouncils(info).then(response => {
            if(response){
                dispatch({type: 'DRAFTS', value: response});
            }
        })
    }
};

/*export const sendNewCompany = (company) => {
    return (dispatch) => {
        return CouncilboxApi.createCompany(company).then(response => {
            if(response){
                bHistory.push('/welcome');
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
} */