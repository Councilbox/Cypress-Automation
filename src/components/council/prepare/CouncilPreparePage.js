import React from 'react';
import { Divider, MenuItem, Paper } from 'material-ui';
import { graphql, withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import gql from 'graphql-tag';
import {
	BasicButton,
	CardPageLayout,
	DropDownMenu,
	ErrorWrapper,
	Icon,
	Scrollbar,
	LoadingSection
} from '../../../displayComponents';
import { getPrimary, getSecondary } from '../../../styles/colors';
import { bHistory } from '../../../containers/App';
import * as CBX from '../../../utils/CBX';
import ReminderModal from './modals/ReminderModal';
import RescheduleModal from './modals/RescheduleModal';
import SendConveneModal from './modals/SendConveneModal';
import CancelModal from './modals/CancelModal';
import Convene from '../convene/Convene';
import withSharedProps from '../../../HOCs/withSharedProps';
import ConvenedParticipantsTable from './ConvenedParticipantsTable';
import { useOldState } from '../../../hooks';
import { ConfigContext } from '../../../containers/AppControl';
import DelegationRestriction from '../editor/DelegationRestriction';
import MenuSuperiorTabs from '../../dashboard/MenuSuperiorTabs';
import ShareholdersRequestsPage from './shareholders/ShareholdersRequestsPage';
import EstimatedQuorum from './EstimatedQuorum';
import AttachmentsModal from './AttachmentsModal';
import { COUNCIL_TYPES } from '../../../constants';


const CouncilPreparePage = ({
	company, translate, data, ...props
}) => {
	const [state, setState] = useOldState({
		participants: false,
		sendReminder: false,
		sendConvene: false,
		cancel: false,
		selectedTab: 2,
		rescheduleCouncil: false
	});
	const config = React.useContext(ConfigContext);
	const [selecteReuniones, setSelecteReuniones] = React.useState(translate.convene);
	const primary = getPrimary();
	const secondary = getSecondary();

	React.useEffect(() => {
		if (data.council) {
			CBX.checkCouncilState(
				{
					state: data.council.state,
					id: data.council.id
				},
				company,
				bHistory,
				'convened'
			);
		}
	}, [data]);

	const goToPrepareRoom = () => {
		bHistory.push(
			`/company/${company.id}/council/${props.match.params.id}/live`
		);
	};

	const {
		council, error, loading, refetch
	} = data;

	if (loading) {
		return <LoadingSection />;
	}

	if (error) {
		return <ErrorWrapper error={error} translate={translate} />;
	}

	const getTabs = () => {
		const tabs = [
			{
				text: translate.convene,
			},
			{
				text: translate.new_list_called /** TRADUCCION CAMBIAR POR LISTA DE PARTICIPANTES */,
			},
		];

		if (config.councilDelegates && council.statute.existsDelegatedVote && !CBX.isAppointment(council)) {
			tabs.push({
				text: translate.delegations,
			});
		}

		if (council.statute.shareholdersPortal) {
			tabs.push({
				text: 'Solicitudes de participación'
			});
		}

		return tabs.map(item => item.text);
	};

	return (
		<CardPageLayout title={translate.setup_meeting} disableScroll>
			<div style={{
				width: '100%', padding: '1.7em', paddingBottom: '0.5em', height: 'calc(100% - 3.5em)', paddingTop: '0em'
			}}>
				<div style={{ display: 'flex', marginTop: '0.6em' }}>
					<div style={{ fontSize: '13px' }}>
						<MenuSuperiorTabs
							items={getTabs()}
							setSelect={setSelecteReuniones}
							selected={selecteReuniones}
						/>
					</div>
				</div>
				{selecteReuniones === translate.convene
					&& <div style={{ height: 'calc(100% - 38px)' }}>
						<Scrollbar>
							<div style={{
								width: '100%', position: 'relative', padding: '1em', paddingBottom: '1.3em'
							}}>
								<Convene
									council={council}
									translate={translate}
								/>
							</div>
						</Scrollbar>
					</div>
				}
				{selecteReuniones === translate.new_list_called
					&& <div style={{ height: 'calc(100% - 38px)' }}>
						<Scrollbar>
							<div
								style={{
									padding: '1.2em',
									height: '100%'
								}}
							>
								{(CBX.councilHasAssistanceConfirmation(council) && council.councilType !== COUNCIL_TYPES.ONE_ON_ONE)
									&& <EstimatedQuorum
										council={council}
										company={company}
										totalVotes={data.councilTotalVotes}
										socialCapital={data.councilSocialCapital}
										translate={translate}
									/>
								}
								<ConvenedParticipantsTable
									council={council}
									company={company}
									hideAddParticipant={council.councilType === 5}
									totalVotes={data.councilTotalVotes}
									socialCapital={data.councilSocialCapital}
									participations={CBX.hasParticipations(council)}
									translate={translate}
									refetch={refetch}
								/>
							</div>
						</Scrollbar>
					</div>
				}
				{selecteReuniones === translate.delegations
					&& <div style={{ height: 'calc(100% - 38px)' }}>
						<Scrollbar>
							<div
								style={{
									padding: '1.2em',
									height: '100%'
								}}
							>
								<DelegationRestriction translate={translate} council={council} fullScreen={true} />
							</div>
						</Scrollbar>
					</div>
				}
				{selecteReuniones === 'Solicitudes de participación'
					&& <ShareholdersRequestsPage
						council={council}
						translate={translate}
					/>
				}
			</div>
			{/* <div style={{ height: '100%' }}>
<div style={{ height: 'calc(100% - 3.5em)', padding: '1em', paddingTop: 0, paddingBottom: 0, overflow: 'hidden', position: 'relative' }}>
<div style={{ height: 'calc(100% - 1em)', borderBottom: '1px solid gainsboro' }}>
<TabsScreen
uncontrolled={true}
tabsInfo={getTabs()}
/>
</div>
</div> */}
			<ReminderModal
				show={state.sendReminder}
				council={council}
				requestClose={() => setState({ sendReminder: false })}
				translate={translate}
			/>
			<CancelModal
				show={state.cancel}
				council={council}
				requestClose={() => setState({ cancel: false })}
				translate={translate}
			/>
			<SendConveneModal
				show={state.sendConvene}
				council={council}
				refetch={refetch}
				requestClose={() => setState({ sendConvene: false })}
				translate={translate}
			/>
			<AttachmentsModal
				open={state.attachmentsModal}
				council={council}
				refetch={refetch}
				company={company}
				translate={translate}
				requestClose={() => { setState({ ...state, attachmentsModal: false }); }}
			/>
			<RescheduleModal
				show={state.rescheduleCouncil}
				council={council}
				requestClose={() => setState({ rescheduleCouncil: false })
				}
				translate={translate}
			/>
			<div
				style={{
					height: '3.5em',
					width: '100%',
					display: 'flex',
					justifyContent: 'flex-end',
					paddingRight: '1.2em',
					alignItems: 'center',
					borderTop: '1px solid gainsboro'
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<div>
						<BasicButton
							text={council.councilType === 4 ? translate.manage : translate.prepare_room}
							id={'prepararSalaNew'}
							color={primary}
							buttonStyle={{
								margin: '0',
								minWidth: '12em'
							}}
							textStyle={{
								color: 'white',
								fontWeight: '700',
								marginLeft: '0.3em',
								fontSize: '0.9em',
								textTransform: 'none'
							}}
							icon={
								<FontAwesome
									name={'user-plus'}
									style={{
										fontSize: '1em',
										color: 'white',
										marginLeft: '0.3em'
									}}
								/>
							}
							textPosition="after"
							onClick={goToPrepareRoom}
						/>
					</div>
					<DropDownMenu
						color="transparent"
						Component={() => <Paper
							elevation={1}
							style={{
								boxSizing: 'border-box',
								padding: '0',
								width: '5em',
								height: '36px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								border: `1px solid ${primary}`,
								marginLeft: '0.3em'
							}}
						>
							<MenuItem
								style={{
									width: '100%',
									height: '100%',
									margin: 0,
									padding: 0,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}
							>
								<FontAwesome
									name={'bars'}
									style={{
										cursor: 'pointer',
										fontSize: '0.8em',
										height: '0.8em',
										color: primary
									}}
								/>
								<Icon
									className="material-icons"
									style={{ color: primary }}
								>
									keyboard_arrow_down
								</Icon>
							</MenuItem>
						</Paper>
						}
						textStyle={{ color: primary }}
						items={
							<React.Fragment>
								{CBX.councilIsNotified(council) ? (
									<MenuItem
										onClick={() => setState({
											sendReminder: true
										})
										}
									>
										<Icon
											className="material-icons"
											style={{
												color: secondary,
												marginRight: '0.4em'
											}}
										>
											update
										</Icon>
										{translate.send_reminder}
									</MenuItem>
								) : (
									<MenuItem
										onClick={() => setState({
											sendConvene: true
										})
										}
									>
										<Icon
											className="material-icons"
											style={{
												color: secondary,
												marginRight: '0.4em'
											}}
										>
											notifications
										</Icon>
										{translate.send_notification}
									</MenuItem>
								)}
								<MenuItem
									onClick={() => setState({
										attachmentsModal: true
									})
									}
								>
									<Icon
										className="material-icons"
										style={{
											color: secondary,
											marginRight: '0.4em'
										}}
									>
										attach_file
									</Icon>
									{translate.add_additional_documentation}
								</MenuItem>
								<MenuItem
									onClick={() => setState({
										rescheduleCouncil: true
									})
									}
								>
									<Icon
										className="material-icons"
										style={{
											color: secondary,
											marginRight: '0.4em'
										}}
									>
										schedule
									</Icon>
									{translate.reschedule_council}
								</MenuItem>
								<Divider light />
								<MenuItem
									onClick={() => setState({ cancel: true })
									}
								>
									<Icon
										className="material-icons"
										style={{
											color: 'red',
											marginRight: '0.4em'
										}}
									>
										highlight_off
									</Icon>
									{translate.cancel_council}
								</MenuItem>
							</React.Fragment>
						}
					/>
				</div>
			</div>
		</CardPageLayout>
	);
};


export default graphql(gql`
	query CouncilDetails($councilID: Int!) {
		council(id: $councilID) {
			active
			attachments {
				councilId
				filename
				filesize
				filetype
				id
			}
			businessName
			city
			companyId
			confirmAssistance
			conveneText
			councilStarted
			councilType
			country
			countryState
			currentQuorum
			dateEnd
			dateOpenRoom
			dateRealStart
			dateStart
			dateStart2NdCall
			duration
			emailText
			firstOrSecondConvene
			fullVideoRecord
			hasLimitDate
			headerLogo
			id
			limitDateResponse
			name
			neededQuorum
			noCelebrateComment
			president
			proposedActSent
			prototype
			quorumPrototype
			satisfyQuorum
			secretary
			securityKey
			securityType
			selectedCensusId
			sendDate
			sendPointsMode
			shortname
			state
			statute {
				id
				prototype
				councilId
				statuteId
				title
				shareholdersPortal
				existPublicUrl
				addParticipantsListToAct
				existsAdvanceNoticeDays
				advanceNoticeDays
				existsSecondCall
				minimumSeparationBetweenCall
				canEditConvene
				canEarlyVote
				requireProxy
				firstCallQuorumType
				firstCallQuorum
				firstCallQuorumDivider
				secondCallQuorumType
				secondCallQuorum
				secondCallQuorumDivider
				existsDelegatedVote
				decimalDigits
				delegatedVoteWay
				existMaxNumDelegatedVotes
				maxNumDelegatedVotes
				existsLimitedAccessRoom
				limitedAccessRoomMinutes
				existsQualityVote
				qualityVoteOption
				canUnblock
				canAddPoints
				canReorderPoints
				existsAct
				existsWhoSignTheAct
				includedInActBook
				includeParticipantsList
				existsComments
				conveneHeader
				intro
				constitution
				conclusion
				actTemplate
				censusId
			}
			street
			tin
			videoEmailsDate
			videoMode
			videoRecodingInitialized
			votationType
			weightedVoting
			zipcode
		}
		councilTotalVotes(councilId: $councilID)
		councilSocialCapital(councilId: $councilID)
	}
`, {
	name: 'data',
	options: props => ({
		variables: {
			councilID: +props.match.params.id
		},
		pollInterval: 10000
	})
})(withApollo(withSharedProps()(withRouter(CouncilPreparePage))));
