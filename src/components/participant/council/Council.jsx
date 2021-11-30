import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import gql from 'graphql-tag';
import { Grid } from 'material-ui';
import withTranslations from '../../../HOCs/withTranslations';
import withDetectRTC from '../../../HOCs/withDetectRTC';
import { PARTICIPANT_STATES } from '../../../constants';
import Agendas from '../agendas/Agendas';
import Header from '../Header';
import { darkGrey, getPrimary } from '../../../styles/colors';
import RequestWordMenu from '../menus/RequestWordMenu';
import { councilHasVideo } from '../../../utils/CBX';
import { isLandscape, isMobile } from '../../../utils/screen';
import VideoContainer from '../VideoContainer';
import { API_URL, SERVER_URL } from '../../../config';
import AdminAnnouncement from '../../council/live/adminAnnouncement/AdminAnnouncement';
import CouncilSidebar from './CouncilSidebar';
import AdminPrivateMessage from '../menus/AdminPrivateMessage';
import * as CBX from '../../../utils/CBX';
import UsersHeader from '../UsersHeader';
import { ConfigContext } from '../../../containers/AppControl';
import { usePolling } from '../../../hooks';
import { AlertConfirm, LoadingMainApp, LoadingSection } from '../../../displayComponents';
import { ConnectionInfoContext } from '../../../containers/ParticipantContainer';


const styles = {
	viewContainer: {
		width: '100vw',
		height: '100vh',
		position: 'relative'
	},
	viewContainerM: {
		width: '100vw',
		height: '100%',
		position: 'fixed'
	},
	mainContainerM: {
		width: '100%',
		height: 'calc(100% - 9.21rem)',
		display: 'flex',
		backgroundColor: darkGrey,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		backgroundImage: 'red',
		padding: '10px'
	},
	mainContainer: {
		width: '100%',
		height: 'calc(100% - 3em)',
		display: 'flex',
		backgroundColor: darkGrey,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		backgroundImage: 'red',
		padding: '10px'
	}
};

const stylesVideo = {
	portrait: [{
		fullPadre: {
			width: '100%',
			height: '100%',
			position: 'relative',
		},
		fullHijo: {
			width: '100%',
			height: '100%'
		},
		middlePadre: {
			width: '100%',
			height: '100%',
			position: 'relative',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center'
		},
		middleHijo: {
			width: '100%',
			height: '50% '
		},
	}],
	landscape: [{
		fullPadre: {
			width: '100%',
			height: '100%',
			position: 'relative',
		},
		fullHijo: {
			width: '100%',
			height: '100%'
		},
		middlePadre: {
			width: '50%',
			height: '100%',
			position: 'relative',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			left: '25%'
		},
		middleHijo: {
			width: '100%',
			height: '100% '
		},
	}],
};

