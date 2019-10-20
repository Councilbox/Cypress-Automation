import React from "react";
import { Card } from "material-ui";
import withTranslations from "../../../HOCs/withTranslations";
import withDetectRTC from "../../../HOCs/withDetectRTC";
import { councilIsLive } from "../../../utils/CBX";
import { checkIsCompatible } from '../../../utils/webRTC';
import LoginForm from "./LoginForm";
import CouncilState from "./CouncilState";
import { NotLoggedLayout, Scrollbar } from '../../../displayComponents';
import { isMobile } from "react-device-detect";


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
		padding: isMobile ? "" : "10px"
	},
	cardContainer: {
		margin: isMobile ? "" : "20px",
		minWidth: width,
		maxWidth: "100%",
		height: '70vh'
	}
};

const ParticipantLogin = ({ participant, council, company, ...props }) => {
	const [isCompatible, setIsCompatible] = React.useState(null);

	React.useEffect(() => {
		let isCompatible = checkIsCompatible(props.detectRTC, council, participant);
		setIsCompatible(isCompatible)
	}, [props.detectRTC, council, participant]);

	return (
		<NotLoggedLayout
			translate={props.translate}
			helpIcon={true}
			languageSelector={false}
		>
			<div style={styles.mainContainer}>
				<Card style={styles.cardContainer} elevation={6}>
					<Scrollbar>
						<React.Fragment>
							{(councilIsLive(council) && !participant.hasVoted) ? (
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

export default withTranslations()(withDetectRTC()(ParticipantLogin));
