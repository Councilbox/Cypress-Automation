import React from "react";
import { Card } from "material-ui";
import withTranslations from "../../../HOCs/withTranslations";
import withDetectRTC from "../../../HOCs/withDetectRTC";
import { councilIsLive } from "../../../utils/CBX";
import { checkIsCompatible, COMPATIBLE } from '../../../utils/webRTC';
import LoginForm from "./LoginForm";
import CouncilState from "./CouncilState";
import { NotLoggedLayout, Scrollbar } from '../../../displayComponents';
import IncompatibleDeviceBrowser from '../IncompatibleDeviceBrowser';

const width = window.innerWidth > 450 ? '550px' : '100%'

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
		padding: "10px"
	},
	cardContainer: {
		margin: "20px",
		minWidth: width,
		maxWidth: "100%",
		height: '65vh'
	}
};

class ParticipantLogin extends React.Component {
	state = {
		isCompatible: null
	};

	static getDerivedStateFromProps(props, state){
		const isCompatible = checkIsCompatible(props.detectRTC, props.council, props.participant);
		return {isCompatible: isCompatible}
	}

	render() {
		const { participant, council, company } = this.props;
		const { isCompatible } = this.state;
		return (
			<NotLoggedLayout
				translate={this.props.translate}
				helpIcon={true}
				languageSelector={false}
			>
				<div style={styles.mainContainer}>
					<Card style={styles.cardContainer} elevation={6}>
						<Scrollbar>
							<React.Fragment>
								{councilIsLive(council) ? (
									<LoginForm
										participant={participant}
										council={council}
										company={company}
									/>
								) : (
									<CouncilState council={council} company={company} participant={participant} />
								)}
							</React.Fragment>
						</Scrollbar>
					</Card>
				</div>
			</NotLoggedLayout>
		);
	}
}

export default withTranslations()(withDetectRTC()(ParticipantLogin));