const ParticipantCouncil = ({
	translate, participant, council, client, ...props
}) => {
	const [state, setState] = React.useState({
		agendasAnchor: 'right',
		hasVideo: councilHasVideo(council),
		videoURL: '',
		full: true,
		middle: false,
		activeInput: false,
		adminMessage: false,
		modalContent: isMobile ? null : 'agenda',
		avisoVideo: false,
		text: ''
	});
	const [agendaBadge, setAgendaBadge] = React.useState(false);
	const grantedWord = React.useRef(participant.grantedWord);
	const config = React.useContext(ConfigContext);
	const [agendas, setData] = React.useState(null);
	const [drawerTop, setDrawerTop] = React.useState(false);
	const [modalDontHaveVoting, setModalDontHaveVoting] = React.useState(true);
	const [brandingTimeout, setBrandingTimeout] = React.useState(true);

	React.useEffect(() => {
		if (config.notificationsBranding) {
			setTimeout(() => {
				setBrandingTimeout(false);
			}, process.env.REACT_APP_MODE === 'dev' ? 1500 : 6000);
		}
	}, [config.notificationsBranding]);

	const leaveRoom = React.useCallback(() => {
		if (navigator.sendBeacon) {
			navigator.sendBeacon(`${SERVER_URL}/participantDisconnected/${sessionStorage.getItem('participantToken')}`);
		} else {
			const request = new XMLHttpRequest();
			request.open('POST', API_URL, false);
			request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
			request.setRequestHeader('Accept', 'application/json');
			request.setRequestHeader('authorization', sessionStorage.getItem('participantToken'));
			request.setRequestHeader('x-jwt-token', sessionStorage.getItem('participantToken'));
			request.send(JSON.stringify({
				query: changeParticipantOnlineState,
				variables: {
					participantId: participant.id,
					online: 2
				}
			}));
		}
	}, [participant.id]);

	const getData = async () => {
		const response = await client.query({
			query: agendasQuery,
			variables: {
				councilId: council.id,
				participantId: participant.id
			}
		});

		setData({
			...response.data,
			refetch: getData
		});
	};

	usePolling(getData, 7000);

	const connectionInfo = React.useContext(ConnectionInfoContext);

	React.useEffect(() => {
		props.changeParticipantOnlineState({
			variables: {
				participantId: participant.id,
				online: 1,
				data: JSON.stringify(connectionInfo.data)
			}
		});
		if (navigator.userAgent.indexOf('Firefox') !== -1) {
			window.onbeforeunload = leaveRoom;
		} else {
			window.onunload = leaveRoom;
		}
	}, [participant.id, leaveRoom, props.changeParticipantOnlineState]);


	React.useEffect(() => {
		if (!CBX.haveGrantedWord({ requestWord: grantedWord.current }) && CBX.haveGrantedWord(participant)) {
			setState({
				...state,
				avisoVideo: true
			});
		}
		if (!CBX.haveGrantedWord(participant)) {
			setState({
				...state,
				avisoVideo: false
			});
		}

		grantedWord.current = participant.requestWord;
	}, [participant.requestWord]);

	const setContent = type => {
		if (type === 'agenda') {
			setAgendaBadge(false);
		}
		setState({
			...state,
			modalContent: type
		});
	};

	const setAdminMessage = (value, event) => {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		setState({
			...state,
			adminMessage: value
		});
		setDrawerTop(false);
	};

	const drawerTopToggle = event => {
		event.preventDefault();
		event.stopPropagation();
		setState({
			...state,
			adminMessage: false
		});
		setDrawerTop(!drawerTop);
	};

	const renderAgendaSection = () => {
		const noSession = state.hasVideo && participant.state !== PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE;
		return (
			<Grid item xs={isLandscape() && state.hasVideo ? 6 : 12} md={state.hasVideo ? 4 : 6} style={{}}>
				<Agendas
					noSession={noSession}
					participant={participant}
					council={council}
					setAgendaBadge={setAgendaBadge}
					agendaBadge={agendaBadge}
					anchorToggle={state.hasVideo}
					data={agendas}
					agendasAnchor={state.agendasAnchor}
					inPc={true}
					timeline={state.modalContent !== 'agenda'}
				/>
			</Grid>
		);
	};

	const renderVideoContainer = () => {
		if (participant.requestWord === 3) {
			// TRADUCCION
			return (
				<div style={{
					backgroundColor: 'white',
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '1em'
				}}>
					<span className="material-icons" style={{ color: getPrimary(), fontSize: '50px' }}>
						tv_off
					</span>
					<div style={{ textAlign: 'center' }}>En la <strong style={{ color: getPrimary(), marginRight: '0.5em' }}>sala de espera.</strong>
						Podrá acceder a la emisión cuando el administrador de sala le conceda la entrada.
					</div>
				</div>
			);
		}

		return (
			<VideoContainer
				council={council}
				translate={translate}
				participant={participant}
				videoURL={state.videoURL}
				setVideoURL={url => setState({ ...state, videoURL: url })}
				pedirPalabra={
					<RequestWordMenu
						translate={translate}
						participant={participant}
						council={council}
						videoURL={state.videoURL}
						refetchParticipant={props.refetchParticipant}
						isSidebar={true}
						avisoVideoState={state.avisoVideo}
						avisoVideoStateCerrar={() => setState({ ...state, avisoVideo: false })}
					/>
				}
			/>
		);
	};

	const renderRequestWordMenu = () => (
		<RequestWordMenu
			translate={translate}
			participant={participant}
			council={council}
			videoURL={state.videoURL}
			refetchParticipant={props.refetchParticipant}
			isSidebar={true}
			isPc={!isMobile}
			avisoVideoState={state.avisoVideo}
			avisoVideoStateCerrar={() => setState({ ...state, avisoVideo: false })}
		/>
	);

	const renderAdminMessageMenu = () => (
		<AdminPrivateMessage
			translate={translate}
			council={council}
			participant={participant}
			setAdminMessage={setAdminMessage}
			menuRender={true}
			activeInput={() => setState({ ...state, activeInput: true })}
			onFocus={() => setState({ ...state, activeInput: true })}
			onblur={() => setState({ ...state, activeInput: false })}
		/>
	);

	const renderAgendaSectionMobile = () => {
		const noSession = state.hasVideo && participant.state !== PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE;
		return (
			<Agendas
				noSession={noSession}
				participant={participant}
				council={council}
				data={agendas}
				setAgendaBadge={setAgendaBadge}
				agendaBadge={agendaBadge}
				anchorToggle={state.hasVideo}
				agendasAnchor={state.agendasAnchor}
				sinCabecera={true}
			/>
		);
	};

	const renderAdminAnnouncement = () => (
		<AdminAnnouncement
			openHelp={true}
			council={council}
			translate={translate}
			closeButton={false}
		/>
	);

	const renderModalDontHaveVoting = () => (
		<AlertConfirm
			title={translate.attention}
			bodyText={
				<div>
					<div>{translate.participant_salute.replace(/{{participantName}}/g, `${participant.name} ${participant.surname || ''}`)}</div>
					<div>{participant.type === 1 ? translate.you_have_no_voting_right_guest : translate.you_have_no_voting_right}</div>
					<div>{translate.thank_you}</div>
				</div>
			}
			open={modalDontHaveVoting}
			buttonAccept={translate.accept}
			acceptAction={() => setModalDontHaveVoting(false)}
			requestClose={() => setModalDontHaveVoting(false)}
		/>
	);

	const calculateParticipantVotes = () => CBX.showNumParticipations(participant.delegatedVotes.reduce((a, b) => a + b.numParticipations, participant.numParticipations), council.company, council.statute);

	const { agendasAnchor } = state;
	const noSession = state.hasVideo && participant.state !== PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE;
	let titleHeader = null;


	if (brandingTimeout && config.notificationsBranding) {
		return (
			<LoadingMainApp displayAdvice={true} company={council.company} />
		);
	}

	if (agendas) {
		titleHeader = agendas.agendas.filter(item => CBX.agendaPointOpened(item));
	} else {
		return <LoadingSection />;
	}

	const landscape = isLandscape() && window.innerWidth < 700;

	if (isMobile) {
		if (landscape) {
			return (
				<div style={{
					height: '100vh', overflow: 'hidden', position: ' fixed', width: '100vw'
				}}>
					{(participant.type === 1 || calculateParticipantVotes() === 0) &&
						renderModalDontHaveVoting()
					}
					{state.hasVideo && participant.state !== PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE &&
						<Grid item xs={12} md={12} style={{ height: '100%' }}>
							<div style={{ height: '100%' }}>
								<div style={{ height: '100%', position: 'relative' }}>
									{renderAdminAnnouncement()}
									<div style={{ height: '100%' }}>
										{renderVideoContainer()}
									</div>
								</div>
							</div>
						</Grid>
					}
				</div>
			);
		}

		return (
			<div style={styles.viewContainerM}>
				{(participant.type === 1 || calculateParticipantVotes() === 0) &&
					renderModalDontHaveVoting()
				}
				{!landscape &&
					<React.Fragment>
						<CouncilSidebar
							agendas={agendas}
							noSession={noSession}
							isMobile={isMobile}
							council={council}
							translate={translate}
							setAgendaBadge={setAgendaBadge}
							agendaBadge={agendaBadge}
							setContent={setContent}
							adminMessage={state.adminMessage}
							setAdminMessage={setAdminMessage}
							modalContent={state.modalContent}
							agenda={renderAgendaSectionMobile()}
							full={() => setState({ ...state, full: true, middle: false })}
							middle={() => setState({ ...state, full: false, middle: true })}
							click={state.activeInput}
							participant={participant}
							comentario={renderAdminMessageMenu()}
							askWordMenu={renderRequestWordMenu()}
						/>
						<Header
							logoutButton={true}
							participant={participant}
							council={council}
							primaryColor={'white'}
							titleHeader={titleHeader}
						/>
						{config.participantsHeader &&
							<UsersHeader
								isMobile={isMobile}
								council={council}
								translate={translate}
								drawerTop={drawerTop}
								setDrawerTop={drawerTopToggle}
							/>
						}
					</React.Fragment>
				}

				<div style={!landscape ? {
					...styles.mainContainerM,
					height: config.participantsHeader ? styles.mainContainerM.height : 'calc(100% - 6.21rem)'
				} : { height: '100%', width: '100%' }}>
					<Grid container spacing={!landscape ? 8 : '0'} style={{
						height: '100%',
						...(!state.hasVideo || participant.state === PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE ? {
							display: 'flex',
							justifyContent: 'center'
						} : {}),
						...(landscape ? {
							height: '100vh', overflow: 'hidden', position: ' fixed', width: '100vw'
						} : {})
					}}>
						{state.hasVideo && participant.state !== PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE &&
							<Grid item xs={12} md={12} style={{ height: '100%' }}>
								<div style={
									state.full ? stylesVideo.portrait[0].fullPadre :
										landscape ? 'height: 100%' :
											isLandscape() ? stylesVideo.landscape[0].middlePadre :
												stylesVideo.portrait[0].middlePadre}>
									<div style={{ height: '100%' }}>
										{renderAdminAnnouncement()}
										<div style={state.full ? stylesVideo.portrait[0].fullHijo : isLandscape() ? stylesVideo.landscape[0].middleHijo : stylesVideo.portrait[0].middleHijo}>
											{renderVideoContainer()}
										</div>
									</div>
								</div>
							</Grid>
						}
					</Grid>
				</div>
			</div>
		);
	}

	return (
		<div style={styles.viewContainer}>
			<Header
				translate={translate}
				logoutButton={true}
				participant={participant}
				council={council}
				primaryColor={'white'}
				titleHeader={titleHeader}
			/>
			{(participant.type === 1 || calculateParticipantVotes() === 0) &&
				renderModalDontHaveVoting()
			}
			< div style={styles.mainContainer}>
				<Grid container spacing={8} style={{
					height: '100%',
					...(!state.hasVideo || participant.state === PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE ? {
						display: 'flex',
						justifyContent: 'center'
					} : {})
				}}>
					{state.hasVideo && participant.state !== PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE &&
						<Grid item xs={6} md={8} style={{ height: 'calc( 100% - 3.5em + 1px)' }}>
							<div style={{ marginBottom: '5px' }}>
								{config.participantsHeader &&
									<UsersHeader
										isMobile={isMobile}
										council={council}
										translate={translate}
										drawerTop={drawerTop}
										setDrawerTop={drawerTopToggle}
									/>
								}
							</div>
							<div style={{
								transition: 'all .3s ease-in-out', width: '100%', height: state.avisoVideo ? 'calc( 100% - 55px )' : '100%', position: 'relative', top: state.avisoVideo ? '55px' : '0px'
							}}>
								{renderAdminAnnouncement()}
								<div style={{ height: `calc( 100% - ${config.participantsHeader ? state.adminMessage ? '6.3em' : '3em' : '0px'} - 5px )`, width: '100%' }}>
									{renderVideoContainer()}
								</div>
							</div>
						</Grid>
					}
					{agendasAnchor === 'right' &&
						renderAgendaSection()
					}
					{state.hasVideo && participant.state !== PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE &&
						<div style={{ width: '100%', height: 'calc( 3.5rem + 1px )' }}>
							<CouncilSidebar
								isMobile={isMobile}
								council={council}
								agendas={agendas}
								translate={translate}
								setAgendaBadge={setAgendaBadge}
								agendaBadge={agendaBadge}
								full={() => setState({ ...state, full: true, middle: false })}
								middle={() => setState({ ...state, full: false, middle: true })}
								click={state.activeInput}
								agenda={renderAgendaSection()}
								setContent={setContent}
								adminMessage={state.adminMessage}
								setAdminMessage={setAdminMessage}
								modalContent={state.modalContent}
								participant={participant}
								comentario={renderAdminMessageMenu()}
								askWordMenu={renderRequestWordMenu()}
							/>
						</div>
					}
				</Grid>
			</div>
		</div >
	);
};


