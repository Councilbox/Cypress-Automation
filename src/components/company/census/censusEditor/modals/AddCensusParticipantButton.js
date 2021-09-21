import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { Card } from 'material-ui';
import {
	AlertConfirm,
	BasicButton,
	ButtonIcon
} from '../../../../../displayComponents/index';
import { getPrimary } from '../../../../../styles/colors';
import { addCensusParticipant, checkUniqueCensusEmails } from '../../../../../queries/census';
import { languages as languagesQuery } from '../../../../../queries/masters';
import { censusHasParticipations } from '../../../../../utils/CBX';
import RepresentativeForm from '../RepresentativeForm';
import ParticipantForm from '../../../../council/participants/ParticipantForm';
import {
	checkRequiredFieldsParticipant,
	checkRequiredFieldsRepresentative
} from '../../../../../utils/validation';
import { isMobile } from '../../../../../utils/screen';
import SelectCensusParticipantRepresentative from './SelectCensusParticipantRepresentative';

const initialParticipant = {
	name: '',
	surname: '',
	position: '',
	email: '',
	phone: '',
	dni: '',
	initialState: 0,
	type: 0,
	delegateId: null,
	numParticipations: 1,
	socialCapital: 1,
	uuid: null,
	delegateUuid: null,
	language: 'es',
	city: '',
	personOrEntity: 0
};

const initialRepresentative = {
	hasRepresentative: false,
	language: 'es',
	type: 2,
	name: '',
	surname: '',
	initialState: 0,
	position: '',
	email: '',
	phone: '',
	dni: ''
};


class AddCensusParticipantButton extends React.Component {
	state = {
		modal: false,
		data: { ...initialParticipant },
		representative: { ...initialRepresentative },
		errors: {},
		representativeErrors: {}
	};

	addCensusParticipant = async () => {
		const { hasRepresentative, ...data } = this.state.representative;
		const representative = this.state.representative.hasRepresentative ?
			{
				...data,
				companyId: this.props.census.companyId,
				censusId: this.props.census.id
			}
			: null;

		if (!await this.checkRequiredFields()) {
			const response = await this.props.addCensusParticipant({
				variables: {
					participant: {
						...this.state.data,
						companyId: this.props.census.companyId,
						censusId: this.props.census.id
					},
					representative
				}
			});
			if (!response.errors) {
				this.props.refetch();
				this.setState({
					modal: false,
					data: { ...initialParticipant },
					representative: { ...initialRepresentative },
					errors: {},
					representativeErrors: {}
				});
			} else if (response.errors[0].message === 'Too many granted words') {
				this.setState({
					loading: false,
					...(this.state.data.initialState === 2 ? {
						errors: {
							initialState: this.props.translate.initial_granted_word_error
						}
					} : {}),
					...(representative && representative.initialState === 2 ? {
						representativeErrors: {
							initialState: this.props.translate.initial_granted_word_error
						}
					} : {})

				});
			}
		}
	};

	updateState = object => {
		this.setState({
			data: {
				...this.state.data,
				...object
			}
		});
	};

	updateRepresentative = object => {
		this.setState({
			representative: {
				...this.state.representative,
				...object
			}
		});
	};

