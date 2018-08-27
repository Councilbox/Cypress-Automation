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
        rand: Date.now(),
        agendasAnchor: 'right'
    };

    componentDidMount = () => {
        this.props.changeParticipantOnlineState({
            variables: {
                participantId: this.props.participant.id,
                online: 1
            }
        });

        if (navigator.userAgent.indexOf("Firefox") !== -1) {
            window.onbeforeunload = this.leaveRoom;
        } else {
            window.onunload = this.leaveRoom;
        }
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

    toggleAgendasAnchor = () => {
        const anchor = this.state.agendasAnchor === 'left' ? 'right' : 'left';
        this.setState({agendasAnchor: anchor});
    }

	render() {
		const { participant, council, data } = this.props;
        const { rand, agendasAnchor } = this.state;

        if(data.loading){
            return <LoadingMainApp />
        }

		return (
			<div style={styles.viewContainer}>
				<Header
                    logoutButton={true}
                    participant={participant}
                    council={council}
                    primaryColor={'white'}
                />
				<div style={styles.mainContainer}>
                    <Grid container spacing={8} style={{height: '100%'}}>
                        {agendasAnchor === 'left' &&
                            <Grid item xs={12} sm={4}>
                                <Agendas participant={participant} council={council} agendasAnchor={agendasAnchor} toggleAgendasAnchor={this.toggleAgendasAnchor}/>
                            </Grid>
                        }

                        <Grid item xs={12} sm={8}>
                            <div style={{width: '100%', height: '100%', position: 'relative'}}>
                                <RequestWordMenu
                                    translate={this.props.translate}
                                    participant={participant}
                                />
                                <iframe
                                    title="meetingScreen"
                                    allow="geolocation; microphone; camera"
                                    scrolling="no"
                                    className="temp_video"
                                    src={`https://${data.participantVideoURL}?rand=${rand}`}
                                    allowFullScreen="true"
                                    style={{
                                        border: "none !important"
                                    }}
                                >
                                    Something wrong...
                                </iframe>
                            </div>
                        </Grid>

                        {agendasAnchor === 'right' &&
                            <Grid item xs={12} sm={4}>
                                <Agendas participant={participant} council={council} agendasAnchor={agendasAnchor} toggleAgendasAnchor={this.toggleAgendasAnchor}/>
                            </Grid>
                        }
                    </Grid>
				</div>
			</div>
		);
	}
}

const videoURLQuery = gql`
    query participantVideoURL($participantId: String!){
        participantVideoURL(participantId: $participantId)
    }
`;

const changeParticipantOnlineState = gql`
    mutation changeParticipantOnlineState($participantId: Int!, $online: Int!){
        changeParticipantOnlineState(participantId: $participantId, online: $online){
            success
            message
        }
    }
`;

export default compose(
    graphql(videoURLQuery, {
        options: props => ({
            variables: {
                participantId: props.participant.id
            }
        })
    }),
    graphql(changeParticipantOnlineState, {
        name: 'changeParticipantOnlineState'
    })
)(withApollo(withTranslations()(withDetectRTC()(ParticipantCouncil))));
