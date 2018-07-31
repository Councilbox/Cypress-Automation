import React from "react";
import { graphql, withApollo } from "react-apollo";
import gql from "graphql-tag";
import { Card } from "material-ui";
import withTranslations from "../../../HOCs/withTranslations";
import withDetectRTC from "../../../HOCs/withDetectRTC";
import { LoadingMainApp } from '../../../displayComponents';
import Header from "../Header";

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
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
		backgroundImage: 'red',
		padding: "10px"
	},
	cardContainer: {
		margin: "20px",
		padding: "20px",
		maxWidth: "100%"
	}
};

class ParticipantCouncil extends React.Component {
	state = {
        rand: Date.now()
	};

	render() {
		const { participant, council, data } = this.props;
        const { rand } = this.state;

        if(data.loading){
            return <LoadingMainApp />
        }

		return (
			<div style={styles.viewContainer}>
				<Header logoutButton={true} participant={participant} council={council} />
				<div style={styles.mainContainer}>
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
