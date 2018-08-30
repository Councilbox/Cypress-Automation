import React from "react";
import { Card } from "material-ui";
import withTranslations from "../../../HOCs/withTranslations";
import withDetectRTC from "../../../HOCs/withDetectRTC";
import { councilIsLive } from "../../../utils/CBX";
import { checkIsCompatible, COMPATIBLE } from '../../../utils/webRTC';
import Header from "../Header";
import LoginForm from "./LoginForm";
import CouncilState from "./CouncilState";
import { NotLoggedLayout } from '../../../displayComponents';
import IncompatibleDeviceBrowser from '../IncompatibleDeviceBrowser';

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
		padding: "20px",
		minWidth: '350px',
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
			<NotLoggedLayout
				translate={this.props.translate}
				helpIcon={true}
				languageSelector={false}
			>
				<div style={styles.mainContainer}>
					<Card style={styles.cardContainer} elevation={6}>
						{(isCompatible === COMPATIBLE) ?
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
							:
								<IncompatibleDeviceBrowser status={isCompatible} />
						}
					</Card>
				</div>
			</NotLoggedLayout>
		);
	}
}

export default withTranslations()(withDetectRTC()(ParticipantLogin));
