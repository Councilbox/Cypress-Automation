import React from "react";
import { Card } from "material-ui";
import withTranslations from "../../../HOCs/withTranslations";
import withDetectRTC from "../../../HOCs/withDetectRTC";
import { councilIsLive, councilIsFinished, checkHybridConditions } from "../../../utils/CBX";
import { checkIsCompatible } from '../../../utils/webRTC';
import LoginForm from "./LoginForm";
import CouncilState from "./CouncilState";
import { NotLoggedLayout, Scrollbar } from '../../../displayComponents';
import { isMobile } from "../../../utils/screen";

// '850px'
const width = window.innerWidth > 450 ? '850px' : '100%'

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
		//height: '50vh',
		minHeight: '50vh'
		// height: '70vh'
	}
};

const ParticipantLogin = ({ participant, council, company, ...props }) => {
	const [selectHeadFinished, setSelectHeadFinished] = React.useState("participacion");

	if ((councilIsFinished(council) || participant.hasVoted) && isMobile) {
		return (
			<NotLoggedLayout
				translate={props.translate}
				helpIcon={true}
				languageSelector={false}
				councilIsFinished={true}
				setSelectHeadFinished={setSelectHeadFinished}
				selectHeadFinished={selectHeadFinished}
			>
				<div style={{ width: "100%", background: "transparent", height: "100%" }} >
					<div style={{ width: "100%", background: "transparent", height: "100%" }}>
						<CouncilState council={council} company={company} participant={participant} selectHeadFinished={selectHeadFinished} />
					</div>
				</div>
			</NotLoggedLayout>
		);
	} else {
		return (
			<NotLoggedLayout
				translate={props.translate}
				helpIcon={true}
				languageSelector={false}
			>
				<Scrollbar>
					<div style={styles.mainContainer}>
						<Card style={{
							...styles.cardContainer,
							...((councilIsLive(council) && !participant.hasVoted) ? {
								minWidth: window.innerWidth > 450 ? '550px' : '100%'
							} : {
									minWidth: width
							})
						}} elevation={6}>
							{councilIsFinished(council) ?
								<div>
									{((councilIsLive(council) && !participant.hasVoted) && !checkHybridConditions(council)) ? (
										<LoginForm
											participant={participant}
											council={council}
											company={company}
										/>
									) : (
											<CouncilState council={council} company={company} participant={participant} />
										)}
								</div>
								:
								<div>
									{((councilIsLive(council) && !participant.hasVoted) && !checkHybridConditions(council)) ? (
										<LoginForm
											participant={participant}
											council={council}
											company={company}
										/>

									) : (
											<CouncilState council={council} company={company} participant={participant} />
										)}
								</div>
							}
						</Card>
					</div>
				</Scrollbar>
				
			</NotLoggedLayout>
		);
	}
}



export default withTranslations()(withDetectRTC()(ParticipantLogin));
