import React from "react";
import { Card } from "material-ui";
import withTranslations from "../../../HOCs/withTranslations";
import withDetectRTC from "../../../HOCs/withDetectRTC";
import { councilIsLive } from "../../../utils/CBX";
import { checkIsCompatible, COMPATIBLE } from '../../../utils/webRTC';
import Header from "../Header";
import LoginForm from "./LoginForm";
import CouncilState from "./CouncilState";
import IncompatibleDeviceBrowser from '../IncompatibleDeviceBrowser';
import background from "../../../assets/img/signup3.jpg";

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
		backgroundImage: `url(${background})`,
		padding: "10px"
	},
	cardContainer: {
		margin: "20px",
		padding: "20px",
		maxWidth: "100%"
	}
};

class ParticipantLogin extends React.Component {
	state = {
		isCompatible: null
	};

	static getDerivedStateFromProps(props, state){
		const isCompatible = checkIsCompatible(props.detectRTC);
		return {isCompatible: isCompatible}
	}

	render() {
		const { participant, council, company } = this.props;
		const { isCompatible } = this.state;
		return (
			<div style={styles.viewContainer}>
				<Header />
				<div style={styles.mainContainer}>
					<Card style={styles.cardContainer}>
						{(isCompatible === COMPATIBLE) ?
								<React.Fragment>
									{councilIsLive(council) ? (
										<LoginForm
											participant={participant}
											council={council}
											company={company}
										/>
									) : (
										<CouncilState council={council} company={company} />
									)}
								</React.Fragment>
							:
								<IncompatibleDeviceBrowser status={isCompatible} />
						}
					</Card>
				</div>
			</div>
		);
	}
}

export default withTranslations()(withDetectRTC()(ParticipantLogin));
