import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { AlertConfirm } from '../../../../displayComponents';
import { addGuest } from '../../../../queries';
import RepresentativeForm from '../../participants/RepresentativeForm';
import { languages } from '../../../../queries/masters';
import { checkValidEmail, checkValidPhone } from '../../../../utils/validation';
import { checkUniqueCouncilEmails } from '../../../../queries/councilParticipant';

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

class AddGuestModal extends React.Component {
	state = {
		success: '',
		errors: {},
		guest: {
			...newGuestInitialValues
		}
	};

	initialState = this.state;

	close = () => {
		this.props.requestClose();
		this.resetForm();
	};

	addGuest = async () => {
		if (!await this.checkRequiredFields()) {
			const response = await this.props.addGuest({
				variables: {
					guest: {
						...this.state.guest,
						position: this.props.translate.guest,
						councilId: this.props.council.id
					}
				}
			});
			if (response) {
				this.props.refetch();
				this.close();
			}
		}
	};

	checkRequiredFields = async emailOnly => {
		const errors = {
			name: '',
			surname: '',
			dni: '',
			email: '',
			phone: ''
		};
		let hasError = false;
		const { guest } = this.state;
		const { translate } = this.props;


		if (!guest.email) {
			errors.email = translate.required_field;
			hasError = true;
		} else if (!checkValidEmail(guest.email)) {
			errors.email = translate.valid_email_required;
			hasError = true;
		} else {
			const response = await this.props.client.query({
				query: checkUniqueCouncilEmails,
				variables: {
					councilId: this.props.council.id,
					emailList: [guest.email]
				}
			});
			if (!response.data.checkUniqueCouncilEmails.success) {
				errors.email = translate.register_exists_email;
				hasError = true;
			}
		}

		if (!emailOnly) {
			if (!guest.name) {
				errors.name = translate.required_field;
				hasError = true;
			}

			if (!guest.surname) {
				errors.surname = translate.required_field;
				hasError = true;
			}

			if (!guest.dni) {
				errors.dni = translate.required_field;
				hasError = true;
			}

			if (!guest.phone) {
				errors.phone = translate.required_field;
				hasError = true;
			} else if (!checkValidPhone(guest.phone)) {
				errors.phone = translate.invalid_phone;
				hasError = true;
			}
		}

		this.setState({ errors });

		return hasError;
	}

	resetForm = () => {
		this.setState(this.initialState);
	};

	updateGuest = object => {
		this.setState({
			guest: {
				...this.state.guest,
				...object
			}
		});
	};

	emailKeyUp = () => {
		clearTimeout(this.timeout);
		this.timeout = setTimeout(() => {
			this.checkRequiredFields(true);
			clearTimeout(this.timeout);
		}, 400);
	}

	renderReminderBody() {
		const { translate } = this.props;

		if (this.state.sending) {
			return <div>{translate.sending_convene_reminder}</div>;
		}

		return (
			<div style={{ maxWidth: '850px' }}>
				<RepresentativeForm
					guest={true}
					requiredPhone
					checkEmail={this.emailKeyUp}
					translate={this.props.translate}
					state={this.state.guest}
					updateState={this.updateGuest}
					errors={this.state.errors}
					languages={this.props.data.languages}
				/>
			</div>
		);
	}

	render() {
		const { translate } = this.props;

		return (
			<AlertConfirm
				requestClose={this.close}
				open={this.props.show}
				acceptAction={this.addGuest}
				buttonAccept={translate.send}
				buttonCancel={translate.close}
				bodyText={this.renderReminderBody()}
				title={translate.add_guest}
			/>
		);
	}
}

export default compose(
	graphql(addGuest, {
		name: 'addGuest',
		options: {
			errorPolicy: 'all'
		}
	}),
	graphql(languages)
)(withApollo(AddGuestModal));


