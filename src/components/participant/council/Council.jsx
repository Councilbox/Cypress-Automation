import React from "react";
import { graphql, withApollo } from "react-apollo";
import gql from "graphql-tag";
import { Grid } from "material-ui";
import withTranslations from "../../../HOCs/withTranslations";
import withDetectRTC from "../../../HOCs/withDetectRTC";
import { LoadingMainApp } from '../../../displayComponents';
import Agendas from '../agendas/Agendas';
import Header from "../Header";
import { darkGrey } from '../../../styles/colors';

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
                            <div style={{width: '100%', height: '100%'}}>
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

export default graphql(videoURLQuery, {
    options: props => ({
        variables: {
            participantId: props.participant.id
        }
    })
})(withApollo(withTranslations()(withDetectRTC()(ParticipantCouncil))));
