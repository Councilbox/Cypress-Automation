import React from "react";
import { graphql, withApollo, compose } from "react-apollo";
import gql from "graphql-tag";
import { Grid } from "material-ui";
import withTranslations from "../../../HOCs/withTranslations";
import withDetectRTC from "../../../HOCs/withDetectRTC";
import { PARTICIPANT_STATES } from '../../../constants';
import Agendas from '../agendas/Agendas';
import Header from "../Header";
import { darkGrey } from '../../../styles/colors';
import RequestWordMenu from '../menus/RequestWordMenu';
import { councilHasVideo } from '../../../utils/CBX';
import { isLandscape } from '../../../utils/screen';
import VideoContainer from '../VideoContainer';
import { toast } from 'react-toastify';
import { API_URL } from "../../../config";
import AdminAnnouncement from './AdminAnnouncement';
import { ConfigContext } from '../../../containers/AppControl';


const styles = {
	viewContainer: {
		width: "100vw",
		height: "100vh",
        position: "relative"
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

class ParticipantCouncil extends React.Component {
	state = {
        agendasAnchor: 'right',
        hasVideo: councilHasVideo(this.props.council),
        videoURL: ''
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
            <Grid item xs={isLandscape() && this.state.hasVideo? 6 : 12} md={this.state.hasVideo? 4 : 6} style={{minHeight: '45%'}}>
                <Agendas
                    participant={this.props.participant}
                    refetchParticipant={this.props.refetchParticipant}
                    council={this.props.council}
                    anchorToggle={this.state.hasVideo}
                    agendasAnchor={this.state.agendasAnchor}
                    toggleAgendasAnchor={this.toggleAgendasAnchor}
                />
            </Grid>
        )
    }

    toggleAgendasAnchor = () => {
        const anchor = this.state.agendasAnchor === 'left' ? 'right' : 'left';
        this.setState({agendasAnchor: anchor});
    }

	render() {
		const { participant, council } = this.props;
        const { agendasAnchor } = this.state;

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
                        ...(!this.state.hasVideo || participant.state === PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE? {
                            display: 'flex',
                            justifyContent: 'center'
                        } : {})
                    }}>
                        {agendasAnchor === 'left' &&
                            this._renderAgendaSection()
                        }

                        {this.state.hasVideo && participant.state !== PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE &&
                            <Grid item xs={isLandscape()? 6 : 12} md={8}>
                                <div style={{width: '100%', height: '100%', position: 'relative'}}>
                                    <ConfigContext.Consumer>
                                        {config => (
                                            <AdminAnnouncement
                                                council={council}
                                                translate={this.props.translate}
                                                context={config}
                                            />
                                        )}
                                    </ConfigContext.Consumer>
                                    <RequestWordMenu
                                        translate={this.props.translate}
                                        participant={participant}
                                        council={council}
                                        videoURL={this.state.videoURL}
                                        refetchParticipant={this.props.refetchParticipant}
                                    />
                                    <div style={{height: 'calc(100% - 2.5em)', width: '100%'}}>
                                        <VideoContainer
                                            council={council}
                                            participant={participant}
                                            videoURL={this.state.videoURL}
                                            setVideoURL={url => this.setState({videoURL: url})}
                                        />
                                    </div>
                                </div>
                            </Grid>
                        }
                        {agendasAnchor === 'right' &&
                            this._renderAgendaSection()
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
