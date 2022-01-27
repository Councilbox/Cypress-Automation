import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import {
	BasicButton,
	CustomDialog,
} from '../../../../displayComponents';
import { getPrimary } from '../../../../styles/colors';
import { languages as languagesQuery } from '../../../../queries/masters';
import ParticipantForm from '../../participants/ParticipantForm';
import RepresentativeForm from '../../../company/census/censusEditor/RepresentativeForm';
import { checkUniqueCouncilEmails, addConvenedParticipant } from '../../../../queries/councilParticipant';
import { useOldState } from '../../../../hooks';
import withSharedProps from '../../../../HOCs/withSharedProps';
import SelectRepresentative from '../../editor/census/modals/SelectRepresentative';

const initialParticipant = {
	name: '',
	surname: '',
	position: '',
	email: '',
	phone: '',
	dni: '',
	type: 0,
	delegateId: null,
	numParticipations: 1,
	socialCapital: 1,
	uuid: null,
	initialState: 0,
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
	position: '',
	email: '',
	initialState: 0,
	phone: '',
	dni: ''
};

const AddConvenedParticipantButton = ({
	translate, participations, open, requestClose, defaultValues = {}, client, company, defaultRepresentative, ...props
}) => {
	const [state, setState] = useOldState({
		modal: false,
		data: { ...initialParticipant, ...defaultValues },
		representative: { ...initialRepresentative, ...defaultRepresentative },
		errors: {},
		representativeErrors: {}
	});
	const primary = getPrimary();

	async function checkRequiredFields() {
		const participant = state.data;
		const { representative } = state;

		const errorsParticipant = {
			errors: {},
			hasError: false
		};


		const errorsRepresentative = {
			errors: {},
			hasError: false
		};

		if (participant.email && company.type !== 10) {
			const emailsToCheck = [participant.email];

			if (representative.email && !representative.id) {
				emailsToCheck.push(representative.email);
			}

			const response = await client.query({
				query: checkUniqueCouncilEmails,
				variables: {
					councilId: props.councilId,
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

		setState({
			...state,
			errors: errorsParticipant.errors,
			representativeErrors: errorsRepresentative.errors
		});

		return errorsParticipant.hasError || errorsRepresentative.hasError;
	}

	const addParticipant = async sendConvene => {
		const { hasRepresentative, ...data } = state.representative;
		const representative = state.representative.hasRepresentative ?
			{
				...data,
				councilId: props.councilId
			}
			: null;

		if (!await checkRequiredFields()) {
			const response = await props.addParticipant({
				variables: {
					participant: {
						...state.data,
						councilId: props.councilId
					},
					representative,
					sendConvene
				}
			});
			if (!response.errors) {
				props.refetch(response.data.addConvenedParticipant);
				setState({
					modal: false,
					data: { ...initialParticipant },
					representative: { ...initialRepresentative },
					errors: {},
					representativeErrors: {}
				});
			}
		}
	};

	const updateState = object => {
		setState({
			data: {
				...state.data,
				...object
			}
		});
	};

	const updateRepresentative = object => {
		setState({
			representative: {
				...state.representative,
				...object
			}
		});
	};

	const {
		data: participant,
		errors,
		representativeErrors,
		representative
	} = state;

	const { languages } = props.data;

	if (props.data.loading) {
		return '';
	}


	return (
		<React.Fragment>
			<CustomDialog
				title={translate.add_participant}
				requestClose={requestClose}
				open={open}
				actions={
					<React.Fragment>
						<BasicButton
							text={translate.cancel}
							type="flat"
							color="white"
							textStyle={{
								textTransform: 'none',
								fontWeight: '700'
							}}
							onClick={requestClose}
						/>
						<BasicButton
							text={translate.save_changes}
							textStyle={{
								color: 'white',
								textTransform: 'none',
								fontWeight: '700'
							}}
							buttonStyle={{ marginLeft: '1em' }}
							color={primary}
							onClick={() => {
								addParticipant(false);
							}}
						/>
					</React.Fragment>
				}
			>
				<div style={{ maxWidth: '900px' }}>
					<SelectRepresentative
						open={state.selectRepresentative}
						council={props.council}
						translate={translate}
						updateRepresentative={repre => {
							updateRepresentative({
								...repre,
								hasRepresentative: true
							});
						}}
						requestClose={() => setState({
							selectRepresentative: false
						})}
					/>
					<ParticipantForm
						type={participant.personOrEntity}
						participant={participant}
						representative={representative}
						participations={participations}
						translate={translate}
						languages={languages}
						errors={errors}
						updateState={updateState}
					/>
					<RepresentativeForm
						translate={translate}
						state={representative}
						updateState={updateRepresentative}
						setSelectRepresentative={value => setState({
							selectRepresentative: value
						})}
						errors={representativeErrors}
						languages={languages}
					/>
				</div>
			</CustomDialog>
		</React.Fragment>
	);
};


export default compose(
	graphql(addConvenedParticipant, {
		name: 'addParticipant',
		options: {
			errorPolicy: 'all'
		}
	}),
	graphql(languagesQuery),
	withSharedProps()
)(withApollo(AddConvenedParticipantButton));
