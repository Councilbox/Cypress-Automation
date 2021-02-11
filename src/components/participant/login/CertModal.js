import React from 'react';
import { AlertConfirm } from '../../../displayComponents';

const reducer = (state, action) => {
	const actions = {
		SUCCESS: () => ({
			...state,
			status: 'SUCCESS'
		}),
		ERROR: () => ({
			...state,
			status: 'ERROR',
			message: action.payload
		})
	};

	return actions[action.type] ? actions[action.type]() : state;
};


const CertModal = ({ open, participant, handleSuccess }) => {
	const [{ status, message }, dispatch] = React.useReducer(reducer, { status: 'LOADING' });

	const getData = async () => {
		const response = await fetch(`https://api.pre.councilbox.com:5001/participant/${participant.id}`);
		const json = await response.json();

		if (json.success) {
			dispatch({ type: 'SUCCESS' });
		} else {
			dispatch({ type: 'ERROR', payload: json.error });
		}
	};

	React.useEffect(() => {
		if (open) {
			getData();
		}
	}, [open]);


	return (
		<AlertConfirm
			open={open}
			title="Prueba"
			bodyText={
				status === 'LOADING' ?
					'CARGANDO'
					: status === 'SUCCESS' ?
						<>
Esto furrula entrar?
							<div style={{ backgroundColor: 'red' }} onClick={handleSuccess}>
VAMOS PA DENTRO
							</div>
						</>
						: <>
Error!
							<div>
								{message}
							</div>
						</>
			}
		/>
	);
};

export default CertModal;
