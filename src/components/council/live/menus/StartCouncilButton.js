import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import gql from 'graphql-tag';
import { Typography } from 'material-ui';
import { councilOfficials } from '../../../../queries';
import {
	AlertConfirm,
	BasicButton,
	Grid,
	GridItem,
	Icon,
	LoadingSection,
	ParticipantRow,
	TextInput,
	Scrollbar
} from '../../../../displayComponents';
import { getPrimary } from '../../../../styles/colors';
import { COUNCIL_TYPES, DELEGATION_USERS_LOAD } from '../../../../constants';
import { existsQualityVote, councilHasVideo } from '../../../../utils/CBX';
import { moment } from '../../../../containers/App';
import ConveneSelector from '../ConveneSelector';
import { startCouncil as startCouncilMutation } from '../../../../queries/council';
import { useOldState } from '../../../../hooks';
import StartCouncilVideoOptions from './StartCouncilVideoOptions';
import { isMobile } from 'react-device-detect';

const buttonStyle = primary => ({
	backgroundColor: 'white',
	border: `solid 1px ${primary}`,
	color: primary,
	cursor: 'pointer',
	borderRadius: '2px',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	width: '100%',
});


const StartCouncilButton = ({
	council, translate, data, client, ...props
}) => {
	const [loadingSteps, setLoadingSteps] = React.useState({
		steps: [],
		status: 'idle'
	});
	const [state, setState] = useOldState({
		alert: false,
		selecting: 0,
		loading: false,
		data: {
			firstOrSecondConvene: council.firstOrSecondConvene,
			neededQuorum: 2,
			president: council.president,
			secretary: council.secretary,
			presidentId: council.presidentId,
			secretaryId: council.secretaryId
		},
		video: {
			startRecording: council.fullVideoRecord === 1,
			// hasRTMP: (council.room.videoConfig && council.room.videoConfig.rtmp)? true : false,
			startStreaming: !!((council.room.videoConfig && council.room.videoConfig.rtmp) && !council.room.videoConfig.autoHybrid)
		},
		errors: {
			president: '',
			secretary: '',
			qualityVote: ''
		}
	});
	const primary = getPrimary();

	const checkRequiredFields = () => {
		let hasError = false;
		const errors = {
			president: '',
			secretary: '',
			qualityVote: ''
		};

		if (council.statute.hasPresident === 1 && !state.data.president) {
			hasError = true;
			errors.president = true;
		}

		if (council.statute.hasSecretary === 1 && !state.data.secretary) {
			hasError = true;
			errors.secretary = true;
		}

		if (existsQualityVote(council.statute)) {
			if (!state.data.qualityVoteName) {
				hasError = true;
				errors.qualityVote = true;
			}
		}

		setState({
			errors
		});

		return hasError;
	};

	const startCouncil = async () => {
		if (!checkRequiredFields()) {
			if (state.video.startRecording) {
				const step = {
					text: translate.start_recording,
					status: 'loading'
				};

				setLoadingSteps(items => ({
					steps: [...items.steps, step],
					status: 'loading'
				}));

				// await wait();

				await client.mutate({
					mutation: gql`
						mutation StartRecording($councilId: Int!){
							startRecording(councilId: $councilId){
								success
								message
							}
						}
					`,
					variables: {
						councilId: council.id
					}
				});

				step.status = 'done';
				setLoadingSteps(items => ({
					steps: [...items.steps],
					status: 'loading'
				}));
			}

			if (state.video.startStreaming) {
				const step = {
					text: translate.starting_broadcast,
					status: 'loading'
				};

				setLoadingSteps(items => ({
					steps: [...items.steps, step],
					status: 'loading'
				}));

				// await wait();

				await client.mutate({
					mutation: gql`
						mutation StartStreaming($councilId: Int!){
							startStreaming(councilId: $councilId){
								success
								message
							}
						}
					`,
					variables: {
						councilId: council.id
					}
				});

				step.status = 'done';
				setLoadingSteps(items => ({
					steps: [...items.steps],
					status: 'loading'
				}));
			}

			const step = {
				text: translate.starting_council,
				status: 'loading'
			};

			setLoadingSteps(items => ({
				steps: [...items.steps, step],
				status: 'loading'
			}));

			const {
				presidentId,
				secretaryId,
				qualityVoteId,
				firstOrSecondConvene
			} = state.data;
			await props.startCouncil({
				variables: {
					councilId: council.id,
					presidentId,
					secretaryId,
					qualityVoteId,
					firstOrSecondConvene,
					videoOptions: state.video,
					timezone: moment().utcOffset().toString(),
				}
			});

			step.status = 'done';
			setLoadingSteps(items => ({
				steps: [...items.steps],
				status: 'done'
			}));
		}
	};

	const actionSwitch = () => {
		const actions = {
			1: (id, name) => {
				setState({
					data: {
						...state.data,
						president: name,
						presidentId: id
					},
					selecting: 0
				});
			},
			2: (id, name) => {
				setState({
					data: {
						...state.data,
						secretary: name,
						secretaryId: id
					},
					selecting: 0
				});
			},
			3: (id, name) => {
				setState({
					data: {
						...state.data,
						qualityVoteName: name,
						qualityVoteId: id
					},
					selecting: 0
				});
			}
		};

		return actions[state.selecting];
	};

	const changeConvene = value => {
		setState({
			data: {
				...state.data,
				firstOrSecondConvene: value
			}
		});
	};

	const startAuto = async () => {
		setState({ loading: true });

		const response = await props.startAutoCouncil({
			variables: {
				councilId: council.id
			}
		});

		if (response.data.startAutoCouncil.success) {
			await props.refetch();
		}
	};

	const loadMore = () => {
		data.fetchMore({
			variables: {
				options: {
					offset: data.councilOfficials.list.length,
					limit: DELEGATION_USERS_LOAD
				}
			},
			updateQuery: (prev, { fetchMoreResult }) => {
				if (!fetchMoreResult) {
					return prev;
				}
				return {
					...prev,
					councilOfficials: {
						...prev.councilOfficials,
						list: [
							...prev.councilOfficials.list,
							...fetchMoreResult.councilOfficials.list
						]
					}
				};
			}
		});
	};

	const updateFilterText = text => {
		data.refetch({
			filters: [{
				field: 'fullName',
				text
			}]
		});
	};

	const forceStartWarning = () => (
		<div>
			{translate.council_will_start}
		</div>
	);

	const startCouncilForm = () => {
		const { loading } = data;

		const participants = loading ? [] : data.councilOfficials.list;
		const { total } = loading ? 0 : data.councilOfficials;
		const rest = total - participants.length - 1;

		if (loadingSteps.steps.length > 0) {
			return loadingSteps.steps.map(step => (
				<div style={{ width: '90%', display: 'flex', justifyContent: 'space-between' }} key={`step_${step.text}`}>
					<div>
						{step.text}
					</div>
					<div>
						{step.status === 'loading'
							&& <LoadingSection size={14} />
						}
						{step.status === 'done'
							&& <i className="fa fa-check" style={{ color: 'green' }}></i>
						}
					</div>
				</div>
			));
		}

		if (state.selecting !== 0) {
			return (
				<div>
					<TextInput
						adornment={<Icon>search</Icon>}
						floatingText={' '}
						type="text"
						value={state.filterText}
						onChange={event => {
							updateFilterText(event.target.value);
						}}
					/>

					<div
						style={{
							height: '300px',
							overflow: 'hidden',
							position: 'relative'
						}}
					>
						{loading ? (
							<LoadingSection />
						) : (
							<Scrollbar option={{ suppressScrollX: true }}>
								{participants.length > 0 ? (
									<div style={{ padding: '0.2em' }}>
										{participants.map((participant, index) => (
											<ParticipantRow
												clases={'itemsSeleccionEnModalUsersEnReunion'}
												participant={participant}
												id={`participant-selector-${index}`}
												key={`participant_${participant.id
													}`}
												onClick={() => actionSwitch()(
													participant.id,
													`${participant.name} ${participant.surname || ''}`
												)
												}
											/>
										))}
										{participants.length < total - 1 && (
											<div onClick={loadMore} style={{
												display: 'flex',
												alignItems: 'center',
												padding: '0.45em',
												marginTop: '0.5em',
												cursor: 'pointer',
												justifyContent: 'center',
												border: '1px solid gainsboro'
											}} className="withShadow">
												{`Descargar ${rest > DELEGATION_USERS_LOAD ?
													`${DELEGATION_USERS_LOAD} de ${rest} restantes`
													: translate.all_plural.toLowerCase()
													}`}
											</div>
										)}
									</div>
								) : (
									<Typography>
										{translate.no_results}
									</Typography>
								)}
							</Scrollbar>
						)}
					</div>
				</div>
			);
		}

		return (
			<Grid>
				<GridItem xs={12}>
					<Grid>
						{council.statute.hasPresident === 1
							&& <GridItem xs={12}>
								<Grid>
									<GridItem xs={3} md={3} lg={3}>
										<span style={{ wordBreak: 'break-word' }}>
											{translate.president}
										</span>
									</GridItem>
									<GridItem xs={4} md={4} lg={4}>
										<button
											id="council-president-select"
											style={buttonStyle(primary)}
											onClick={() => setState({ selecting: 1 })}
										>
											{translate.select_president}
										</button>
									</GridItem>
									<GridItem xs={5} md={5} lg={5}>
										{state.data.president ? (
											state.data.president
										) : (
											<span
												style={{
													color: state.errors.president ?
														'red'
														: 'inherit'
												}}
											>
												{translate.not_selected}
											</span>
										)}
									</GridItem>
								</Grid>
							</GridItem>
						}

						{council.statute.hasSecretary === 1
							&& <GridItem xs={12}>
								<Grid>
									<GridItem xs={3} md={3} lg={3}>
										<span>
											{translate.secretary}
										</span>
									</GridItem>
									<GridItem xs={4} md={4} lg={4}>
										<button
											id="council-secretary-select"
											style={buttonStyle(primary)}
											onClick={() => setState({ selecting: 2 })}
										>
											{translate.select_secretary}
										</button>
									</GridItem>
									<GridItem xs={5} md={5} lg={5}>
										{state.data.secretary ? (
											state.data.secretary
										) : (
											<span
												style={{
													color: state.errors.secretary ?
														'red'
														: 'inherit'
												}}
											>
												{translate.not_selected}
											</span>
										)}
									</GridItem>
								</Grid>
							</GridItem>

						}
						{existsQualityVote(council.statute) && (
							<GridItem xs={12}>
								<Grid>
									<GridItem xs={3} md={3} lg={3}>
										<span>
											{translate.quality_vote}
										</span>
									</GridItem>
									<GridItem xs={4} md={4} lg={4}>
										<button
											title={translate.select_quality_vote}
											id="council-quality-vote-select"
											style={buttonStyle(primary)}
											onClick={() => setState({ selecting: 3 })}
										>
											{translate.select_quality_vote}
										</button>
									</GridItem>
									<GridItem xs={5} md={5} lg={5}>
										{state.data.qualityVoteName ? (
											state.data.qualityVoteName
										) : (
											<span
												style={{
													color: state.errors.qualityVote ?
														'red'
														: 'inherit'
												}}
											>
												{translate.not_selected}
											</span>
										)}
									</GridItem>
								</Grid>
							</GridItem>
						)}
					</Grid>
				</GridItem>
				<GridItem xs={12}>
					{councilHasVideo(council)
						&& <StartCouncilVideoOptions
							council={council}
							data={state.video}
							translate={translate}
							updateData={object => {
								setState({
									...state,
									video: {
										...state.video,
										...object
									}
								});
							}}
						/>
					}
				</GridItem>
				<GridItem xs={12}>
					{council.councilType !== COUNCIL_TYPES.ONE_ON_ONE
						&& <ConveneSelector
							council={council}
							translate={translate}
							convene={state.data.firstOrSecondConvene}
							changeConvene={changeConvene}
							recount={props.recount}
						/>
					}
				</GridItem>
			</Grid>
		);
	};

	if (!data.councilOfficials) {
		return <LoadingSection size={20} />;
	}

	if (council.councilType === 2 || council.councilType === 3) {
		return (
			<React.Fragment>
				<BasicButton
					text={translate.start_council}
					color={primary}
					id="start-council-button"
					textPosition="before"
					onClick={() => setState({
						alert: true
					})
					}
					icon={
						<Icon
							className="material-icons"
							style={{
								fontSize: '1.1em',
								color: 'white'
							}}
						>
							play_arrow
						</Icon>
					}
					buttonStyle={{ width: '11em' }}
					textStyle={{
						color: 'white',
						fontSize: '0.9em',
						fontWeight: '700',
						textTransform: 'none',
					}}
				/>
				<AlertConfirm
					title={translate.start_council}
					bodyText={forceStartWarning()}
					open={state.alert}
					loadingAction={state.loading}
					buttonAccept={translate.accept}
					buttonCancel={translate.cancel}
					acceptAction={startAuto}
					requestClose={() => setState({ alert: false })}
				/>
			</React.Fragment>
		);
	}

	return (
		<React.Fragment>
			<BasicButton
				text={translate.start_council}
				color={primary}
				id="start-council-button"
				textPosition="before"
				onClick={() => setState({
					alert: true
				})
				}
				icon={
					<Icon
						className="material-icons"
						style={{
							fontSize: '1.1em',
							color: 'white'
						}}
					>
						play_arrow
					</Icon>
				}
				textStyle={{
					color: 'white',
					fontSize: '0.9em',
					fontWeight: '700',
					textTransform: 'none',
				}}
			/>
			<AlertConfirm
				bodyStyle={{ width: !isMobile && '600px' }}
				title={translate.start_council}
				bodyText={startCouncilForm()}
				open={state.alert}
				loadingAction={state.loading || loadingSteps.status === 'loading'}
				buttonAccept={translate.accept}
				buttonCancel={loadingSteps.status === 'loading' ? null : loadingSteps.status === 'done' ? translate.close : translate.cancel}
				hideAccept={state.selecting !== 0 || loadingSteps.status !== 'idle'}
				modal={true}
				acceptAction={startCouncil}
				requestClose={
					loadingSteps.status === 'done' ?
						() => {
							props.refetch();
							setState({ alert: false });
						}
						: state.selecting === 0 ?
							() => setState({ alert: false })
							: () => setState({ selecting: 0 })
				}
			/>
		</React.Fragment>
	);
};

const startAutoCouncil = gql`
	mutation StartAutoCouncil($councilId: Int!){
		startAutoCouncil(councilId: $councilId){
			success
			message
		}
	}
`;


export default compose(
	graphql(startCouncilMutation, { name: 'startCouncil' }),
	graphql(startAutoCouncil, { name: 'startAutoCouncil' }),
	withApollo,
	graphql(councilOfficials, {
		options: props => ({
			variables: {
				councilId: props.council.id,
				options: {
					limit: 10,
					offset: 0
				}
			}
		})
	})
)(StartCouncilButton);
