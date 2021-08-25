import React from 'react';
import { TableCell, TableRow } from 'material-ui/Table';
import { Tooltip } from 'material-ui';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { getSecondary, getPrimary } from '../../../../styles/colors';
import * as CBX from '../../../../utils/CBX';
import {
	BasicButton,
	ButtonIcon,
	LoadingSection,
	EnhancedTable,
	Grid,
	GridItem,
	AlertConfirm,
	Scrollbar
} from '../../../../displayComponents';
import { downloadCBXData, updateConveneSends } from '../../../../queries';
import { convenedcouncilParticipants } from '../../../../queries/councilParticipant';
import { PARTICIPANTS_LIMITS, PARTICIPANT_STATES } from '../../../../constants';
import { useOldState, usePolling } from '../../../../hooks';
import AttendIntentionIcon from '../../../council/live/participants/AttendIntentionIcon';
import DownloadCBXDataButton from '../../../council/prepare/DownloadCBXDataButton';
import NotificationFilters from '../../../council/prepare/NotificationFilters';
import AddConvenedParticipantButton from '../../../council/prepare/modals/AddConvenedParticipantButton';
import AttendComment from '../../../council/prepare/modals/AttendComment';
import ConvenedParticipantEditor from '../../../council/prepare/modals/ConvenedParticipantEditor';
import StateIcon from '../../../council/live/participants/StateIcon';
import ParticipantContactEditor from './ParticipantContactEditor';
import NotificationsTable from '../../../notifications/NotificationsTable';
import AddGuestModal from '../../../council/live/participants/AddGuestModal';
import DeleteConvenedParticipantButton from './DeleteConvenedParticipantButton';

const formatParticipant = participant => {
	const { representing, ...newParticipant } = participant;
	let currentParticipant = newParticipant;

	if (participant.representatives.length > 0) {
		currentParticipant = {
			...newParticipant,
			representative: participant.representatives[0]
		};
	}

	if (participant.live.state === PARTICIPANT_STATES.DELEGATED) {
		currentParticipant = {
			...newParticipant,
			delegate: participant.live.representative
		};
	}
	return currentParticipant;
};


