import React from 'react';
import gql from 'graphql-tag';
import moment from 'moment';

const reducer = (state, action) => {
	const actions = {
		LOADING: () => ({
			...state,
			status: 'LOADING',
			errorText: ''
		}),
		ERROR: () => ({
			...state,
			status: 'ERROR',
			errorText: state.payload
		}),
		SUCCESS: () => ({
			...state,
			status: 'SUCCESS',
			errorText: ''
		}),
	};

	return actions[action.type] ? actions[action.type]() : state;
};

const checkValidExpirationDate = string => string.length === 10;

const getStoredDate = participantId => {
	const storedDate = sessionStorage.getItem(`stored_expiration_date_${participantId}`);

	if (storedDate) {
		return moment(storedDate);
	}
	return moment();
};

const useClaveJusticia = ({ client, participantId, token }) => {
	const [{ status }, dispatch] = React.useReducer(reducer, { status: 'SUCCESS', errorText: '' });
	const [expirationDate, setExpirationDate] = React.useState((getStoredDate(participantId)));
	const [expirationDateError, setExpirationDateError] = React.useState('');

	const sendClaveJusticia = async type => {
		if (!expirationDate) {
			return setExpirationDateError('Es necesario introducir la fecha de expiración');
		}

		const formatedExpirationDate = moment(expirationDate).format('DD-MM-yyyy').replace(/\//g, '-');

		if (!checkValidExpirationDate(formatedExpirationDate)) {
			return setExpirationDateError('Fecha de expiración no válida');
		}

		setExpirationDateError('');

		const response = await client.mutate({
			mutation: gql`
				mutation SendClaveJusticia(
					$expirationDate: String!,
					$type: String!,
					$token: String,
					$participantId: Int
				) {
					sendClaveJusticiaToParticipant(
						expirationDate: $expirationDate,
						type: $type,
						token: $token,
						participantId: $participantId
					) {
						success
						message
					}
				}
			`,
			variables: {
				type,
				expirationDate: formatedExpirationDate,
				token,
				participantId
			}
		});


		if (response.data.sendClaveJusticiaToParticipant.success) {
			dispatch({ type: 'SUCCESS' });
			sessionStorage.setItem(`stored_expiration_date_${participantId}`, expirationDate.format('L'));
			return true;
		}

		if (response.data.sendClaveJusticiaToParticipant.message === 'Invalid expiration date') {
			setExpirationDateError('La fecha de expiración no coincide');
		}

		return false;
	};

	return {
		status,
		sendClaveJusticia,
		setExpirationDate,
		expirationDate,
		expirationDateError
	};
};

export default useClaveJusticia;
