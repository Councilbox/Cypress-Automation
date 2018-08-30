import React from "react";
import { graphql, withApollo, compose } from "react-apollo";
import gql from "graphql-tag";
import { Grid } from "material-ui";
import withTranslations from "../../../HOCs/withTranslations";
import withDetectRTC from "../../../HOCs/withDetectRTC";
import { LoadingMainApp } from '../../../displayComponents';
import Agendas from '../agendas/Agendas';
import Header from "../Header";
import { darkGrey } from '../../../styles/colors';
import RequestWordMenu from '../menus/RequestWordMenu';
import { API_URL } from '../../../config';
import { councilHasVideo } from '../../../utils/CBX';
import VideoContainer from '../VideoContainer';

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

    componentDidMount = () => {
        this.props.changeParticipantOnlineState({
            variables: {
                participantId: this.props.participant.id,
                online: 1
            }
        });
    }

    leaveRoom = () => {
        var request = new XMLHttpRequest();
        const token = sessionStorage.getItem("token");
	    const participantToken = sessionStorage.getItem("participantToken");
        request.open('POST', API_URL, false);  // `false` makes the request synchronous
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request.setRequestHeader("Accept", "application/json");
        request.setRequestHeader("x-jwt-token", token ? token : participantToken);
        request.onload = function () {
            var users = JSON.parse(request.responseText);
            if (request.readyState == 4 && request.status == "201") {
                console.table(users);
            } else {
                console.error(users);
            }
        }
        request.send(JSON.stringify({
            query: changeParticipantOnlineState,
            variables: {
                participantId: this.props.participant.id,
                online: 2
            }
        }));
    };

    _renderAgendaSection = () => {
        return (
            <Grid item xs={12} sm={this.state.hasVideo? 4 : 6}>
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
		const { participant, council, data } = this.props;
        const { agendasAnchor } = this.state;
        //const hasVideo = councilHasVideo(council);


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
                        ...(!this.state.hasVideo? {
                            display: 'flex',
                            justifyContent: 'center'
                        } : {})
                    }}>
                        {agendasAnchor === 'left' &&
                            this._renderAgendaSection()
                        }

                        {this.state.hasVideo &&
                            <Grid item xs={12} sm={8}>
                                <div style={{width: '100%', height: '100%', position: 'relative'}}>
                                    <RequestWordMenu
                                        translate={this.props.translate}
                                        participant={participant}
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
            pollInterval: 7000
        })
    }),
    graphql(changeParticipantOnlineState, {
        name: 'changeParticipantOnlineState'
    })
)(withApollo(withTranslations()(withDetectRTC()(ParticipantCouncil))));