const CouncilDetailsParticipants = ({
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
		comment: null,
		intentionFilter: null
	});
	const [data, setData] = React.useState(null);
	const [addGuest, setAddGuest] = React.useState(false);
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
	const secondary = getSecondary();

	const getData = React.useCallback(async () => {
		// liveParticipantsCredentials

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

	React.useEffect(() => {
		// refreshEmailStates();
	}, [council.id]);


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

	const closeParticipantEditor = () => {
		getData();
		setState({ editingParticipant: false });
	};

	const updateNotificationFilter = object => {
		setFilters({
			...filters,
			...object
		});
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
			text: translate.state,
			name: 'name',
			canOrder: false
		},
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
		{
			text: translate.votes,
			name: 'numParticipations',
			canOrder: true
		}
	];

	if (participations) {
		headers.push({
			text: translate.census_type_social_capital,
			name: 'socialCapital',
			canOrder: true
		});
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
			headers.push({ text: '' });
		}
	} else {
		headers.push({
			text: translate.convene
		});
		headers.push({ text: '' });
	}

	const menuButtons = () => (
		<>
			<div style={{
				display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '0.3em'
			}}>
				{!hideNotifications
					&& <Tooltip
						title={
							translate.tooltip_refresh_convene_email_state_assistance
						}
					>
						<div>
							<BasicButton
								floatRight
								text={translate.refresh_convened}
								color={secondary}
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
				<>
					<BasicButton
						floatRight
						disabled={CBX.councilIsFinished(council)}
						text={translate.add_guest}
						color="white"
						buttonStyle={{
							margin: '0',
							marginRight: '1.2em',
							border: `1px solid ${secondary}`
						}}
						textStyle={{
							color: secondary,
							fontWeight: '700',
							fontSize: '0.9em',
							textTransform: 'none'
						}}
						textPosition="after"
						onClick={() => setAddGuest(true)}
					/>
					<AddGuestModal
						show={addGuest}
						requestClose={() => setAddGuest(false)}
						refetch={refetch}
						council={council}
						translate={translate}
					/>
				</>
				{!hideAddParticipant
					&& <div>
						<AddConvenedParticipantButton
							participations={participations}
							translate={translate}
							councilId={council.id}
							council={council}
							refetch={refetch}
						/>
					</div>
				}
			</div>
		</>
	);

	return (
		<div style={{ width: '100%', height: 'calc( 100%  - 10em )', marginTop: '3.5em' }}>
			<React.Fragment>
				<Grid style={{ margin: '0.5em 0.5em' }}>
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
				<Scrollbar>
					<div style={{ padding: '1em' }}>
						{councilParticipants ?
							<EnhancedTable
								ref={table}
								translate={translate}
								menuButtons={menuButtons()}
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
										const formatDataParticipant = formatParticipant(item);
										return (
											<React.Fragment
												key={`participant${formatDataParticipant.id}_${filters.notificationStatus}`}
											>
												<HoverableRow
													translate={translate}
													participant={formatDataParticipant}
													representative={formatDataParticipant.representative}
													showModalComment={showModalComment}
													cbxData={false}
													participations={participations}
													editParticipant={() => {
														if (!props.cantEdit) {
															setState({
																editingParticipant: true,
																participant: formatDataParticipant
															});
														}
													}}
													council={council}
													totalVotes={data.councilTotalVotes}
													socialCapital={data.councilSocialCapital}
													refetch={getData}
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
					</div>
				</Scrollbar>
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
// editar credenciales solo del representante
const HoverableRow = ({
	translate, participant, hideNotifications, totalVotes, socialCapital, council, editParticipant, representative, refetch, ...props
}) => {
	const [showActions, setShowActions] = React.useState(false);
	const [credentials, setCredentials] = React.useState(false);
	const mouseEnterHandler = () => {
		setShowActions(true);
	};

	const mouseLeaveHandler = () => {
		setShowActions(false);
	};
	const { delegate, notifications } = participant;

	const voteParticipantInfo = (
		participant.live.state === PARTICIPANT_STATES.DELEGATED ?
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


	return (
		<React.Fragment>
			<AlertConfirm
				requestClose={() => setCredentials(false)}
				open={!!credentials}
				buttonCancel={translate.cancel}
				bodyText={
					credentials === 'participant' ?
						<div>
							<div style={{ color: 'black', marginBottom: '.5em' }}>Credenciales de: {`${participant.name} ${participant.surname
								}  ${(participant.live.state === PARTICIPANT_STATES.DELEGATED
									&& participant.representatives.length > 0) ? ` - ${translate.represented_by}: ${participant.representatives[0].name} ${participant.representatives[0].surname || ''}` : ''}`}</div>
							<div style={{}}>
								<ParticipantContactEditor
									participant={participant.live}
									translate={translate}
									refetch={refetch}
									key={participant.live.id}
									council={council}
								/>
							</div>
							<div style={{ padding: '1em 0px' }}>
								<NotificationsTable
									maxEmail={{ maxWidth: '100px' }}
									translate={translate}
									notifications={participant.live.notifications}
								/>
							</div>
						</div>
						: representative && representative.live
						&& <div>
							<div style={{ color: 'black', marginBottom: '.5em' }}>Credenciales de: {representative.live.name} {representative.live.surname}</div>
							<div style={{}}>
								<ParticipantContactEditor
									participant={representative.live}
									translate={translate}
									refetch={refetch}
									key={representative.live.id}
									council={council}
								/>
							</div>
							<div style={{ padding: '1em 0px' }}>
								<NotificationsTable
									maxEmail={{ maxWidth: '100px' }}
									translate={translate}
									notifications={representative.live.notifications}
								/>
							</div>
						</div>
				}
				title={'Administrador de credenciales'}
			/>
			<TableRow
				hover
				onMouseOver={mouseEnterHandler}
				onMouseLeave={mouseLeaveHandler}

				style={{
					height: '7em'
				}}
			>
				<TableCell>
					{representative ?
						<div>
							<div><StateIcon state={participant.live.state} translate={translate} ratio={1.4} /></div>
							<div><StateIcon state={representative.live.state} translate={translate} ratio={1.4} /></div>
						</div>
						: <StateIcon state={participant.live.state} translate={translate} ratio={1.4} />
					}
				</TableCell>
				<TableCell>
					<div style={{ fontWeight: '700', marginBottom: '0.2em' }}>{`${participant.name} ${participant.surname
						}  ${(participant.live.state === PARTICIPANT_STATES.DELEGATED
							&& participant.representatives.length > 0) ? ` - ${translate.represented_by}: ${participant.representatives[0].name} ${participant.representatives[0].surname || ''}` : ''}`}
					</div>
					{voteParticipantInfo}
				</TableCell>
				<TableCell>
					<div style={{ marginBottom: '0.2em' }}>{participant.dni}</div>
					{!!representative
						&& <React.Fragment>
							<br />
							{representative.dni}
						</React.Fragment>
					}
				</TableCell>
				<TableCell>
					<div style={{ marginBottom: '0.2em' }}>{participant.position}</div>
					{!!representative
						&& <React.Fragment>
							<br />
							{representative.position}
						</React.Fragment>
					}
				</TableCell>
				<TableCell>
					{`${participant.numParticipations
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
				{props.participations && (
					<TableCell>
						{`${participant.socialCapital
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

				{props.cbxData
					&& <TableCell>
						<div style={{ width: '4em' }}>
							{showActions
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
									title={translate[CBX.getTranslationReqCode(notifications[0].reqCode)]}
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
						{CBX.councilHasAssistanceConfirmation(council)
							&& (
								<TableCell>
									<AttendIntentionIcon
										participant={participant.live}
										representative={participant.representatives.length > 0 ? participant.representative.live : null}
										council={council}
										showCommentIcon={participant.representatives.length > 0 ? !!participant.representative.live.assistanceComment : !!participant.live.assistanceComment}
										onCommentClick={props.showModalComment({
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
						<TableCell>
							<div style={{ display: 'flex' }}>
								<div style={{
									color: getPrimary(), position: 'relative', marginRight: '1.5em', cursor: 'pointer',
								}} onClick={editParticipant}>
									<div style={{ fontSize: '20px' }}>
										<i className="fa fa-pencil-square-o" aria-hidden="true"></i>
									</div>
								</div>
								<div>
									<DeleteConvenedParticipantButton
										translate={translate}
										participant={participant}
										refetch={refetch}
									/>
								</div>
							</div>
						</TableCell>
					</React.Fragment>
				}
			</TableRow>
		</React.Fragment>
	);
};

export default compose(
	graphql(updateConveneSends, {
		name: 'updateConveneSends'
	}),
	graphql(downloadCBXData, {
		name: 'downloadCBXData'
	}),
	withApollo
)(CouncilDetailsParticipants);
