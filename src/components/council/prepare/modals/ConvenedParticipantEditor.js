import React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { BasicButton, AlertConfirm, Scrollbar } from '../../../../displayComponents/index';
import { getPrimary, secondary } from '../../../../styles/colors';
import { languages as languagesQuery } from '../../../../queries/masters';
import ParticipantForm from '../../participants/ParticipantForm';
import {
	checkRequiredFieldsParticipant,
	checkRequiredFieldsRepresentative
} from '../../../../utils/validation';
import RepresentativeForm from '../../../company/census/censusEditor/RepresentativeForm';
import { upsertConvenedParticipant, checkUniqueCouncilEmails } from '../../../../queries/councilParticipant';
import { COUNCIL_TYPES } from '../../../../constants';
import withSharedProps from '../../../../HOCs/withSharedProps';
import SelectRepresentative from '../../editor/census/modals/SelectRepresentative';
import { removeTypenameField } from '../../../../utils/CBX';

const initialRepresentative = {
	hasRepresentative: false,
	language: 'es',
	type: 2,
	name: '',
	surname: '',
	position: '',
	email: '',
	phone: '',
	dni: ''
};

class ConvenedParticipantEditor extends React.Component {
	state = {
		modal: false,
		data: {},
		representative: {},
		errors: {},
		representativeErrors: {}
	};

	componentDidMount() {
		this.setParticipantData();
	}

	componentWillUnmount() {
		console.log(this.props);
		this.setParticipantData();
	}

	setParticipantData() {
		// eslint-disable-next-line prefer-const
		let {
			representative, delegateId, delegateUuid, __typename, councilId, ...participant
		} = removeTypenameField(
			this.props.participant
		);
		console.log(this.props.participant);

		representative = (participant.representatives.length > 0) ?
			{
				hasRepresentative: true,
				...removeTypenameField(participant.representatives[0])
			}
			: initialRepresentative;

		delete representative.live;
		delete representative.notifications;
		delete participant.representing;
		delete participant.live;
		delete participant.notifications;


		this.setState({
			data: participant,
			representative
		});
	}

