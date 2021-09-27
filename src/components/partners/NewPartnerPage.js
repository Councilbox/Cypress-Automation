import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { CardPageLayout, Scrollbar, BasicButton, UnsavedChangesModal } from '../../displayComponents';
import PartnerForm from './PartnerForm';
import withSharedProps from '../../HOCs/withSharedProps';
import { getPrimary } from '../../styles/colors';
import { bHistory } from '../../containers/App';
import { checkValidEmail } from '../../utils';
import { INPUT_REGEX } from '../../constants';


class NewPartnerPage extends React.Component {
	state = {
		data: {
			name: '',
			surname: '',
			dni: '',
			nationality: '',
			home: '',
			language: 'es',
			email: '',
			state: 1,
			phone: '',
			landlinePhone: '',
			type: 0,
			address: '',
			city: '',
			observations: '',
			country: 'España',
			countryState: '',
			zipcode: '',
			position: '',
			openDate: null,
			personOrEntity: 0,
			subscribeDate: null,
			unsubscribeDate: null,
			subscribeActDate: null,
			unsubscribeActDate: null,
			subscribeActNumber: '',
			unsubscribeActNumber: ''
		},
		representative: {
			name: '',
			surname: '',
			dni: '',
			nationality: '',
			home: '',
			language: 'es',
			email: '',
			phone: '',
			landlinePhone: '',
			type: 0,
			address: '',
			city: '',
			observations: '',
			country: 'España',
			countryState: '',
			zipcode: '',
			position: '',
		},
		errors: {},
		modal: false
	}

	goBack = () => {
		bHistory.back();
	}

	baseState = this.state;


	createPartner = async () => {
		if (!await this.checkRequiredFields()) {
			const { data, representative } = this.state;
			const trimmedData = {};
			const trimmedRepresentative = {};

			Object.keys(data).forEach(key => {
				trimmedData[key] = (data[key] && data[key].trim) ? data[key].trim() : data[key];
			});
			Object.keys(representative).forEach(key => {
				trimmedRepresentative[key] = (representative[key] && representative[key].trim) ? representative[key].trim() : representative[key];
			});

			const response = await this.props.createPartner({
				variables: {
					participant: {
						...trimmedData,
						// ...this.state.data,
						companyId: this.props.company.id
					},
					...(this.state.data.personOrEntity === 1 ? {
						representative: {
							...trimmedRepresentative,
							// ...this.state.representative,
							companyId: this.props.company.id
						}
					} : {})
				}
			});

			if (response.data) {
				if (response.data.createSimpleBookParticipant) {
					this.goBack();
				}
			}
		}
	}

