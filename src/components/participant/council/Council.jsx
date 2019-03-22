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
import { councilStarted } from '../../../utils/CBX';
import { API_URL } from "../../../config";
import AdminAnnouncement from './AdminAnnouncement';
import { ConfigContext } from '../../../containers/AppControl';
import { isMobile } from "react-device-detect";
import CouncilSidebar from './CouncilSidebar';
import AdminPrivateMessage from "../menus/AdminPrivateMessage";
import TimelineSection from "../timeline/TimelineSection";
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


class ParticipantCouncil extends React.Component {
    state = {
        agendasAnchor: 'right',
        hasVideo: councilHasVideo(this.props.council),
        videoURL: '',
        full: true,
        middle: false,
        activeInput: false,
        modalContent: "agenda",
        avisoVideo: false
    };

    noStartedToastId = null;

    componentDidMount = () => {
        this.props.changeParticipantOnlineState({
            variables: {
                participantId: this.props.participant.id,
                online: 1
            }
        });

        if (navigator.userAgent.indexOf("Firefox") !== -1) {
            window.onbeforeunload = this.leaveRoom;
        }
        else {
            window.onunload = this.leaveRoom;
        }
    }

    componentDidUpdate(prevProps) {
        if (!CBX.haveGrantedWord(prevProps.participant) && CBX.haveGrantedWord(this.props.participant)) {
            this.setState({ avisoVideo: true });
        }
        if (CBX.haveGrantedWord(prevProps.participant) && !CBX.haveGrantedWord(this.props.participant)) {
            this.setState({ avisoVideo: false });
        }
    }


    toggle(type) {
        this.setState({
            modalContent: type
        });
    }

    leaveRoom = () => {
        let request = new XMLHttpRequest();
        request.open('POST', API_URL, false);  // `false` makes the request synchronous
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request.setRequestHeader("Accept", "application/json");
        request.setRequestHeader('authorization', sessionStorage.getItem("participantToken"));
        request.setRequestHeader('x-jwt-token', sessionStorage.getItem("participantToken"));
        request.send(JSON.stringify({
            query: changeParticipantOnlineState,
            variables: {
                participantId: this.props.participant.id,
                online: 2
            }
        }));
    };


    componentWillUnmount() {
        this.props.changeParticipantOnlineState({
            variables: {
                participantId: this.props.participant.id,
                online: 2
            }
        });

        toast.dismiss(this.noStartedToastId);
    }

    _renderAgendaSection = () => {
        return (
            <Grid item xs={isLandscape() && this.state.hasVideo ? 6 : 12} md={this.state.hasVideo ? 4 : 6} style={{ minHeight: '45%', }}>
                {this.state.modalContent === "agenda" ?
                    <Agendas
                        participant={this.props.participant}
                        council={this.props.council}
                        anchorToggle={this.state.hasVideo}
                        agendasAnchor={this.state.agendasAnchor}
                        toggleAgendasAnchor={this.toggleAgendasAnchor}
                        inPc={true}
                    />
                    :
                    <Agendas
                        participant={this.props.participant}
                        council={this.props.council}
                        anchorToggle={this.state.hasVideo}
                        agendasAnchor={this.state.agendasAnchor}
                        toggleAgendasAnchor={this.toggleAgendasAnchor}
                        inPc={true}
                        timeline={
                            < TimelineSection
                                council={this.props.council}
                            />
                        }
                    />
                }
            </Grid>
        )
    }

    _renderAgendaSectionMobile = () => {
        return (
            <Agendas
                participant={this.props.participant}
                council={this.props.council}
                anchorToggle={this.state.hasVideo}
                agendasAnchor={this.state.agendasAnchor}
                toggleAgendasAnchor={this.toggleAgendasAnchor}
                sinCabecera={true}
            />
        )
    }


