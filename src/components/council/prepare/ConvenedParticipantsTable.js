import React from 'react';
import { TableCell, TableRow } from 'material-ui/Table';
import { Tooltip, Card } from 'material-ui';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { getSecondary } from '../../../styles/colors';
import * as CBX from '../../../utils/CBX';
import {
	BasicButton,
	ButtonIcon,
	LoadingSection,
	EnhancedTable,
	Grid,
	GridItem
} from '../../../displayComponents';
import { downloadCBXData, updateConveneSends } from '../../../queries';
import { convenedcouncilParticipants } from '../../../queries/councilParticipant';
import { COUNCIL_TYPES, PARTICIPANTS_LIMITS, PARTICIPANT_STATES } from '../../../constants';
import NotificationFilters from './NotificationFilters';
import DownloadCBXDataButton from './DownloadCBXDataButton';
import ConvenedParticipantEditor from './modals/ConvenedParticipantEditor';
import AttendIntentionIcon from '../live/participants/AttendIntentionIcon';
import AttendComment from './modals/AttendComment';
import { isMobile } from '../../../utils/screen';
import { useOldState, usePolling } from '../../../hooks';
import DropdownParticipant from '../../../displayComponents/DropdownParticipant';

const formatParticipant = participant => {
	let { ...newParticipant } = participant;

	if (participant.representatives.length > 0) {
		newParticipant = {
			...participant,
			representative: participant.representatives[0]
		};
	}

	if (participant.live.state === PARTICIPANT_STATES.DELEGATED) {
		newParticipant = {
			...newParticipant,
			delegate: participant.live.representative
		};
	}
	return newParticipant;
};

const ConvenedParticipantsTable = ({
	client, translate, council, participations, hideNotifications, hideAddParticipant, ...props
}) => {
	const [filters, setFilters] = React.useState({
		options: {
			limit: PARTICIPANTS_LIMITS[0],
			// page: 1,
			offset: 0,
			orderBy: 'name',
			orderDirection: 'asc',
		},
		filters: [],
		attendanceIntention: null,
		notificationStatus: null,
		intentionFilter: null
	});

	const [data, setData] = React.useState(null);
	const [loading, setLoading] = React.useState(true);
	const [refreshing, setRefreshing] = React.useState(false);
	const [state, setState] = useOldState({
		editingParticipant: false,
		participant: {},
		loadingRefresh: false,
		showCommentModal: false,
		showComment: '',
	});
	const table = React.useRef();

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: convenedcouncilParticipants,
			variables: {
				councilId: council.id,
				notificationStatus: filters.notificationStatus,
				attendanceIntention: filters.attendanceIntention,
				comment: filters.comment,
				options: filters.options,
				filters: filters.filters
			}
		});

		setData(response.data);
		setLoading(false);
	}, [council.id, filters]);

	React.useEffect(() => {
		getData();
	}, [getData]);

	usePolling(getData, 9000);

	const refreshEmailStates = async () => {
		setRefreshing(true);
		const response = await props.updateConveneSends({
			variables: {
				councilId: council.id
			}
		});

		if (response.data.updateConveneSends.success) {
			getData();
			setRefreshing(false);
		}
	};

	React.useEffect(() => {
		refreshEmailStates();
	}, [council.id]);

	usePolling(CBX.councilIsNotified(council) ? refreshEmailStates : () => { }, 60000);

	const closeParticipantEditor = () => {
		getData();
		setState({ editingParticipant: false });
	};

	const updateNotificationFilter = object => {
		setFilters({
			...filters,
			options: {
				...filters.options,
				limit: PARTICIPANTS_LIMITS[0],
				offset: 0,
			},
			...object
		});
		table.current.setPage(1);
	};

	const updateFilters = object => {
		setFilters({
			...filters,
			...object
		});
	};

	const showModalComment = comment => event => {
		event.stopPropagation();
		setState({
			showCommentModal: true,
			showComment: comment
		});
	};

	if (loading) {
		return <LoadingSection />;
	}

	const refetch = getData;
	const councilParticipants = data.councilParticipantsWithNotifications;
	const { participant, editingParticipant } = state;

	const headers = [
		{
			text: translate.name,
			name: 'name',
			canOrder: true
		},
		{
			text: translate.dni,
			name: 'dni',
			canOrder: true
		},
		{ text: translate.position },
	];

	if (council.councilType !== COUNCIL_TYPES.ONE_ON_ONE) {
		headers.push({
			text: translate.votes,
			name: 'numParticipations',
			canOrder: true
		});
		if (participations) {
			headers.push({
				text: translate.census_type_social_capital,
				name: 'socialCapital',
				canOrder: true
			});
		}
	}

	if (CBX.councilIsNotified(council)) {
		if (!hideNotifications) {
			headers.push({
				text: translate.convene
			});
			if (CBX.councilHasAssistanceConfirmation(council)) {
				headers.push({
					text: translate.assistance_intention
				});
			}
		}
	}

	headers.push({ text: '' });
	return (
		<div style={{ width: '100%', height: '100%' }}>
			<React.Fragment>
				<Grid style={{ margin: '0.5em 0' }}>
					<GridItem xs={12} lg={6} md={6}>
						{!hideNotifications
							&& <NotificationFilters
								translate={translate}
								refetch={updateNotificationFilter}
								council={council}
							/>
						}
					</GridItem>
				</Grid>
				{councilParticipants ?
					<EnhancedTable
						ref={table}
						activeTableShowing={true}
						translate={translate}
						menuButtons={
							<div style={{
								display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '0.3em'
							}}>
								{!hideNotifications
									&& <Tooltip
										title={
											translate.tooltip_refresh_convene_email_state_assistance
										}
									>
										<div style={{
											display: 'flex',
										}}>
											<BasicButton
												floatRight
												text={translate.refresh_convened}
												color={getSecondary()}
												loading={refreshing}
												buttonStyle={{
													margin: '0',
													marginRight: '1.2em'
												}}
												textStyle={{
													color: 'white',
													fontWeight: '700',
													fontSize: '0.9em',
													textTransform: 'none'
												}}
												icon={
													<ButtonIcon
														color="white"
														type="refresh"
													/>
												}
												textPosition="after"
												onClick={refreshEmailStates}
											/>
										</div>
									</Tooltip>
								}
								{!hideAddParticipant
									&& <div>
										<DropdownParticipant
											participations={participations}
											council={council}
											translate={translate}
											refetch={refetch}
											style={{
												width: '10em',
												padding: '.2rem',
												margin: '0 .5rem',
											}}
										/>
									</div>
								}
							</div>
						}
						defaultLimit={filters.options.limit}
						defaultFilter={'fullName'}
						defaultOrder={['name', 'asc']}
						limits={PARTICIPANTS_LIMITS}
						page={filters.page}
						loading={loading}
						length={councilParticipants.list.length}
						total={councilParticipants.total}
						refetch={updateFilters}
						headers={headers}
					>
						{councilParticipants.list.map(
							item => {
								const participantData = formatParticipant(item);
								return (
									<React.Fragment
										key={`participant${participantData.id}_${filters.notificationStatus}`}
									>
										<HoverableRow
											translate={translate}
											participant={participantData}
											representative={participantData.representative}
											showModalComment={showModalComment}
											cbxData={false}
											participations={participations}
											editParticipant={() => {
												if (!props.cantEdit) {
													setState({
														editingParticipant: true,
														participant: participantData
													});
												}
											}}
											council={council}
											{...props}
										/>
									</React.Fragment>
								);
							}
						)}
					</EnhancedTable>
					: <div
						style={{
							height: '10em',
							display: 'flex',
							alignItems: 'center'
						}}
					>
						<LoadingSection />
					</div>
				}
				{editingParticipant
					&& <ConvenedParticipantEditor
						key={participant.id}
						translate={translate}
						close={closeParticipantEditor}
						councilId={council.id}
						council={council}
						participations={participations}
						participant={participant}
						opened={editingParticipant}
						refetch={refetch}
					/>
				}
				<AttendComment
					requestClose={() => setState({
						showCommentModal: false,
						showComment: false
					})}
					open={state.showCommentModal}
					comment={state.showComment}
					translate={translate}
				/>
			</React.Fragment>
			{props.children}
		</div>
	);
};