	checkRequiredFields = async () => {
		const testPhone = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
		const errors = {
			name: '',
			surname: '',
			dni: '',
			home: '',
			language: 'es',
			email: '',
			landlinePhone: '',
			address: '',
			state: '',
			city: '',
			observations: '',
			country: 'España',
			countryState: '',
			zipcode: ''
		};

		let hasError = false;

		const { data } = this.state;
		const { translate } = this.props;

		if (!data.name) {
			hasError = true;
			errors.name = translate.required_field;
		}

		if (data.personOrEntity === 0 && !data.surname) {
			hasError = true;
			errors.surname = translate.required_field;
		}

		if (data.name) {
			if (!(INPUT_REGEX.test(data.name)) || !data.name.trim()) {
				hasError = true;
				errors.name = translate.invalid_field;
			}
		}

		if (data.personOrEntity === 0 && data.surname) {
			if (!(INPUT_REGEX.test(data.surname)) || !data.surname.trim()) {
				hasError = true;
				errors.surname = translate.invalid_field;
			}
		}

		if (data.dni) {
			if (!(INPUT_REGEX.test(data.dni)) || !data.dni.trim()) {
				hasError = true;
				errors.dni = translate.invalid_field;
			}
		}

		if (data.landlinePhone) {
			if (!(INPUT_REGEX.test(data.landlinePhone)) || !data.landlinePhone.trim()) {
				hasError = true;
				errors.landlinePhone = translate.invalid_field;
			}
		}

		if (data.phone && data.phone !== '-') {
			if (!(testPhone.test(data.phone)) || !data.phone.trim()) {
				hasError = true;
				errors.phone = translate.invalid_field;
			}
		}

		if (data.position) {
			if (!(INPUT_REGEX.test(data.position)) || !data.position.trim()) {
				hasError = true;
				errors.position = translate.invalid_field;
			}
		}

		if (data.nationality) {
			if (!(INPUT_REGEX.test(data.nationality)) || !data.nationality.trim()) {
				hasError = true;
				errors.nationality = translate.invalid_field;
			}
		}

		if (data.numParticipations) {
			if (!(/^[0-9]+$/.test(data.numParticipations)) || !String(data.numParticipations).trim()) {
				hasError = true;
				errors.numParticipations = translate.invalid_field;
			}
		}

		if (data.socialCapital) {
			if (!(/^[0-9]+$/.test(data.socialCapital)) || !String(data.socialCapital).trim()) {
				hasError = true;
				errors.socialCapital = translate.invalid_field;
			}
		}

		if (data.zipcode) {
			if (!(/^[0-9]+$/.test(data.zipcode)) || !data.zipcode.trim()) {
				hasError = true;
				errors.zipcode = translate.invalid_field;
			}
		}

		if (data.address) {
			if (!(INPUT_REGEX.test(data.address)) || !data.address.trim()) {
				hasError = true;
				errors.address = translate.invalid_field;
			}
		}

		if (data.city) {
			if (!(INPUT_REGEX.test(data.city)) || !data.city.trim()) {
				hasError = true;
				errors.city = translate.invalid_field;
			}
		}


		if (data.countryState) {
			if (!(INPUT_REGEX.test(data.countryState)) || !data.countryState.trim()) {
				hasError = true;
				errors.countryState = translate.invalid_field;
			}
		}

		if (!data.email) {
			hasError = true;
			errors.email = translate.required_field;
		} else if (!checkValidEmail(data.email)) {
			hasError = true;
			errors.email = translate.valid_email_required;
		}

		this.setState({
			errors
		});
		return hasError;
	}

	updateState = object => {
		this.setState({
			data: {
				...this.state.data,
				...object
			}
		});
	}

	updateRepresentative = object => {
		this.setState({
			representative: {
				...this.state.representative,
				...object
			}
		});
	}

	render() {
		return (
			<CardPageLayout title={this.props.translate.add_partner} disableScroll>
				<div
					style={{
						height: 'calc(100% - 3em)',
						overflow: 'hidden',
					}}
				>
					<Scrollbar>
						<div style={{ padding: '0.6em 5%' }}>
							<PartnerForm
								translate={this.props.translate}
								representative={this.state.representative}
								updateRepresentative={this.updateRepresentative}
								updateState={this.updateState}
								participant={this.state.data}
								errors={this.state.errors}
							/>
						</div>
					</Scrollbar>
				</div>
				<div
					style={{
						height: '3em',
						display: 'flex',
						flexDirection: 'row',
						paddingRight: '1.2em',
						paddingTop: '0.5em',
						alignItems: 'center',
						justifyContent: 'flex-end',
						borderTop: '1px solid gainsboro'
					}}
				>
					<div>
						<BasicButton
							text={this.props.translate.back}
							id="edit-partner-back-button"
							color={'white'}
							type="flat"
							textStyle={{ color: 'black', fontWeight: '700', textTransform: 'none' }}
							onClick={() => {
								if (this.state !== this.baseState) {
									this.setState({ ...this.state, modal: true });
								} else {
									this.goBack();
								}
							}}
							buttonStyle={{ marginRight: '0.8em' }}
						/>
						<BasicButton
							id={'guardarAnadirSocio'}
							text={this.props.translate.save_changes}
							color={getPrimary()}
							textStyle={{ color: 'white', fontWeight: '700', textTransform: 'none' }}
							onClick={this.createPartner}
						/>
						<UnsavedChangesModal
							translate={this.props.translate}
							open={this.state.modal}
							requestClose={() => this.setState({ ...this.state, modal: false })}
							acceptAction={this.createPartner}
							cancelAction={this.goBack}
						/>
					</div>
				</div>
			</CardPageLayout>
		);
	}
}

const createPartner = gql`
	mutation CreatePartner($participant: BookParticipantInput!, $representative: BookParticipantInput) {
		createSimpleBookParticipant(participant: $participant, representative: $representative){
			id
		}
	}
`;

export default graphql(createPartner, {
	name: 'createPartner'
})(withSharedProps()(NewPartnerPage));
