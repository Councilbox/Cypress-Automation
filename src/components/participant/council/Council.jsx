import React from "react";
import { graphql, withApollo, compose } from "react-apollo";
import gql from "graphql-tag";
import { Grid, Button, Badge, SwipeableDrawer } from "material-ui";
import withTranslations from "../../../HOCs/withTranslations";
import withDetectRTC from "../../../HOCs/withDetectRTC";
import { PARTICIPANT_STATES } from '../../../constants';
import Agendas from '../agendas/Agendas';
import Header from "../Header";
import { LiveToast } from '../../../displayComponents';
import { darkGrey, secondary } from '../../../styles/colors';
import RequestWordMenu from '../menus/RequestWordMenu';
import { councilHasVideo } from '../../../utils/CBX';
import { isLandscape } from '../../../utils/screen';
import VideoContainer from '../VideoContainer';
import { toast } from 'react-toastify';
import { API_URL } from "../../../config";
import AdminAnnouncement from './AdminAnnouncement';
import { ConfigContext } from '../../../containers/AppControl';
import { isMobile } from "react-device-detect";
import CouncilSidebar from './CouncilSidebar';
import AdminPrivateMessage from "../menus/AdminPrivateMessage";
import * as CBX from '../../../utils/CBX';


const styles = {
    viewContainer: {
        width: "100vw",
        height: "100vh",
        position: "relative"
    },
    viewContainerM: {
        width: "100vw",
        height: "100%",
        // height: "calc( 100vh - 50px )",
        position: "relative"
    },
    mainContainerM: {
        width: "100%",
        height: "calc(100% - 6.33rem)",
        display: "flex",
        backgroundColor: darkGrey,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        backgroundImage: 'red',
        padding: "10px"
    },
    mainContainer: {
        width: "100%",
        height: "calc(100% - 3em)",
        display: "flex",
        backgroundColor: darkGrey,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        backgroundImage: 'red',
        padding: "10px"
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
            left: "25%"
        },
        middleHijo: {
            width: '100%',
            height: '100% '
        },
    }],
}