class HoverableRow extends React.Component {
	state = {
		showActions: false
	}

	mouseEnterHandler = () => {
		this.setState({
			showActions: true
		});
	}

	mouseLeaveHandler = () => {
		this.setState({
			showActions: false
		});
	}

	render() {
		const {
			translate,
			participant,
			hideNotifications,
			totalVotes,
			socialCapital,
			council,
			editParticipant
		} = this.props;
		const { representative } = this.props;
		const { delegate, notifications } = participant;

		const voteParticipantInfo = (
			(participant.live.state === PARTICIPANT_STATES.DELEGATED && delegate) ?
				<React.Fragment>
					<br />
					{`${translate.delegated_in}: ${delegate.name} ${delegate.surname || ''}`}
				</React.Fragment>
				: !!representative
				&& <React.Fragment>
					<br />
					{`${translate.represented_by}: ${representative.name} ${representative.surname || ''}`}
				</React.Fragment>
		);

		if (isMobile) {
			return (
				<Card
					style={{ marginBottom: '0.5em', padding: '0.3em', position: 'relative' }}
					onClick={editParticipant}
				>
					<Grid>
						<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
							{translate.participant_data}
						</GridItem>
						<GridItem xs={7} md={7}>
							<span style={{ fontWeight: '700' }}>{`${participant.name} ${participant.surname || ''} ${representative ? ` - ${translate.represented_by}: ${representative.name} ${representative.surname || ''}` : ''}`}</span>
							{voteParticipantInfo}
						</GridItem>
						<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
							{translate.dni}
						</GridItem>
						<GridItem xs={7} md={7}>
							{representative ?
								<React.Fragment>
									{representative.dni}
								</React.Fragment>
								: participant.dni
							}
						</GridItem>
						<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
							{translate.position}
						</GridItem>
						<GridItem xs={7} md={7}>
							{representative ?
								<React.Fragment>
									{representative.position}
								</React.Fragment>
								: participant.position
							}
						</GridItem>
						<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
							{translate.votes}
						</GridItem>
						<GridItem xs={7} md={7}>
							{`${CBX.showNumParticipations(participant.numParticipations, this.props.company, council.statute)
								} (${participant.numParticipations > 0 ? (
									(participant.numParticipations
										/ totalVotes)
									* 100
								).toFixed(2) : 0}%)`}
							{!!representative
								&& <React.Fragment>
									<br />
								</React.Fragment>
							}
						</GridItem>
						{this.props.participations && (
							<React.Fragment>
								<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
									{translate.census_type_social_capital}
								</GridItem>
								<GridItem xs={7} md={7}>
									{!CBX.isRepresentative(participant)
										&& `${participant.socialCapital} (${participant.socialCapital > 0 ? (
											(participant.socialCapital
												/ socialCapital)
											* 100).toFixed(2) : 0}%)`
									}

								</GridItem>
							</React.Fragment>
						)}
					</Grid>
					<div style={{ position: 'absolute', top: '5px', right: '5px' }}>
						<DownloadCBXDataButton
							translate={translate}
							participantId={participant.live.id}
						/>
					</div>
				</Card>
			);
		}

		return (
			<TableRow
				hover
				onMouseOver={this.mouseEnterHandler}
				onMouseLeave={this.mouseLeaveHandler}
				onClick={editParticipant}
				style={{
					cursor: 'pointer'
				}}
			>
				<TableCell>
					<span style={{ fontWeight: '700' }}>{`${participant.name} ${participant.surname
						}  ${(participant.live.state === PARTICIPANT_STATES.DELEGATED
							&& participant.representatives.length > 0) ? ` - ${translate.represented_by}: ${participant.representatives[0].name} ${participant.representatives[0].surname || ''}` : ''}`}</span>
					{voteParticipantInfo}
				</TableCell>
				<TableCell>
					{participant.dni}
					{!!representative
						&& <React.Fragment>
							<br />
							{representative.dni}
						</React.Fragment>
					}
				</TableCell>
				<TableCell>
					{participant.position}
					{!!representative
						&& <React.Fragment>
							<br />
							{representative.position}
						</React.Fragment>
					}
				</TableCell>
				{council.councilType !== COUNCIL_TYPES.ONE_ON_ONE
					&& <>
						<TableCell>
							{`${CBX.showNumParticipations(participant.numParticipations, this.props.company, council.statute)
								} (${participant.numParticipations > 0 ? (
									(participant.numParticipations
										/ totalVotes)
									* 100
								).toFixed(2) : 0}%)`}
							{!!representative
								&& <React.Fragment>
									<br />
								</React.Fragment>
							}
						</TableCell>
						{this.props.participations && (
							<TableCell>
								{`${CBX.showNumParticipations(participant.socialCapital, this.props.company, council.statute)
									} (${participant.socialCapital > 0 ?
										((participant.socialCapital / socialCapital) * 100).toFixed(2)
										: 0
									}%)`}
								{!!representative
									&& <React.Fragment>
										<br />
									</React.Fragment>
								}
							</TableCell>
						)}
					</>

				}
				{this.props.cbxData
					&& <TableCell>
						<div style={{ width: '4em' }}>
							{this.state.showActions
								&& <DownloadCBXDataButton
									translate={translate}
									participantId={participant.live.id}
								/>
							}
						</div>
					</TableCell>

				}
				{!hideNotifications
					&& <React.Fragment>
						<TableCell>

							{notifications.length > 0 ? (
								<Tooltip
									title={
										translate[CBX.getTranslationReqCode(notifications[0].reqCode)]}
								>
									<img
										style={{
											height:
												'2.1em',
											width:
												'auto'
										}}
										src={CBX.getEmailIconByReqCode(
											notifications[0].reqCode
										)}
										alt="email-state-icon"
									/>
								</Tooltip>
							) : (
								''
							)}
						</TableCell>
						{CBX.councilHasAssistanceConfirmation(
							council
						) && (
							<TableCell>
								<AttendIntentionIcon
									participant={participant.live}
									representative={participant.representatives.length > 0 ? participant.representative.live : null}
									council={council}
									showCommentIcon={participant.representatives.length > 0 ? !!participant.representative.live.assistanceComment : !!participant.live.assistanceComment}
									onCommentClick={this.props.showModalComment({
										text: participant.representatives.length > 0 ? participant.representative.live.assistanceComment : participant.live.assistanceComment,
										author: participant.representatives.length > 0 ?
												`${participant.name} ${participant.surname || ''} - ${translate.represented_by} ${representative.name} ${representative.surname || ''}`
											: `${participant.name} ${participant.surname || ''}`
									})}
									translate={translate}
									size="2em"
								/>
							</TableCell>
						)}
					</React.Fragment>
				}
			</TableRow>
		);
	}
}

export default compose(
	graphql(updateConveneSends, {
		name: 'updateConveneSends'
	}),
	graphql(downloadCBXData, {
		name: 'downloadCBXData'
	}),
	withApollo
)(ConvenedParticipantsTable);
