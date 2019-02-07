import React, { Component } from "react";
import { iframeParticipant } from "../../queries";
import { graphql } from "react-apollo";
import LiveHeader from "../council/live/LiveHeader";
import withTranslations from "../../HOCs/withTranslations";
import { LoadingMainApp } from "../../displayComponents";
import { withRouter } from "react-router-dom";
import logo from "../../assets/img/logo-white.png";

class ParticipantPage extends Component {
	render() {
		const { loading } = this.props.data;
		const roomURL = this.props.data.participantVideoURL;
		const { translate } = this.props;

		if (loading) {
			return <LoadingMainApp />;
		}
		return (
			<div style={{ height: "calc(100vh - 3em" }}>
				<LiveHeader translate={translate} logo={logo} />
				<iframe
					title="cmpScreen"
					allow="geolocation; microphone; camera"
					scrolling="no"
					className="temp_video"
					src={`https://${roomURL}?rand=${Math.round(
						Math.random() * 10000000
					)}`}
					allowFullScreen={true}
					style={{ border: "none !important" }}
				>
					Something wrong...
				</iframe>
			</div>
		);
	}
}

export default withTranslations()(
	withRouter(
		graphql(iframeParticipant, {
			options: props => ({
				variables: {
					participantId: props.match.params.id
				}
			})
		})(ParticipantPage)
	)
);
