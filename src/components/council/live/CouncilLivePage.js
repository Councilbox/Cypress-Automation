import React from 'react';
import {
	Tooltip, Badge, Tabs, Tab
} from 'material-ui';
import { DisabledSection, FabButton, Icon } from '../../../displayComponents';
import LiveHeader from './LiveHeader';
import { darkGrey, getPrimary } from '../../../styles/colors';
import AgendaManager from './AgendaManager';
import ParticipantsManager from './participants/ParticipantsManager';
import CommentWall from './commentWall/CommentWall';
import { showVideo } from '../../../utils/CBX';
import { config, videoVersions } from '../../../config';
import CMPVideoIFrame from './video/CMPVideoIFrame';
import { useOldState } from '../../../hooks';
import { isMobile } from '../../../utils/screen';
import QuorumDisplay from './quorum/QuorumDisplay';
import { COUNCIL_STATES, COUNCIL_TYPES } from '../../../constants';
import ResumeCouncilButton from './menus/ResumeCouncilButton';
import OneOnOneAttachmentsList from './oneOnOne/OneOnOneAttachmentsList';
import AppointmentParticipantsManager from './oneOnOne/AppointmentParticipantsManager';
import ParticipantsLive from './video/ParticipantsLive';


const calcMinWidth = () => (window.innerWidth * 0.38 > 450 ? 35 : 100 / (window.innerWidth / 450));
const calcMinHeight = () => '42vh';

let minVideoWidth = calcMinWidth();
let minVideoHeight = calcMinHeight();

const initScreenSizes = size => {
	const sizes = {
		MIN: () => {
			localStorage.setItem('screenSize', 'MIN');
			return ({
				videoWidth: minVideoWidth,
				videoHeight: minVideoHeight,
				fullScreen: false,
				screenSize: 'MIN'
			});
		},
		MED: () => {
			localStorage.setItem('screenSize', 'MED');
			return {
				videoWidth: minVideoWidth * 1.40,
				videoHeight: '56vh',
				fullScreen: false,
				tab: 'AGENDA',
				screenSize: 'MED'
			};
		},
		MAX: () => {
			localStorage.setItem('screenSize', 'MAX');
			return {
				fullScreen: true,
				videoWidth: 94,
				videoHeight: '100%',
				tab: 'AGENDA',
				screenSize: 'MAX'
			};
		}
	};

	return sizes[size] ? sizes[size]() : sizes.MIN();
};

const LIVE_TABS = {
	ATTACHMENTS: 'ATTACHMENTS',
	AGENDA: 'AGENDA',
	PARTICIPANTS: 'PARTICIPANTS'
};

const getInitialTab = council => {
	if (council.councilType === COUNCIL_TYPES.ONE_ON_ONE) {
		return LIVE_TABS.ATTACHMENTS;
	}

	if (council.state >= COUNCIL_STATES.ROOM_OPENED) {
		return LIVE_TABS.AGENDA;
	}

	return LIVE_TABS.PARTICIPANTS;
};


