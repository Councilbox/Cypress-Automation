import React from 'react';
import { flowRight as compose } from 'lodash';
import { graphql } from 'react-apollo';
import { AlertConfirm } from '../../../displayComponents';
import { addRepresentative as addRepresentativeMutation } from '../../../queries';
import RepresentativeForm from '../participants/RepresentativeForm';
import { languages } from '../../../queries/masters';
import { useOldState } from '../../../hooks';
import { checkValidEmail } from '../../../utils';
import { checkValidPhone } from '../../../utils/validation';

const newRepresentativeInitialValues = {
	language: 'es',
	personOrEntity: 0,
	name: '',
	surname: '',
	position: '',
	initialState: 0,
	dni: '',
	email: '',
	phone: ''
};

const AddRepresentativeModal = ({ translate, participant, ...props }) => {
	const [state, setState] = useOldState({
		success: '',
		errors: {},
		representative: {
			...newRepresentativeInitialValues
		}
	});

	const resetForm = () => {
		setState({
			representative: {
				...newRepresentativeInitialValues
			}
		});
	};

	const checkRequiredFields = () => {
		const errors = {};

		if (!state.representative.name) {
			errors.name = translate.required_field;
		}

		if (!state.representative.surname) {
			errors.surname = translate.required_field;
		}

		if (!state.representative.dni) {
			errors.dni = translate.required_field;
		}

		if (!state.representative.email) {
			errors.email = translate.required_field;
		} else if (!checkValidEmail(state.representative.email)) {
			errors.email = translate.tooltip_invalid_email_address;
		}

		if (!state.representative.phone) {
			errors.email = translate.required_field;
		} else if (!checkValidPhone(state.representative.phone)) {
			errors.email = translate.invalid_phone;
		}

		setState({
			errors
		});

		return Object.keys(errors).length === 0;
	};

	const close = () => {
		props.requestClose();
		resetForm();
	};

	const addRepresentative = async () => {
		if (checkRequiredFields()) {
			const response = await props.addRepresentative({
				variables: {
					representative: state.representative,
					participantId: participant.id
				}
			});
			if (response.data.addRepresentative) {
				if (response.data.addRepresentative.success) {
					props.refetch();
					close();
				}
			}
			if (response.errors) {
				if (response.errors[0].message === 'Email already used') {
					setState({
						errors: {
							email: translate.repeated_email
						}
					});
				}
			}
		}
	};

	const updateRepresentative = object => {
		setState({
			representative: {
				...state.representative,
				...object
			}
		});
	};

	function renderReminderBody() {
		if (state.sending) {
			return <div>{translate.sending_convene_reminder}</div>;
		}

		return (
			<RepresentativeForm
				translate={translate}
				state={state.representative}
				updateState={updateRepresentative}
				errors={state.errors}
				languages={props.data.languages}
			/>
		);
	}

	return (
		<AlertConfirm
			requestClose={close}
			open={props.show}
			acceptAction={addRepresentative}
			buttonAccept={translate.send}
			buttonCancel={translate.close}
			bodyText={renderReminderBody()}
			title={participant.representative ? translate.change_representative : translate.add_representative}
		/>
	);
};

export default compose(
	graphql(addRepresentativeMutation, {
		name: 'addRepresentative',
		options: {
			errorPolicy: 'all'
		}
	}),
	graphql(languages)
)(AddRepresentativeModal);