	async checkRequiredFields() {
		const participant = this.state.data;
		const { representative } = this.state;
		const { translate, company } = this.props;
		const hasSocialCapital = censusHasParticipations(this.props.census);
		const errorsParticipant = checkRequiredFieldsParticipant(
			participant,
			translate,
			hasSocialCapital,
			company
		);

		const emailsToCheck = [];

		if (this.props.company.type !== 10) {
			if (participant.personOrEntity === 0 || participant.email) {
				emailsToCheck.push(participant.email);
			}
		}

		let errorsRepresentative = {
			errors: {},
			hasError: false
		};
		if (representative.hasRepresentative) {
			errorsRepresentative = checkRequiredFieldsRepresentative(
				representative,
				translate
			);

			if (!representative.id) {
				emailsToCheck.push(representative.email);
			}
		}

		if (emailsToCheck.length > 0) {
			const response = await this.props.client.query({
				query: checkUniqueCensusEmails,
				variables: {
					censusId: this.props.census.id,
					emailList: emailsToCheck
				}
			});

			if (!response.data.checkUniqueCensusEmails.success) {
				const data = JSON.parse(response.data.checkUniqueCensusEmails.message);
				data.duplicatedEmails.forEach(email => {
					if (participant.email === email) {
						errorsParticipant.errors.email = translate.register_exists_email;
						errorsParticipant.hasError = true;
					}
					if (representative.email === email) {
						errorsRepresentative.errors.email = translate.register_exists_email;
						errorsRepresentative.hasError = true;
					}
				});
			}

			if (participant.email === representative.email) {
				errorsRepresentative.errors.email = translate.repeated_email;
				errorsParticipant.errors.email = translate.repeated_email;
				errorsParticipant.hasError = true;
			}
		}


		this.setState({
			...this.state,
			errors: errorsParticipant.errors,
			representativeErrors: errorsRepresentative.errors
		});

		return errorsParticipant.hasError || errorsRepresentative.hasError;
	}

	renderBody() {
		const participant = this.state.data;
		const { errors } = this.state;
		const { translate } = this.props;
		const { languages } = this.props.data;
		return (
			<div style={{ maxWidth: '950px' }}>
				<SelectCensusParticipantRepresentative
					open={this.state.selectRepresentative}
					census={this.props.census}
					translate={translate}
					updateRepresentative={representative => {
						this.updateRepresentative({
							...representative,
							hasRepresentative: true
						});
					}}
					requestClose={() => this.setState({
						selectRepresentative: false
					})}
				/>

				<div style={{ marginRight: '1em' }}>
					<Card style={{
						padding: '1em',
						marginBottom: '1em',
						color: 'black',
					}}>
						<ParticipantForm
							type={participant.personOrEntity}
							participant={participant}
							participations={censusHasParticipations(this.props.census)}
							translate={translate}
							languages={languages}
							errors={errors}
							updateState={this.updateState}
						/>
					</Card>
					<Card style={{
						padding: '1em',
						marginBottom: '1em',
						color: 'black',
					}}>
						<RepresentativeForm
							translate={this.props.translate}
							state={this.state.representative}
							updateState={this.updateRepresentative}
							setSelectRepresentative={value => this.setState({
								selectRepresentative: value
							})}
							errors={this.state.representativeErrors}
							languages={this.props.data.languages}
						/>
					</Card>
				</div>


			</div>
		);
	}


	render() {
		const { translate } = this.props;
		const primary = getPrimary();


		return (
			<React.Fragment>
				<BasicButton
					id="add-census-participant-button"
					text={translate.add_participant}
					color={'white'}
					textStyle={{
						color: primary,
						fontWeight: '700',
						fontSize: isMobile ? '.75rem' : '.9rem',
						textTransform: 'none',
					}}
					textPosition="after"
					icon={!isMobile ? <ButtonIcon type="add" color={primary} /> : null}
					onClick={() => this.setState({ modal: true })}
					buttonStyle={{
						border: `2px solid ${primary}`,
						width: isMobile && '150px',
						height: isMobile && '60px'
					}}
				/>
				<AlertConfirm
					requestClose={() => this.setState({ modal: false })}
					open={this.state.modal}
					fullWidth={false}
					acceptAction={this.addCensusParticipant}
					buttonAccept={translate.save}
					buttonCancel={translate.cancel}
					bodyText={this.renderBody()}
					title={translate.add_participant}
				/>
			</React.Fragment>
		);
	}
}

export default compose(
	graphql(addCensusParticipant, {
		name: 'addCensusParticipant',
		options: {
			errorPolicy: 'all'
		}
	}),
	graphql(languagesQuery)
)(withApollo(AddCensusParticipantButton));