	updateConvenedParticipant = async sendConvene => {
		const { hasRepresentative, ...data } = this.state.representative;
		const representative = this.state.representative.hasRepresentative ?
			{
				...data,
				councilId: this.props.councilId
			}
			: null;


		if (!await this.checkRequiredFields()) {
			const { representatives, delegate, ...participant } = this.state.data;
			const response = await this.props.updateConvenedParticipant({
				variables: {
					participant: {
						...participant,
						councilId: this.props.councilId
					},
					representative,
					sendConvene
				}
			});
			if (!response.errors) {
				this.props.refetch();
				this.props.close();
			} else if (response.errors[0].message === 'Too many granted words') {
				this.setState({
					loading: false,
					...(participant.initialState === 2 ? {
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

	async checkRequiredFields(onlyEmail) {
		const participant = this.state.data;
		const { representative } = this.state;
		const { translate, participations, company } = this.props;

		let errorsParticipant = {
			errors: {},
			hasError: false
		};

		if (!onlyEmail) {
			const hasSocialCapital = participations;
			errorsParticipant = checkRequiredFieldsParticipant(
				participant,
				translate,
				hasSocialCapital,
				company
			);
		}
		let errorsRepresentative = {
			errors: {},
			hasError: false
		};


		if (representative.hasRepresentative) {
			if (!onlyEmail) {
				errorsRepresentative = checkRequiredFieldsRepresentative(
					representative,
					translate
				);
			}
		}


		if (participant.email && participant.email !== this.props.participant.email && company.type !== 10) {
			const emailsToCheck = [participant.email];

			if (representative.email && ((this.props.participant.representative && representative.email !== this.props.participant.representative.email) || !this.props.participant.representative)) {
				emailsToCheck.push(representative.email);
			}

			const response = await this.props.client.query({
				query: checkUniqueCouncilEmails,
				variables: {
					councilId: this.props.councilId,
					emailList: emailsToCheck
				}
			});

			if (!response.data.checkUniqueCouncilEmails.success) {
				const data = JSON.parse(response.data.checkUniqueCouncilEmails.message);
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

	render() {
		const primary = getPrimary();
		const participant = this.state.data;
		const { representative, errors, representativeErrors } = this.state;
		const { translate, participations } = this.props;
		const { languages = [] } = this.props.data;


		return (
			<AlertConfirm
				bodyStyle={{ height: '400px', width: '950px' }}
				bodyText={
					<Scrollbar>
						<SelectRepresentative
							open={this.state.selectRepresentative}
							council={this.props.council}
							translate={translate}
							updateRepresentative={repre => {
								this.updateRepresentative({
									...repre,
									hasRepresentative: true
								});
							}}
							requestClose={() => this.setState({
								selectRepresentative: false
							})}
						/>
						<div style={{ marginRight: '1em' }}>
							<div style={{
								boxShadow: 'rgba(0, 0, 0, 0.5) 0px 2px 4px 0px',
								border: '1px solid rgb(97, 171, 183)',
								borderRadius: '4px',
								padding: '1em',
								marginBottom: '1em',
								color: 'black',
							}}>
								<ParticipantForm
									type={participant.personOrEntity}
									participant={participant}
									participations={participations}
									translate={translate}
									hideVotingInputs={this.props.council.councilType === COUNCIL_TYPES.ONE_ON_ONE}
									languages={languages}
									errors={errors}
									updateState={this.updateState}
								/>
							</div>
							<div style={{
								boxShadow: 'rgba(0, 0, 0, 0.5) 0px 2px 4px 0px',
								border: '1px solid rgb(97, 171, 183)',
								borderRadius: '4px',
								padding: '1em',
								color: 'black',
								marginBottom: '.5em',
							}}>
								<RepresentativeForm
									translate={translate}
									state={representative}
									disabled={!!this.props.participant.representing}
									setSelectRepresentative={value => this.setState({
										selectRepresentative: value
									})}
									updateState={this.updateRepresentative}
									errors={representativeErrors}
									languages={languages}
								/>
							</div>
						</div>
					</Scrollbar>
				}
				title={translate.edit_participant}
				requestClose={() => this.props.close()}
				open={this.props.opened}
				actions={
					<React.Fragment>
						<BasicButton
							text={translate.cancel}
							color="transparent"
							textStyle={{
								boxShadow: 'none',
								borderRadius: '4px',
								textTransform: 'none',
								fontWeight: '700',
							}}
							onClick={this.props.close}
						/>
						<BasicButton
							text={this.props.council.councilType === COUNCIL_TYPES.BOARD_WITHOUT_SESSION ? translate.save_and_notify : translate.save_changes_and_send}
							textStyle={{
								boxShadow: 'none',
								borderRadius: '4px',
								color: 'white',
								textTransform: 'none',
								fontWeight: '700'
							}}
							buttonStyle={{ marginLeft: '1em' }}
							color={secondary}
							onClick={() => {
								this.updateConvenedParticipant(true);
							}}
						/>
						<BasicButton
							text={translate.save_changes}
							textStyle={{
								boxShadow: 'none',
								borderRadius: '4px',
								color: 'white',
								textTransform: 'none',
								fontWeight: '700'
							}}
							buttonStyle={{ marginLeft: '1em' }}
							color={primary}
							onClick={() => {
								this.updateConvenedParticipant(false);
							}}
						/>
					</React.Fragment>
				}
			>
			</AlertConfirm>
		);
	}
}

export default compose(
	graphql(upsertConvenedParticipant, {
		name: 'updateConvenedParticipant',
		options: {
			errorPolicy: 'all'
		}
	}),
	graphql(languagesQuery),
	withSharedProps()
)(withApollo(ConvenedParticipantEditor));
