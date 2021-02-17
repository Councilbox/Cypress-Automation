import React from 'react';
import {
	Tooltip, Badge, Tabs, Tab
} from 'material-ui';
import { DisabledSection, FabButton, Icon } from '../../../displayComponents';
import LiveHeader from './LiveHeader';
import { darkGrey, lightGrey } from '../../../styles/colors';
import AgendaManager from './AgendaManager';
import ParticipantsLive from './ParticipantsLive';
import ParticipantsManager from './participants/ParticipantsManager';
import CommentWall from './CommentWall';
import { showVideo } from '../../../utils/CBX';
import { config, videoVersions } from '../../../config';
import CMPVideoIFrame from './video/CMPVideoIFrame';
import { useOldState } from '../../../hooks';
import { isMobile } from '../../../utils/screen';
import QuorumDisplay from './quorum/QuorumDisplay';
import { COUNCIL_STATES, COUNCIL_TYPES } from '../../../constants';
import ResumeCouncilButton from './menus/ResumeCouncilButton';
import OneOnOneAttachmentsList from './oneOnOne/OneOnOneAttachmentsList';

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


const CouncilLivePage = ({ translate, data, company }) => {
	const [state, setState] = useOldState({
		tab: data.council.councilType === COUNCIL_TYPES.ONE_ON_ONE ? 'ATTACHMENTS' : 'AGENDA',
		wall: false,
		unreadComments: 0,
		videoURL: '',
		wallTooltip: false,
		...initScreenSizes(localStorage.getItem('screenSize') || 'MIN')
	});
	const agendaManager = React.useRef(null);
	// const company = props.companies.list[props.companies.selected];

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

	const showParticipants = state.tab === 'PARTICIPANTS';


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
				{(councilStartedState() && council.wallActive === 1)
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
									{(council.room && council.room.htmlVideoCouncil && config.videoEnabled && config.videoVersion !== videoVersions.CMP)
										&& <div
											style={{ height: '100%', width: '100%' }}
											dangerouslySetInnerHTML={{ __html: council.room.htmlVideoCouncil }}
										/>
									}
									<div
										style={{
											borderRadius: '5px',
											cursor: 'pointer',
											position: 'absolute',
											right: '5%',
											top: '16px',
											backgroundColor:
												'rgba(0, 0, 0, 0.5)',
											width: '2.9em',
											height: '2.9em',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center'
										}}
										onClick={toggleFullScreen}
									>
										<Icon
											className="material-icons"
											style={{ color: lightGrey }}
										>
											{state.fullScreen ?
												'zoom_out'
												: 'zoom_in'}
										</Icon>
									</div>
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
							<ParticipantsManager
								translate={translate}
								participants={data.council.participants}
								council={council}
							/>
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
									<Tab value={'PARTICIPANTS'} label={translate.participants} onClick={() => toggleScreens('PARTICIPANTS')} />
									<Tab value={'AGENDA'} label={translate.agenda} onClick={() => toggleScreens('AGENDA')} id={'ordenDelDiaParticipantesButton'} />
									{council.councilType === COUNCIL_TYPES.ONE_ON_ONE
										&& <Tab value={'ATTACHMENTS'} label={translate.attachments} onClick={() => toggleScreens('ATTACHMENTS')} id={'councilAttachmentsButton'} />
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
										<ParticipantsManager
											stylesDiv={{
												margin: '0', height: 'calc( 100% - 1.8em )', borderTop: '1px solid #e7e7e7', width: '100%'
											}}
											translate={translate}
											participants={data.council.participants}
											council={council}
										/>
									</div>
								}
								{(state.tab === 'ATTACHMENTS' && !state.fullScreen)
									&& <div style={{ height: 'calc( 100% - 2em )' }}>
										<OneOnOneAttachmentsList
											council={council}
											company={company}
											translate={translate}
										/>
									</div>
								}
								{(state.tab === 'AGENDA' || state.fullScreen)
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
												openMenu={() => setState({
													videoWidth: minVideoWidth,
													videoHeight: minVideoHeight,
													fullScreen: false
												})
												}
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

