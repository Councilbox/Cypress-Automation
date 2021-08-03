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
		VALIDATION_SUCCESS: () => ({
			...state,
			status: 'VALIDATION_SUCCESS',
			errorText: ''
		}),
		VALIDATION_FAILED: () => ({
			...state,
			status: 'VALIDATION_FAILED'
		})
	};

	return actions[action.type] ? actions[action.type]() : state;
};

const getClaveErrorText = errorMessage => {
	const errors = {
		'Invalid expiration date': 'La fecha de validez o fecha de expedición no coinciden con la de su documento',
		'User not registered': 'No se ha podido enviar porque no está de alta en el sistema de cl@ve pin',
		'User blocked': 'No se ha podido enviar porque el usuario está bloqueado por exceder el número máximo de intentos fallidos diarios, vuelva a intentarlo mañana',
		default: 'Ha ocurrido un error al intentar enviar la clave'
	};

	return errors[errorMessage] || errors.default;
};


const checkValidExpirationDate = string => string.length === 10;

const getStoredDate = participantId => {
	const storedDate = sessionStorage.getItem(`stored_expiration_date_${participantId}`);

	if (storedDate) {
		return moment(storedDate, 'DD/MM/yyyy');
	}
	return moment();
};

const useClaveJusticia = ({ client, participantId, token }) => {
	const [{ status }, dispatch] = React.useReducer(reducer, { status: 'IDDLE', errorText: '' });
	const [expirationDate, setExpirationDate] = React.useState((getStoredDate(participantId)));
	const [expirationDateError, setExpirationDateError] = React.useState('');

	const checkUserIsRegistered = async dni => {
		const response = await client.query({
			query: gql`
				query checkParticipantIsRegisteredClavePin($dni: String!){
					checkParticipantIsRegisteredClavePin(dni: $dni) {
						success
						message
					}
				}
			`,
			variables: {
				dni
			}
		});

		if (response.errors) {
			return {
				success: false,
				message: response.errors[0].message
			};
		}

		if (response.data?.checkParticipantIsRegisteredClavePin) {
			return response.data?.checkParticipantIsRegisteredClavePin;
		}
	};

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

		setExpirationDateError(getClaveErrorText(response.data.sendClaveJusticiaToParticipant.message));
		return false;
	};

	const checkClaveJusticia = async pin => {
		dispatch({ type: 'LOADING' });
		const response = await client.mutate({
			mutation: gql`
				mutation CheckClaveJusticia(
					$pin: String!
					$participantId: Int!
				) {
					checkClaveJusticia(
						pin: $pin
						participantId: $participantId
					) {
						success
						message
					}
				}
			`,
			variables: {
				pin,
				participantId
			}
		});

		if (response.data.checkClaveJusticia.success) {
			dispatch({ type: 'VALIDATION_SUCCESS' });
			return true;
		}

		dispatch({ type: 'VALIDATION_FAILED' });
		return false;
	};


	return {
		status,
		sendClaveJusticia,
		setExpirationDate,
		checkClaveJusticia,
		expirationDate,
		checkUserIsRegistered,
		expirationDateError
	};
};

export default useClaveJusticia;