const CouncilLivePage = ({ translate, data, company }) => {
	const [state, setState] = useOldState({
		tab: getInitialTab(data.council),
		wall: false,
		unreadComments: 0,
		videoURL: '',
		wallTooltip: false,
		...initScreenSizes(localStorage.getItem('screenSize') || 'MIN')
	});
	const agendaManager = React.useRef(null);

	const updateMinSizes = React.useCallback(() => {
		minVideoWidth = calcMinWidth();
		minVideoHeight = calcMinHeight();
		if (!state.screenSize === 'MIN') {
			setState({
				videoWidth: minVideoWidth,
				videoHeight: minVideoHeight,
			});
		}
	}, [window.innerHeight, window.innerWidth]);

	React.useEffect(() => {
		window.addEventListener('resize', updateMinSizes);
	}, [updateMinSizes]);

	const setVideoURL = url => {
		setState({
			videoURL: url
		});
	};

	const toggleScreens = screen => {
		const cb = () => {
			setState({
				tab: screen,
				videoWidth: minVideoWidth,
				videoHeight: minVideoHeight,
				fullScreen: false
			});
		};

		if (agendaManager.current) {
			if (agendaManager.current.wrappedInstance) {
				if (agendaManager.current.wrappedInstance.state.editedVotings) {
					return agendaManager.current.wrappedInstance.showVotingsAlert(cb);
				}
				return cb();
			}
		}
		cb();
	};

	const updateState = object => {
		setState({
			...object
		});
	};

	const toggleWall = () => {
		setState({ wall: !state.wall });
	};

	const toggleFullScreen = () => {
		if (state.screenSize === 'MIN') {
			setState(initScreenSizes('MED'));
		}

		if (state.screenSize === 'MED') {
			setState(initScreenSizes('MAX'));
		}

		if (state.screenSize === 'MAX') {
			setState(initScreenSizes('MIN'));
		}
	};

	const { council } = data;

	const renderParticipantsManager = React.useCallback(() => {
		if (council.councilType === COUNCIL_TYPES.ONE_ON_ONE) {
			return (
				<AppointmentParticipantsManager
					translate={translate}
					council={council}
				/>
			);
		}

		return (
			<ParticipantsManager
				stylesDiv={isMobile ? {
					margin: '0', height: 'calc( 100% - 1.8em )', borderTop: '1px solid #e7e7e7', width: '100%'
				} : {}}
				translate={translate}
				council={council}
			/>

		);
	}, [council.councilType]);

	const renderVideoParticipants = () => (
		<ParticipantsLive
			councilId={council.id}
			council={council}
			videoURL={state.videoURL}
			translate={translate}
			videoHeight={state.videoHeight}
			screenSize={state.screenSize}
			toggleFullScreen={toggleFullScreen}
		/>
	);

	const councilStartedState = () => council.state >= 20 && council.state <= 30;

	const showParticipants = state.tab === LIVE_TABS.PARTICIPANTS;


	return (
		<div
			style={{
				height: '100%',
				width: '100vw',
				overflow: 'hidden',
				backgroundColor: 'white',
				fontSize: '1em',
				position: 'relative'
			}}
		>
			<LiveHeader
				logo={!!company && company.logo}
				companyName={!!company && company.businessName}
				councilName={council.name}
				council={council}
				translate={translate}
				participants={showParticipants}
				recount={data.councilRecount}
				refetch={data.refetch}
			/>

			<div
				style={{
					position: 'absolute',
					bottom: '5%',
					right: state.fullScreen ? '5%' : '2%',
					display: 'flex',
					flexDirection: 'column',
					zIndex: 2
				}}
			>
				{(councilStartedState())
					&& <Tooltip title={`${translate.wall} - (ALT + W)`} open={state.wallTooltip}>
						<div>
							{state.unreadComments > 0 ?
								<Badge
									classes={{
										badge: 'fadeToggle'
									}}
									badgeContent={
										<span
											style={{
												color: 'white',
												fontWeight: '700',
											}}
										>
											{state.unreadComments}
										</span>
									}
									color="secondary"
								>
									<div style={{ marginBottom: '0.3em' }}>
										<FabButton
											mode="intermitent"
											color={council.wallActive === 1 ? getPrimary() : 'grey'}
											icon={
												<Icon className="material-icons">
													chat
												</Icon>
											}
											onClick={toggleWall}
										/>
									</div>
								</Badge>
								: <div style={{ marginBottom: '0.3em' }}>
									<FabButton
										color={council.wallActive === 1 ? getPrimary() : 'grey'}
										icon={
											<Icon className="material-icons">
												chat
											</Icon>
										}
										onClick={toggleWall}
									/>
								</div>
							}
						</div>
					</Tooltip>
				}
			</div>

			<CommentWall
				translate={translate}
				open={state.wall}
				council={council}
				refetch={data.refetch}
				unreadComments={state.unreadComments}
				updateState={updateState}
				requestClose={toggleWall}
			/>

			<div
				style={{
					display: 'flex',
					width: '100%',
					height: 'calc(100% - 3em)',
					flexDirection: 'row',
					overflow: 'hidden'
				}}
			>
				{showVideo(council) && (
					<div
						style={{
							display: 'flex',
							flexDirection: state.fullScreen ?
								'row'
								: 'column',
							width: `${state.videoWidth}%`,
							height: '100%',
							overflow: 'hidden',
							position: 'relative',
							backgroundColor: darkGrey,
						}}
					>
						{state.fullScreen && (
							<div
								style={{
									height: '100%',
									width: '5%',
									overflow: 'hidden',
									backgroundColor: darkGrey
								}}
							>
								{renderVideoParticipants()}
							</div>
						)}

						{
							<React.Fragment>
								<div
									style={{
										height: state.videoHeight,
										width: '100%',
										overflow: 'hidden',
										backgroundColor: darkGrey,
										position: 'relative',
										transition: 'width 0.8s, height 0.6s',
										transitionTimingFunction: 'ease'
									}}
								>
									{(config.videoEnabled && config.videoVersion === videoVersions.CMP)
										&& <CMPVideoIFrame
											council={council}
											translate={translate}
											videoURL={state.videoURL}
											setVideoURL={setVideoURL}
										/>
									}
								</div>
							</React.Fragment>
						}
						{!state.fullScreen && (
							<div
								style={{
									height: `calc(100% - ${state.videoHeight})`,
									width: '100%',
									overflow: 'hidden',
									backgroundColor: darkGrey
								}}
							>
								{renderVideoParticipants()}
							</div>
						)}
					</div>
				)}
				<div
					style={{
						width: `${showVideo(council) ?
							100 - state.videoWidth - '0.5'
							: 100
						}%`,
						height: '100%',
						marginLeft: '5px',
						position: 'relative'
					}}
				>
					{isMobile ?
						showParticipants && !state.fullScreen ? (
							renderParticipantsManager()
						) : (
							<AgendaManager
								ref={agendaManager}
								recount={data.councilRecount}
								council={council}
								company={company}
								translate={translate}
								fullScreen={state.fullScreen}
								refetch={data.refetch}
								openMenu={() => setState({
									videoWidth: minVideoWidth,
									videoHeight: minVideoHeight,
									fullScreen: false
								})
								}
							/>
						)
						: <React.Fragment>
							{!state.fullScreen
								&& <Tabs value={state.tab}>
									<Tab value={LIVE_TABS.PARTICIPANTS} label={translate.participants} onClick={() => toggleScreens(LIVE_TABS.PARTICIPANTS)} />
									<Tab value={LIVE_TABS.AGENDA} label={translate.agenda} onClick={() => toggleScreens(LIVE_TABS.AGENDA)} id={'ordenDelDiaParticipantesButton'} />
									{council.councilType === COUNCIL_TYPES.ONE_ON_ONE
										&& <Tab value={LIVE_TABS.ATTACHMENTS} label={translate.attachments} onClick={() => toggleScreens(LIVE_TABS.ATTACHMENTS)} id={'councilAttachmentsButton'} />
									}
									<div style={{
										width: '100%',
										display: 'flex',
										justifyContent: 'flex-end',
										alignItems: 'center',
										paddingRight: '1em'
									}}>
										{data.councilRecount
											&& <>
												<QuorumDisplay
													company={company}
													recount={data.councilRecount}
													council={council}
													translate={translate}
												/>
											</>
										}
									</div>
								</Tabs>
							}
							<div style={{ height: '100%' }}>
								{(showParticipants && !state.fullScreen)
									&& <div style={{ height: 'calc( 100% - 2em )' }}>
										{renderParticipantsManager()}
									</div>
								}
								{(state.tab === LIVE_TABS.ATTACHMENTS && !state.fullScreen)
									&& <div style={{ height: 'calc( 100% - 2em )' }}>
										<OneOnOneAttachmentsList
											council={council}
											company={company}
											refetch={data.refetch}
											translate={translate}
										/>
									</div>
								}
								{(state.tab === LIVE_TABS.AGENDA || state.fullScreen)
									&& <div style={{ height: 'calc( 100% - 2em )', position: 'relative' }}>
										{council.state === COUNCIL_STATES.PAUSED
											&& <DisabledSection>
												<div style={{ marginBottom: '1em' }}>
													{translate.council_paused}
												</div>
												<ResumeCouncilButton
													council={council}
													translate={translate}
													refetch={data.refetch}
												/>
											</DisabledSection>
										}
										<div style={{ borderTop: '1px solid #e7e7e7', height: 'calc( 100% - 1.8em )', width: '100%' }}>
											<AgendaManager
												ref={agendaManager}
												recount={data.councilRecount}
												council={council}
												company={company}
												translate={translate}
												fullScreen={state.fullScreen}
												refetch={data.refetch}
												openMenu={() => setState(initScreenSizes('MIN'))}
											/>
										</div>
									</div>
								}
							</div>
						</React.Fragment>
					}
				</div>
			</div>
		</div>
	);
};

export default CouncilLivePage;