const changeParticipantOnlineState = gql`
    mutation changeParticipantOnlineState($participantId: Int!, $online: Int!, $data: String){
        changeParticipantOnlineState(participantId: $participantId, online: $online, data: $data){
            success
            message
        }
    }
`;

const participantPing = gql`
    query participantPing($data: String) {
        participantPing(data: $data)
    }
`;

const agendasQuery = gql`
    query Agendas($councilId: Int!, $participantId: Int!){
        agendas(councilId: $councilId){
            positiveVotings
            negativeVotings
            abstentionVotings
            positiveManual
            negativeManual
            abstentionManual
            noVoteManual
            noVoteVotings
            agendaSubject
            votingsRecount
            attachments {
                id
                agendaId
                filename
                filesize
                filetype
                councilId
                state
            }
            options {
                maxSelections
                minSelections
                id
            }
            items {
                id
                value
            }
            councilId
            dateEndVotation
            dateStart
            dateStartVotation
            description
            id
            orderIndex
            pointState
            subjectType
            votingState
        }

        participantVotings(participantId: $participantId){
            id
            comment
            date
            participantId
            delegateId
            ballots {
                participantId
                value
                weight
                itemId
                id
            }
            agendaId
            fixed
            numParticipations
            author {
                id
                state
                voteDenied
                voteDeniedReason
                name
                type
                surname
                representative {
                    id
                    name
                    surname
                }
            }
            vote
        }
    }
`;

export default compose(
	graphql(participantPing, {
		options: props => ({
			pollInterval: 10000,
			variables: {
				data: JSON.stringify(props.reqData)
			}
		})
	}),
	graphql(changeParticipantOnlineState, {
		name: 'changeParticipantOnlineState'
	})
)(withApollo(withTranslations()(withDetectRTC()(ParticipantCouncil))));
