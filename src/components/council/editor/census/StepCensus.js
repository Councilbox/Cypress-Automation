import React from 'react';
import Dialog, {
	DialogActions,
	DialogContent,
	DialogTitle
} from 'material-ui/Dialog';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import gql from 'graphql-tag';
import {
	BasicButton,
	ButtonIcon,
	ErrorWrapper,
	LoadingSection
} from '../../../../displayComponents/index';
import {
	councilParticipants as councilParticipantsQuery
} from '../../../../queries/councilParticipant';
import { PARTICIPANTS_LIMITS } from '../../../../constants';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import ParticipantsTable from './ParticipantsTable';
import * as CBX from '../../../../utils/CBX';
import { councilStepTwo, updateCouncil } from '../../../../queries';
import EditorStepLayout from '../EditorStepLayout';
import { useOldState } from '../../../../hooks';
import EditorStepper from '../EditorStepper';


const StepCensus = ({ translate, data, step, ...props }) => {
	const [state, setState] = useOldState({
		placeModal: false,
		censusChangeAlert: false,
		addParticipant: false,
		noParticipantsError: false,
		censusChangeId: '',
		participantsLength: 0,
		data: {
			censuses: []
		}
	});
	const primary = getPrimary();
	const secondary = getSecondary();

	React.useEffect(() => {
		if (!data.loading) {
			props.participants.refetch();
		}
	}, [props.councilID]);

	React.useEffect(() => {
		if (!data.loading) {
			setState({
				data: {
					...data.council
				}
			});
		}
		if (props.participants) {
			const { councilParticipants } = props.participants;
			if (councilParticipants) {
				if (councilParticipants.total > 0) {
					if (state.participantsLength !== councilParticipants.total) {
						setState({
							participantsLength: councilParticipants.total
						});
					}
				}
			}
		}
	}, [data.loading, props.participants.councilParticipants]);


	const resetButtonStates = () => {
		setState({
			loading: false,
			success: false
		});
	};

	const saveDraft = async stepIn => {
		setState({
			loading: true
		});
		const {
			__typename, participants, selectedCensusId, statute, ...council
		} = data.council;
		await props.updateCouncil({
			variables: {
				council: {
					...council,
					step: stepIn
				}
			}
		});

		setState({
			loading: false,
			success: true
		});
	};

	const handleCensusChange = event => {
		if (event.target.value !== data.council.selectedCensusId) {
			setState({
				censusChangeAlert: true,
				censusChangeId: event.target.value
			});
		}
	};

	const reloadCensus = () => {
		setState({
			censusChangeAlert: true,
			censusChangeId: data.council.selectedCensusId
		});
	};

	const nextPage = async () => {
		if (state.participantsLength > 0) {
			await saveDraft(3);
			props.nextStep();
		} else {
			setState({
				noParticipantsError: true
			});
		}
	};

	const previousPage = async () => {
		await saveDraft(2);
		props.previousStep();
	};

	const sendCensusChange = async () => {
		setState({
			loading: true
		});
		const response = await props.changeCensus({
			variables: {
				censusId: state.censusChangeId,
				councilId: data.council.id
			}
		});
		if (response) {
			const newData = await data.refetch();
			const newParticipants = await props.participants.refetch();
			if (newData) {
				setState({
					censusChangeAlert: false,
					loading: false,
					participantsLength: newParticipants.data.councilParticipants.total,
					data: {
						...state.data,
						...newData.data.council
					}
				});
			}
		}
	};

	function renderCensusChangeButtons(selectedCensusId) {
		if (selectedCensusId) {
			return (
				<React.Fragment>
					<BasicButton
						text={translate.cancel}
						color={'white'}
						type="flat"
						textStyle={{
							fontWeight: '700',
							fontSize: '0.9em',
							textTransform: 'none'
						}}
						id="change-census-cancel"
						textPosition="after"
						onClick={() => setState({ censusChangeAlert: false })}
						buttonStyle={{ marginRight: '1em' }}
					/>
					<BasicButton
						text={translate.want_census_change}
						id="change-census-confirm"
						color={primary}
						textStyle={{
							color: 'white',
							fontWeight: '700',
							fontSize: '0.9em',
							textTransform: 'none'
						}}
						icon={<ButtonIcon type="save" color="white" />}
						textPosition="after"
						onClick={sendCensusChange}
					/>
				</React.Fragment>
			);
		}
		return (
			<React.Fragment>
				<BasicButton
					text={translate.cancel}
					color={'white'}
					type="flat"
					textStyle={{
						fontWeight: '700',
						fontSize: '0.9em',
						textTransform: 'none'
					}}
					textPosition="after"
					onClick={() => setState({ censusChangeAlert: false })}
					buttonStyle={{ marginRight: '1em' }}
				/>
			</React.Fragment>
		);
	}

	const checkParticipants = () => !props.participants.loading && state.participantsLength <= 0;

	const { council, error } = data;

	if (error) {
		return (
			<div
				style={{
					width: '100%',
					height: '100%',
					padding: '2em'
				}}
			>
				<ErrorWrapper error={error} translate={translate} />
			</div>
		);
	}

	if (state.loading) {
		return <LoadingSection />;
	}

	return (
		<React.Fragment>
			<div
				style={{
					width: '100%',
					textAlign: 'center',
				}}
			>
				<div style={{
					marginBottom: '1.2em', marginTop: '0.8em', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1.5rem'
				}}>
					<EditorStepper
						translate={translate}
						active={step - 1}
						goToPage={nextPage}
						previousPage={previousPage}
					/>
				</div>
			</div>
			<EditorStepLayout
				body={
					<React.Fragment>
						{!council ?
							<div
								style={{
									height: '300px',
									width: '100%',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}
							>
								<LoadingSection />
							</div>
							: <React.Fragment>
								<ParticipantsTable
									translate={translate}
									data={props.participants}
									refetch={async type => {
										data.refetch();
										const participants = await props.participants.refetch();
										if (type === 'delete') {
											setState({
												participantsLength: participants.data.councilParticipants.total
											});
										}
									}}
									key={`${council.selectedCensusId}`}
									council={council}
									handleCensusChange={handleCensusChange}
									reloadCensus={reloadCensus}
									showAddModal={() => setState({ addParticipant: true })}
									censuses={data.censuses}
									editable={true}
									totalVotes={data.councilTotalVotes}
									totalSocialCapital={data.councilSocialCapital}
									participations={CBX.hasParticipations(council)}
								/>
								{checkParticipants()
									&& <div
										style={{
											color: 'red',
											fontWeight: '700',
											marginTop: '1em',
											width: '100%',
											display: 'flex',
											justifyContent: 'center'
										}}
									>
										{translate.participants_required}
									</div>

								}
							</React.Fragment>
						}
						<Dialog
							disableBackdropClick={false}
							open={state.censusChangeAlert}
							onClose={() => setState({ censusChangeAlert: false })
							}
						>
							<DialogTitle>{translate.census_change}</DialogTitle>
							{!council ?
								<LoadingSection />
								: council.selectedCensusId !== null || state.censusChangeId ?
									<div>
										<DialogContent>
											{translate.census_change_warning.replace(
												'<br/>',
												''
											)}
										</DialogContent>
										<DialogActions>
											{renderCensusChangeButtons(council.selectedCensusId || state.censusChangeId)}
										</DialogActions>
									</div>
									: <div style={{ minWidth: '500px' }}>
										<DialogContent>
											{translate.need_pick_census}
										</DialogContent>
										<DialogActions>
											{renderCensusChangeButtons(council.selectedCensusId || state.censusChangeId)}
										</DialogActions>
									</div>
							}


							{/* {council.selectedCensusId === null ?
							<div><DialogContent>
								{translate.census_change_warning.replace(
									"<br/>",
									""
								)}
							</DialogContent>
								<DialogActions>
									{renderCensusChangeButtons()}
								</DialogActions>
							</div>
							:
							<div>ASDASD</div>
						} */}
						</Dialog>
					</React.Fragment>
				}
				buttons={
					<React.Fragment>
						<BasicButton
							text={translate.previous}
							color={secondary}
							disabled={data.loading}
							textStyle={{
								color: 'white',
								fontWeight: '700',
								fontSize: '0.9em',
								textTransform: 'none'
							}}
							textPosition="after"
							onClick={previousPage}
						/>
						<BasicButton
							text={translate.save}
							color={secondary}
							disabled={data.loading}
							reset={resetButtonStates}
							loading={state.loading}
							success={state.success}
							textStyle={{
								color: 'white',
								fontWeight: '700',
								fontSize: '0.9em',
								marginLeft: '0.5em',
								marginRight: '0.5em',
								textTransform: 'none'
							}}
							icon={
								<ButtonIcon type="save" color="white" />
							}
							textPosition="after"
							onClick={() => saveDraft(2)}
						/>
						<BasicButton
							text={translate.next}
							color={primary}
							disabled={data.loading}
							textStyle={{
								color: 'white',
								fontWeight: '700',
								fontSize: '0.9em',
								textTransform: 'none'
							}}
							textPosition="after"
							onClick={nextPage}
							id={'censoSiguienteNew'}
						/>
					</React.Fragment>
				}
			/>
		</React.Fragment>
	);
};


const changeCensus = gql`
			mutation changeCensus($councilId: Int!, $censusId: Int!) {
				changeCensus(councilId: $councilId, censusId: $censusId){
				success
			}
	}
			`;

export default compose(
	graphql(councilStepTwo, {
		name: 'data',
		options: props => ({
			variables: {
				id: props.councilID,
				companyId: props.companyID
			},
			notifyOnNetworkStatusChange: true
		})
	}),
	graphql(councilParticipantsQuery, {
		name: 'participants',
		options: props => ({
			variables: {
				councilId: props.councilID,
				options: {
					limit: PARTICIPANTS_LIMITS[0],
					offset: 0,
					orderBy: 'fullName',
					orderDirection: 'asc'
				}
			},
			forceFetch: true,
			notifyOnNetworkStatusChange: true
		})
	}),
	graphql(changeCensus, {
		name: 'changeCensus'
	}),
	graphql(updateCouncil, {
		name: 'updateCouncil'
	})
)(StepCensus);
