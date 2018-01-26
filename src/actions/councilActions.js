import CouncilboxApi from "../api/CouncilboxApi";
import { bHistory } from '../containers/App';

export const saveSignUpInfo = (info) => {
    return({
        type: 'SIGN_UP_INFO',
        value: info
    });
}

export const getData = (councilInfo) => {
    return (dispatch) => {
        return CouncilboxApi.getData(councilInfo).then(response => {
            dispatch({type: 'COUNCIL_DATA', value: response});
        }).catch(error => {
            console.log(error);
        })
    }
}

export const saveCouncilData = (councilInfo) => {
    return async (dispatch) => {
        try {
            const response = await CouncilboxApi.saveCouncilData(councilInfo);
            console.log(response); 
        }catch (error) {
            console.log(error);
        }

    }
} 

export const getParticipants = (councilID) => {
    return async (dispatch) => {
        try {
            const response = await CouncilboxApi.getParticipants(councilID);
            dispatch({type: 'COUNCIL_PARTICIPANTS', value: response})
        }catch(error) {
            console.log(error);
        }
    }
}

export const sendNewParticipant = (participant) => {
    return async (dispatch) => {
        try {
            const response = await CouncilboxApi.sendNewParticipant(participant);
            if(response.code === 200){
                dispatch(getParticipants(participant.data.participant.council_id));
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export const deleteParticipant = (participantInfo) => {
    return async (dispatch) => {
        try {
            const response = await CouncilboxApi.deleteParticipant(participantInfo);
            if(response.code === 200){
                dispatch(getParticipants(participantInfo.data.council_id));
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export const sendCensusChange = (info) => {
    return async (dispatch) => {
        try {
            const response = await CouncilboxApi.sendCensusChange(info);
            if(response.code === 200){
                dispatch(getParticipants(info.council_id));
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export const create = (companyID) => {
    return (dispatch) => {
        return CouncilboxApi.createCouncil(companyID).then(response => {
            console.log(response);
            dispatch({type: 'COUNCIL_DATA', value: response});
            bHistory.push(`/councils/${response.council.company_id}/${response.council.id}`);
        }).catch(error => {
            console.log(error);
        })
    }
}