import CouncilboxApi from '../api/CouncilboxApi';
import { bHistory } from '../containers/App';

export const saveSignUpInfo = info => ({
		type: 'SIGN_UP_INFO',
		value: info
	});

export const getData = councilInfo => dispatch => CouncilboxApi.getData(councilInfo)
			.then(response => {
				dispatch({
					type: 'COUNCIL_DATA',
					value: response
				});
			})
			.catch(error => {
				throw error;
			});

export const saveAttachment = file => dispatch => CouncilboxApi.saveAttachment(file)
			.then(response => response)
			.catch(error => {
				throw error;
			});

export const deleteAttachment = attachment => dispatch => CouncilboxApi.deleteAttachment(attachment)
			.then(response => {
				if (response.code === 200) {
					dispatch(
						getData({
							companyID: attachment.company_id,
							councilID: attachment.council_id,
							step: 4
						})
					);
				}
			})
			.catch(error => {
				throw error;
			});

export const saveCouncilData = councilInfo => async dispatch => {
		try {
			const response = await CouncilboxApi.saveCouncilData(councilInfo);
			return response;
		} catch (error) {
			throw error;
		}
	};

export const getParticipants = councilID => async dispatch => {
		try {
			const response = await CouncilboxApi.getParticipants(councilID);
			dispatch({
				type: 'COUNCIL_PARTICIPANTS',
				value: response
			});
		} catch (error) {
			throw error;
		}
	};

export const sendNewParticipant = participant => async dispatch => {
		try {
			const response = await CouncilboxApi.sendNewParticipant(
				participant
			);
			if (response.code === 200) {
				dispatch(
					getParticipants(participant.data.participant.council_id)
				);
			}
		} catch (error) {
			throw error;
		}
	};

export const deleteParticipant = participantInfo => async dispatch => {
		try {
			const response = await CouncilboxApi.deleteParticipant(
				participantInfo
			);
			if (response.code === 200) {
				dispatch(getParticipants(participantInfo.data.council_id));
			}
		} catch (error) {
			throw error;
		}
	};

export const sendCensusChange = info => async dispatch => {
		try {
			const response = await CouncilboxApi.sendCensusChange(info);
			if (response.code === 200) {
				dispatch(getParticipants(info.council_id));
			}
		} catch (error) {
			throw error;
		}
	};

export const create = (companyID, type) => dispatch => CouncilboxApi.createCouncil(companyID)
			.then(councilId => {
				//dispatch({type: 'COUNCIL_DATA', value: response});
				bHistory.push(`/company/${companyID}/council/${councilId}`);
			})
			.catch(error => {
				throw error;
			});
