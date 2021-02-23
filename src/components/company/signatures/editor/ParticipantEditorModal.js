import React from 'react';
import { graphql, compose, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { AlertConfirm } from '../../../../displayComponents';
import SignatureParticipantForm from './SignatureParticipantForm';
import { languages } from '../../../../queries/masters';
import { checkValidEmail } from '../../../../utils/validation';
import { removeTypenameField } from '../../../../utils/CBX';

const checkSignatureEmail = gql`
	query CheckSignatureParticipantEmail($email: String!, $signatureId: Int!){
		checkSignatureParticipantEmail(email: $email, signatureId: $signatureId){
			success
		}
	}
`;

class ParticipantEditorModal extends React.Component {
state = {
	data: {
		name: '',
		surname: '',
		dni: '',
		language: 'es',
		position: '',
		email: '',
		phone: '',
		signatureId: this.props.signature.id
	},
	errors: {}
}

initialState = this.state;

componentDidUpdate(prevProps) {
	if (prevProps.open && !this.props.open) {
		this.setState(this.initialState);
	}
}

static getDerivedStateFromProps(nextProps, prevState) {
	if (!nextProps.data.loading && nextProps.data.signatureParticipant) {
		const participant = removeTypenameField(nextProps.data.signatureParticipant);
		if (participant.id !== prevState.data.id) {
			return {
				data: participant
			};
		}
	}

	return null;
}

checkEmailAvailability = async () => {
	const response = await this.props.client.query({
		query: checkSignatureEmail,
		variables: {
			email: this.state.data.email,
			signatureId: this.props.signature.id
		},
		errorPolicy: 'all'
	});

	return response.data.checkSignatureParticipantEmail.success;
}

updateState = object => {
	this.setState({
		data: {
			...this.state.data,
			...object
		}
	});
}

updateSignatureParticipant = async () => {
	if (!await this.checkRequiredFields()) {
		const response = await this.props.updateSignatureParticipant({
			variables: {
				participant: {
					...this.state.data
				}
			}
		});

		if (response.data.updateSignatureParticipant.success) {
			this.props.refetch();
			this.props.requestClose();
		}
	}
}

async checkRequiredFields() {
	const errors = {
		name: '',
		surname: '',
		dni: '',
		position: '',
		phone: '',
		email: ''
	};

	let hasError = false;
	const { translate } = this.props;
	const { data } = this.state;

	if (!data.name) {
		hasError = true;
		errors.name = translate.field_required;
	}

	if (!data.surname) {
		hasError = true;
		errors.surname = translate.field_required;
	}

	if (!data.dni) {
		hasError = true;
		errors.dni = translate.field_required;
	}

	if (!data.email) {
		hasError = true;
		errors.email = translate.field_required;
	} else if (!checkValidEmail(data.email)) {
		hasError = true;
		errors.email = translate.valid_email_required;
	} else if (data.email !== this.props.data.signatureParticipant.email) {
		if (!await this.checkEmailAvailability()) {
			hasError = true;
			errors.email = this.props.translate.register_exists_email;
		}
	}

	this.setState({
		errors,
		errorState: hasError
	});
	return hasError;
}

renderBody = () => (
	<div
		style={{
			minWidth: '650px',
			maxWidth: '90%'
		}}
		onKeyUp={() => this.checkRequiredFields()}
	>
		<SignatureParticipantForm
			translate={this.props.translate}
			participant={this.state.data}
			errors={this.state.errors}
			updateState={this.updateState}
			languages={this.props.extra.languages}
		/>
	</div>
)

render() {
	const { translate } = this.props;
	return (
		<AlertConfirm
			requestClose={this.props.requestClose}
			open={!!this.props.participantId}
			acceptAction={this.updateSignatureParticipant}
			buttonAccept={translate.accept}
			buttonCancel={translate.cancel}
			bodyText={this.renderBody()}
			title={translate.add_participant}
		/>
	);
}
}

const signatureParticipant = gql`
	query SignatureParticipant($id: Int!){
		signatureParticipant(id: $id){
			id
			name
			surname
			language
			dni
			email
			position
			phone
		}
	}
`;

const updateSignatureParticipant = gql`
	mutation UpdateSignatureParticipant($participant: SignatureParticipantInput!){
		updateSignatureParticipant(participant: $participant){
			success
		}
	}
`;

export default compose(
	graphql(updateSignatureParticipant, {
		name: 'updateSignatureParticipant'
	}),
	graphql(signatureParticipant, {
		options: props => ({
			variables: {
				id: props.participantId
			}
		})
	}),
	graphql(languages, {
		name: 'extra'
	}),
)(withApollo(ParticipantEditorModal));
