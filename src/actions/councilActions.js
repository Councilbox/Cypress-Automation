import CouncilboxApi from "../api/CouncilboxApi";
import { bHistory } from "../containers/App";

export const saveSignUpInfo = info => {
	return {
		type: "SIGN_UP_INFO",
		value: info
	};
};

export const getData = councilInfo => {
	return dispatch => {
		return CouncilboxApi.getData(councilInfo)
			.then(response => {
				dispatch({
					type: "COUNCIL_DATA",
					value: response
				});
			})
			.catch(error => {
				console.log(error);
			});
	};
};

export const saveAttachment = file => {
	return dispatch => {
		return CouncilboxApi.saveAttachment(file)
			.then(response => {
				console.log(response);
			})
			.catch(error => {
				console.log(error);
			});
	};
};

export const deleteAttachment = attachment => {
	return dispatch => {
		return CouncilboxApi.deleteAttachment(attachment)
			.then(response => {
				console.log(response);
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
				console.log(error);
			});
	};
};

export const saveCouncilData = councilInfo => {
	return async dispatch => {
		try {
			const response = await CouncilboxApi.saveCouncilData(councilInfo);
			console.log(response);
		} catch (error) {
			console.log(error);
		}
	};
};

export const getParticipants = councilID => {
	return async dispatch => {
		try {
			const response = await CouncilboxApi.getParticipants(councilID);
			dispatch({
				type: "COUNCIL_PARTICIPANTS",
				value: response
			});
		} catch (error) {
			console.log(error);
		}
	};
};

export const sendNewParticipant = participant => {
	return async dispatch => {
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
			console.log(error);
		}
	};
};

export const deleteParticipant = participantInfo => {
	return async dispatch => {
		try {
			const response = await CouncilboxApi.deleteParticipant(
				participantInfo
			);
			if (response.code === 200) {
				dispatch(getParticipants(participantInfo.data.council_id));
			}
		} catch (error) {
			console.log(error);
		}
	};
};

export const sendCensusChange = info => {
	return async dispatch => {
		try {
			const response = await CouncilboxApi.sendCensusChange(info);
			if (response.code === 200) {
				dispatch(getParticipants(info.council_id));
			}
		} catch (error) {
			console.log(error);
		}
	};
};

export const create = (companyID, type) => {
	return dispatch => {
		return CouncilboxApi.createCouncil(companyID)
			.then(councilId => {
				//dispatch({type: 'COUNCIL_DATA', value: response});
				bHistory.push(`/company/${companyID}/${type}/${councilId}`);
			})
			.catch(error => {
				console.log(error);
			});
	};
};