    render() {
        const { participant, council } = this.props;
        const { agendasAnchor } = this.state;
        let type = "agenda"


        if (isMobile) {
            return (
                <div style={styles.viewContainerM}>
                    <CouncilSidebar
                        isMobile={isMobile}
                        council={council}
                        translate={this.props.translate}
                        agenda={this._renderAgendaSectionMobile()}
                        full={() => this.setState({ full: true, middle: false })}
                        middle={() => this.setState({ full: false, middle: true })}
                        click={this.state.activeInput}
                        participant={participant}
                        comentario={
                            <AdminPrivateMessage
                                translate={this.props.translate}
                                council={council}
                                participant={participant}
                                menuRender={true}
                                activeInput={() => this.setState({ activeInput: true })}//onFocus puede ser
                                onblur={() => this.setState({ activeInput: false })}
                            />
                        }
                        pedirPalabra={
                            <RequestWordMenu
                                translate={this.props.translate}
                                participant={participant}
                                council={council}
                                videoURL={this.state.videoURL}
                                refetchParticipant={this.props.refetchParticipant}
                                isSidebar={true}
                                avisoVideoState={this.state.avisoVideo}
                                avisoVideoStateCerrar={() => this.setState({ avisoVideo: false })}
                            />
                        }
                    />
                    <Header
                        logoutButton={true}
                        participant={participant}
                        council={council}
                        primaryColor={'white'}
                    />
                    <div style={styles.mainContainerM}>
                        <Grid container spacing={8} style={{
                            height: '100%',
                            ...(!this.state.hasVideo || participant.state === PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE ? {
                                display: 'flex',
                                justifyContent: 'center'
                            } : {})
                        }}>
                            {this.state.hasVideo && participant.state !== PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE &&
                                <Grid item xs={isLandscape() ? 12 : 12} md={8} style={{ height: "100%" }}>
                                    <div style={this.state.full ? stylesVideo.portrait[0].fullPadre : isLandscape() ? stylesVideo.landscape[0].middlePadre : stylesVideo.portrait[0].middlePadre}>
                                        <div style={{ width: '100%', height: this.state.avisoVideo ? "calc( 100% - 55px )" : '100%', position: 'relative', top: this.state.avisoVideo ? "55px" : "0px" }}>
                                            <ConfigContext.Consumer>
                                                {config => (
                                                    <AdminAnnouncement
                                                        council={council}
                                                        translate={this.props.translate}
                                                        context={config}
                                                    />
                                                )}
                                            </ConfigContext.Consumer>
                                            <div style={this.state.full ? stylesVideo.portrait[0].fullHijo : isLandscape() ? stylesVideo.landscape[0].middleHijo : stylesVideo.portrait[0].middleHijo}>
                                                <VideoContainer
                                                    council={council}
                                                    participant={participant}
                                                    videoURL={this.state.videoURL}
                                                    setVideoURL={url => this.setState({ videoURL: url })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            }
                        </Grid>
                    </div>
                </div >
            )
        } else {
            return (
                <div style={styles.viewContainer}>
                    <Header
                        logoutButton={true}
                        participant={participant}
                        council={council}
                        primaryColor={'white'}
                    />
                    <div style={styles.mainContainer}>
                        <Grid container spacing={8} style={{
                            height: '100%',
                            ...(!this.state.hasVideo || participant.state === PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE ? {
                                display: 'flex',
                                justifyContent: 'center'
                            } : {})
                        }}>
                            {this.state.hasVideo && participant.state !== PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE &&
                                <Grid item xs={6} md={8} style={{ height: "calc( 100% - 3.5em + 1px )" }}>
                                    <div style={{ width: '100%', height: this.state.avisoVideo ? "calc( 100% - 55px )" : '100%', position: 'relative', top: this.state.avisoVideo ? "55px" : "0px" }}>
                                        <ConfigContext.Consumer>
                                            {config => (
                                                <AdminAnnouncement
                                                    council={council}
                                                    translate={this.props.translate}
                                                    context={config}
                                                />
                                            )}
                                        </ConfigContext.Consumer>
                                        <div style={{ height: '100%', width: '100%', }}>
                                            <VideoContainer
                                                council={council}
                                                participant={participant}
                                                videoURL={this.state.videoURL}
                                                setVideoURL={url => this.setState({ videoURL: url })}
                                            />
                                        </div>
                                    </div>
                                </Grid>
                            }
                            {agendasAnchor === 'right' &&
                                this._renderAgendaSection()
                            }
                            <div style={{ width: '100%', height: "calc( 3.5rem + 1px )" }}>
                                <CouncilSidebar
                                    isMobile={isMobile}
                                    council={council}
                                    translate={this.props.translate}
                                    full={() => this.setState({ full: true, middle: false })}
                                    middle={() => this.setState({ full: false, middle: true })}
                                    click={this.state.activeInput}
                                    agenda={this._renderAgendaSection()}
                                    toogleAgenda={() => this.toggle("agenda")}
                                    toogleResumen={() => this.toggle("timeline")}
                                    modalContent={this.state.modalContent}
                                    participant={participant}
                                    comentario={
                                        <AdminPrivateMessage
                                            translate={this.props.translate}
                                            council={council}
                                            participant={participant}
                                            menuRender={true}
                                            activeInput={() => this.setState({ activeInput: true })}
                                            onblur={() => this.setState({ activeInput: false })}
                                        />
                                    }
                                    pedirPalabra={
                                        <RequestWordMenu
                                            translate={this.props.translate}
                                            participant={participant}
                                            council={council}
                                            videoURL={this.state.videoURL}
                                            refetchParticipant={this.props.refetchParticipant}
                                            isSidebar={true}
                                            isPc={true}
                                            avisoVideoState={this.state.avisoVideo}
                                            avisoVideoStateCerrar={() => this.setState({ avisoVideo: false })}
                                        />
                                    }
                                />
                            </div>
                        </Grid>
                    </div>
                </div >
            );
        }
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
`

export default compose(
    graphql(participantPing, {
        name: 'ping',
        options: props => ({
            pollInterval: 5000
        })
    }),
    graphql(changeParticipantOnlineState, {
        name: 'changeParticipantOnlineState'
    })
)(withApollo(withTranslations()(withDetectRTC()(ParticipantCouncil))));
