import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { withRouter } from 'react-router-dom';
import {
	CardPageLayout, LoadingSection, Scrollbar, BasicButton
} from '../../displayComponents';
import withTranslations from '../../HOCs/withTranslations';
import { bHistory } from '../../containers/App';
import { getPrimary } from '../../styles/colors';
import PartnerForm from './PartnerForm';
import { checkValidEmail } from '../../utils';
import { INPUT_REGEX } from '../../constants';
import { removeTypenameField } from '../../utils/CBX';


class Page extends React.PureComponent {
	state = {
		data: {},
		loading: false,
		errors: {},
		success: false
	}

	componentDidMount() {
		this.props.data.refetch();
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (!nextProps.data.loading) {
			if (!prevState.data.id) {
				const { __typename, representative, ...bookParticipant } = nextProps.data.bookParticipant;
				return {
					data: {
						...bookParticipant
					},
					...(representative ? {
						representative
					} : {})
				};
			}
		}

		return null;
	}

	goBack = () => {
		bHistory.back();
	}

	updateBookParticipant = async () => {
		if (!await this.checkRequiredFields()) {
			this.setState({
				loading: true
			});
			const variables = {
				participant: this.state.data
			};

			if (this.state.data.personOrEntity === 1 && this.state.representative) {
				variables.representative = {
					...removeTypenameField(this.state.representative),
					companyId: this.state.data.companyId
				};
			}

			const { participant, representative } = variables;
			const trimmedData = {};
			const trimmedRepresentative = {};

			if (participant) {
				Object.keys(participant).forEach(key => {
					trimmedData[key] = (participant[key] && participant[key].trim) ? participant[key].trim() : participant[key];
				});
			}
			if (representative) {
				Object.keys(representative).forEach(key => {
					trimmedRepresentative[key] = (representative[key] && representative[key].trim) ? representative[key].trim() : representative[key];
				});
			}

			const response = await this.props.updateBookParticipant({
				variables: {
					participant: {
						...trimmedData,
						companyId: this.state.data.companyId
					},
					...(this.state.data.personOrEntity === 1 ? {
						representative: {
							...trimmedRepresentative,
							companyId: this.state.data.companyId
						}
					} : {})
				}
			});

			// const response = await this.props.updateBookParticipant({
			//     // data
			//     variables
			// });

			if (response.data) {
				if (response.data.updateBookParticipant.success) {
					this.setState({
						success: true,
						loading: false
					});
					this.goBack();
				}
			}
		}
	}

	resetButtonStates = () => {
		this.setState({
			success: false,
			loading: false
		});
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
			phone: '',
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
		if (this.props.data.loading) {
			return <LoadingSection />;
		}

		let { representative } = this.state;

		if (this.state.data.personOrEntity === 1 && !representative) {
			representative = {
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
				position: ''
			};
		}

		return (
			<CardPageLayout title={this.props.translate.edit_partner} disableScroll>
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
								representative={representative}
								updateState={this.updateState}
								updateRepresentative={this.updateRepresentative}
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
							color={'white'}
							type="flat"
							id="edit-partner-back-button"
							textStyle={{ color: 'black', fontWeight: '700', textTransform: 'none' }}
							onClick={this.goBack}
							buttonStyle={{ marginRight: '0.8em' }}
						/>
						<BasicButton
							id={'guardarAnadirSocio'}
							text={this.props.translate.save_changes}
							color={getPrimary()}
							success={this.state.success}
							loading={this.state.loading}
							reset={this.resetButtonStates}
							textStyle={{ color: 'white', fontWeight: '700', textTransform: 'none' }}
							onClick={this.updateBookParticipant}
						/>
					</div>
				</div>
			</CardPageLayout>
		);
	}
}

const getBookParticipant = gql`
	query GetBookParticipant($participantId: Int!){
		bookParticipant(participantId: $participantId){
			name
			surname
			dni
			nationality
			home
			language
			socialCapital
			numParticipations
			email
			id
			representative {
				name
				surname
				dni
				nationality
				home
				language
				email
				id
				phone
				landlinePhone
				type
				address
				state
				city
				observations
				country
				countryState
				zipcode
				position
			}
			phone
			landlinePhone
			type
			address
			state
			companyId
			city
			observations
			country
			countryState
			zipcode
			position
			openDate
			personOrEntity
			subscribeDate
			unsubscribeDate
			subscribeActDate
			unsubscribeActDate
			subscribeActNumber
			unsubscribeActNumber
		}
	}
`;

const updateBookParticipant = gql`
	mutation updateBookParticipant($participant: BookParticipantInput!, $representative: BookParticipantInput){
		updateBookParticipant(participant: $participant, representative: $representative){
			success
			message
		}
	}
`;

export default compose(
	graphql(getBookParticipant, {
		options: props => ({
			variables: {
				participantId: +props.match.params.id
			},
			notifyOnNetworkStatusChange: true
		})
	}),
	graphql(updateBookParticipant, {
		name: 'updateBookParticipant'
	})
)(withTranslations()(withRouter(Page)));