const ParticipantCouncil = ({ translate, participant, data, council, agendas, ...props }) => {
    const [state, setState] = React.useState({
        agendasAnchor: 'right',
        hasVideo: councilHasVideo(council),
        videoURL: '',
        full: true,
        middle: false,
        activeInput: false,
        adminMessage: false,
        modalContent: isMobile ? null : "agenda",
        avisoVideo: false
    });
    const [agendaBadge, setAgendaBadge] = React.useState(false);
    const grantedWord = React.useRef(participant.grantedWord);

    const leaveRoom = React.useCallback(() => {
        let request = new XMLHttpRequest();
        request.open('POST', API_URL, false);  // `false` makes the request synchronous
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request.setRequestHeader("Accept", "application/json");
        request.setRequestHeader('authorization', sessionStorage.getItem("participantToken"));
        request.setRequestHeader('x-jwt-token', sessionStorage.getItem("participantToken"));
        request.send(JSON.stringify({
            query: changeParticipantOnlineState,
            variables: {
                participantId: participant.id,
                online: 2
            }
        }));
    });

    React.useEffect(() => {
        props.changeParticipantOnlineState({
            variables: {
                participantId: participant.id,
                online: 1
            }
        });
        if (navigator.userAgent.indexOf("Firefox") !== -1) {
            window.onbeforeunload = leaveRoom;
        }
        else {
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
        if (type === "agenda") {
            setAgendaBadge(false)
        }
        setState({
            ...state,
            modalContent: type
        });
    }

    const setAdminMessage = value => {
        setState({
            ...state,
            adminMessage: value
        })
    }

    const _renderAgendaSection = () => {
        let noSession = state.hasVideo && participant.state !== PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE;
        return (
            <Grid item xs={isLandscape() && state.hasVideo ? 6 : 12} md={state.hasVideo ? 4 : 6} style={{}}> {/*minHeight: '45%', */}
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
                    timeline={state.modalContent !== "agenda"}
                />
            </Grid>
        )
    }

    const _renderAgendaSectionMobile = () => {
        let noSession = state.hasVideo && participant.state !== PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE;
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
        )
    }

    const { agendasAnchor } = state;
    let type = "agenda";
    let noSession = state.hasVideo && participant.state !== PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE;
    let titleHeader = null
    if (!agendas.loading) {
        titleHeader = agendas.agendas.filter(item => { return CBX.agendaPointOpened(item) })
    }

    if (isMobile) {
        return (
            <div style={styles.viewContainerM}>
                <CouncilSidebar
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
                    agenda={_renderAgendaSectionMobile()}
                    full={() => setState({ ...state, full: true, middle: false })}
                    middle={() => setState({ ...state, full: false, middle: true })}
                    click={state.activeInput}
                    participant={participant}
                    comentario={
                        <AdminPrivateMessage
                            translate={translate}
                            council={council}
                            participant={participant}
                            menuRender={true}
                            activeInput={() => setState({ ...state, activeInput: true })}//onFocus puede ser
                            onblur={() => setState({ ...state, activeInput: false })}
                        />
                    }
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
                <Header
                    translate={translate}
                    logoutButton={true}
                    participant={participant}
                    council={council}
                    primaryColor={'white'}
                    titleHeader={titleHeader}
                />
                <div style={styles.mainContainerM}>
                    <Grid container spacing={8} style={{
                        height: '100%',
                        ...(!state.hasVideo || participant.state === PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE ? {
                            display: 'flex',
                            justifyContent: 'center'
                        } : {})
                    }}>
                        {state.hasVideo && participant.state !== PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE &&
                            <Grid item xs={isLandscape() ? 12 : 12} md={8} style={{ height: "100%" }}>
                                <div style={state.full ? stylesVideo.portrait[0].fullPadre : isLandscape() ? stylesVideo.landscape[0].middlePadre : stylesVideo.portrait[0].middlePadre}>
                                    <div style={{ transition: "all .3s ease-in-out", width: '100%', height: state.avisoVideo ? "calc( 100% - 55px )" : '100%', position: 'relative', top: state.avisoVideo ? "55px" : "0px" }}>
                                        <ConfigContext.Consumer>
                                            {config => (
                                                <AdminAnnouncement
                                                    council={council}
                                                    translate={translate}
                                                    context={config}
                                                />
                                            )}
                                        </ConfigContext.Consumer>
                                        <div style={state.full ? stylesVideo.portrait[0].fullHijo : isLandscape() ? stylesVideo.landscape[0].middleHijo : stylesVideo.portrait[0].middleHijo}>
                                            <VideoContainer
                                                council={council}
                                                participant={participant}
                                                videoURL={state.videoURL}
                                                setVideoURL={url => setState({ ...state, videoURL: url })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                        }
                    </Grid>
                </div>
            </div>
        )
    } else {
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
                <div style={styles.mainContainer}>
                    <Grid container spacing={8} style={{
                        height: '100%',
                        ...(!state.hasVideo || participant.state === PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE ? {
                            display: 'flex',
                            justifyContent: 'center'
                        } : {})
                    }}>
                        {state.hasVideo && participant.state !== PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE &&
                            <Grid item xs={6} md={8} style={{ height: "calc( 100% - 3.5em + 1px )" }}>
                                <div style={{ transition: "all .3s ease-in-out", width: '100%', height: state.avisoVideo ? "calc( 100% - 55px )" : '100%', position: 'relative', top: state.avisoVideo ? "55px" : "0px" }}>
                                    <ConfigContext.Consumer>
                                        {config => (
                                            <AdminAnnouncement
                                                council={council}
                                                translate={translate}
                                                context={config}
                                            />
                                        )}
                                    </ConfigContext.Consumer>
                                    <div style={{ height: '100%', width: '100%', }}>
                                        <VideoContainer
                                            council={council}
                                            participant={participant}
                                            videoURL={state.videoURL}
                                            setVideoURL={url => setState({ ...state, videoURL: url })}
                                        />
                                    </div>
                                </div>
                            </Grid>
                        }
                        {agendasAnchor === 'right' &&
                            _renderAgendaSection()
                        }
                        {state.hasVideo && participant.state !== PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE &&
                            <div style={{ width: '100%', height: "calc( 3.5rem + 1px )" }}>
                                <CouncilSidebar
                                    isMobile={isMobile}
                                    council={council}
                                    translate={translate}
                                    setAgendaBadge={setAgendaBadge}
                                    agendaBadge={agendaBadge}
                                    full={() => setState({ ...state, full: true, middle: false })}
                                    middle={() => setState({ ...state, full: false, middle: true })}
                                    click={state.activeInput}
                                    agenda={_renderAgendaSection()}
                                    setContent={setContent}
                                    adminMessage={state.adminMessage}
                                    setAdminMessage={setAdminMessage}
                                    modalContent={state.modalContent}
                                    participant={participant}
                                    comentario={
                                        <AdminPrivateMessage
                                            translate={translate}
                                            council={council}
                                            participant={participant}
                                            setAdminMessage={setAdminMessage}
                                            menuRender={true}
                                            activeInput={() => setState({ ...state, activeInput: true })}
                                            onblur={() => setState({ ...state, activeInput: false })}
                                        />
                                    }
                                    pedirPalabra={
                                        <RequestWordMenu
                                            translate={translate}
                                            participant={participant}
                                            council={council}
                                            videoURL={state.videoURL}
                                            refetchParticipant={props.refetchParticipant}
                                            isSidebar={true}
                                            isPc={true}
                                            avisoVideoState={state.avisoVideo}
                                            avisoVideoStateCerrar={() => setState({ ...state, avisoVideo: false })}
                                        />
                                    }
                                />
                            </div>
                        }
                    </Grid>
                </div>
            </div>
        );
    }
}


const changeParticipantOnlineState = gql`
    mutation changeParticipantOnlineState($participantId: Int!, $online: Int!){
        changeParticipantOnlineState(participantId: $participantId, online: $online){
            success
            message
        }
    }
`;

const participantPing = gql`
    query participantPing {
        participantPing
    }
`;
const agendas = gql`
    query Agendas($councilId: Int!, $participantId: Int!){
        agendas(councilId: $councilId){
            agendaSubject
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
            numParticipations
            author {
                id
                state
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
            pollInterval: 5000
        })
    }),
    graphql(changeParticipantOnlineState, {
        name: 'changeParticipantOnlineState'
    }),
    graphql(agendas, {
        options: props => ({
            variables: {
                councilId: props.council.id,
                participantId: props.participant.id
            },
            pollInterval: 7000
        }),
        name: 'agendas'
    })
)(withApollo(withTranslations()(withDetectRTC()(ParticipantCouncil))));
