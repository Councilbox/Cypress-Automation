import React from "react";
import { graphql, withApollo, compose } from "react-apollo";
import gql from "graphql-tag";
import { Grid } from "material-ui";
import withTranslations from "../../../HOCs/withTranslations";
import withDetectRTC from "../../../HOCs/withDetectRTC";
import { PARTICIPANT_STATES } from '../../../constants';
import Agendas from '../agendas/Agendas';
import Header from "../Header";
import { LiveToast } from '../../../displayComponents';
import { darkGrey } from '../../../styles/colors';
import RequestWordMenu from '../menus/RequestWordMenu';
import { councilHasVideo } from '../../../utils/CBX';
import VideoContainer from '../VideoContainer';
import { toast } from 'react-toastify';
import { councilStarted } from '../../../utils/CBX';

const styles = {
	viewContainer: {
		width: "100vw",
		height: "100vh",
        position: "relative"
	},
	mainContainer: {
		width: "100%",
		height: "calc(100% - 48px)",
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
        hasVideo: councilHasVideo(this.props.council)
    };

    noStartedToastId = null;

    componentDidMount = () => {
        this.props.changeParticipantOnlineState({
            variables: {
                participantId: this.props.participant.id,
                online: 1
            }
        });

        if(!councilStarted(this.props.council)){
            this.noStartedToastId = toast(
                <LiveToast
                    message={this.props.translate.council_not_started_yet} //TRADUCCIÓN
                />, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: false,
                    closeOnClick: false,
                    draggable: false,
                    closeButton: false,
                    className: "liveToast"
                }
            )
        }
    }

    componentDidUpdate = () => {
        if(this.noStartedToastId){
            if(councilStarted(this.props.council)){
                toast.dismiss(this.noStartedToastId);
            }
        }
    }

    _renderAgendaSection = () => {
        return (
            <Grid item xs={12} sm={12} md={this.state.hasVideo? 4 : 6}>
                <Agendas
                    participant={this.props.participant}
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
                            <Grid item xs={12} sm={12} md={8}>
                                <div style={{width: '100%', height: '100%', position: 'relative'}}>
                                    <RequestWordMenu
                                        translate={this.props.translate}
                                        participant={participant}
                                        council={council}
                                        refetchParticipant={this.props.refetchParticipant}
                                    />
                                    <VideoContainer
                                        council={council}
                                        participant={participant}
                                    />
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
