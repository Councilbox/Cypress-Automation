import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import gql from 'graphql-tag';
import { AlertConfirm } from '../../../../displayComponents';
import TranslatorForm from '../../participants/TranslatorForm';
import { languages } from '../../../../queries/masters';
import { checkValidEmail } from '../../../../utils/validation';
import { checkUniqueCouncilEmails } from '../../../../queries/councilParticipant';
import { INPUT_REGEX } from '../../../../constants';

const newGuestInitialValues = {
	language: 'es',
	personOrEntity: 0,
	name: '',
	surname: '',
	position: '',
	dni: '',
	email: '',
	phone: '',
	initialState: 0
};

const AddTranslatorModal = ({ show, council, translate, refetch, requestClose, client, ...props }) => {
	const [state, setState] = React.useState({
		success: '',
		errors: {},
		guest: {
			...newGuestInitialValues
		}
	});

	const checkRequiredFields = async () => {
		const testPhone = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;

		const errors = {
			name: '',
			surname: '',
			dni: '',
			email: '',
			phone: ''
		};
		let hasError = false;
		const { guest } = state;


		const regex = INPUT_REGEX;

		if (!(regex.test(guest.name)) || !guest.name.trim()) {
			errors.name = translate.invalid_field;
			hasError = true;
		}

		if (!guest.phone) {
			hasError = true;
			errors.phone = translate.required_field;
		}

		if (guest.phone && guest.phone !== '-') {
			if (!testPhone.test(guest.phone)) {
				hasError = true;
				errors.phone = translate.invalid_field;
			}
		}

		if (!guest.email) {
			errors.email = translate.required_field;
			hasError = true;
		} else if (!checkValidEmail(guest.email)) {
			errors.email = translate.valid_email_required;
			hasError = true;
		} else {
			const response = await client.query({
				query: checkUniqueCouncilEmails,
				variables: {
					councilId: council.id,
					emailList: [guest.email]
				}
			});
			if (!response.data.checkUniqueCouncilEmails.success) {
				errors.email = translate.register_exists_email;
				hasError = true;
			}
		}

		setState({
			...state,
			errors: {
				...errors
			}
		});

		return hasError;
	};

	const resetForm = () => {
		setState({
			success: '',
			errors: {},
			guest: {
				...newGuestInitialValues
			}
		});
	};

	const close = () => {
		requestClose();
		resetForm();
	};


	const sendAddTranslator = async () => {
		if (!await checkRequiredFields()) {
			const response = await client.mutate({
				mutation: gql`
					mutation AddTranslator($translator: LiveParticipantInput) {
						addTranslator(translator: $translator) {
							success
							message
						}
					}
				`,
				variables: {
					translator: {
						...state.guest,
						position: translate.translator,
						councilId: council.id
					}
				}
			});
			if (response) {
				if (response.data.addTranslator.success) {
					refetch();
					close();
				} else if (response.data.addTranslator.message === '601') {
					setState({
						errors: {
							email: translate.repeated_email
						}
					});
				}
			}
		}
	};

	const updateGuest = object => {
		setState({
			...state,
			guest: {
				...state.guest,
				...object
			}
		});
	};


	const renderReminderBody = () => {
		if (state.sending) {
			return <div>{translate.sending_convene_reminder}</div>;
		}
		return (
			<div style={{ maxWidth: '850px' }}>
				<TranslatorForm
					translate={translate}
					representative={state.guest}
					updateState={updateGuest}
					errors={state.errors}
					languages={props.data.languages}
				/>
			</div>
		);
	};

	return (
		<AlertConfirm
			requestClose={close}
			open={show}
			acceptAction={sendAddTranslator}
			buttonAccept={translate.send}
			buttonCancel={translate.close}
			bodyText={renderReminderBody()}
			title={translate.add_translator}
		/>
	);
};

export default compose(
	graphql(languages)
)(withApollo(AddTranslatorModal));

