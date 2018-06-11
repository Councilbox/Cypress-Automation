import React, { Component } from "react";
import { Card } from "material-ui";
import withTranslations from "../../../HOCs/withTranslations";
import withDetectRTC from "../../../HOCs/withDetectRTC";
import { councilIsLive, councilIsPreparing } from "../../../utils/CBX";
import Header from "../Header";
import CouncilState from "../login/CouncilState";
import background from "../../../assets/img/signup3.jpg";
import AssistanceOption from "./AssistanceOption";


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

class ParticipantLogin extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { participant, council, company, translate } = this.props;
		return (
			<div style={styles.viewContainer}>
				<Header logoutButton={false} participant={participant} council={council} />
				<div style={styles.mainContainer}>
					<Card style={styles.cardContainer}>
							{councilIsPreparing(council) ? (
								<div>
									<h3>{council.name}</h3>
									<p>{`${council.street}, ${council.country}`}</p>
									<p>{translate['1st_call_date']}: {council.dateStart}</p>
									<hr/>
									<p>{translate.welcome} {participant.fullname}</p>
									<h4>{translate.indicate_status}:</h4>
									<AssistanceOption
										option={{title: translate.attend_remotely_through_cbx}}
									/>
									<AssistanceOption
										option={{title: translate.attending_in_person, subtitle: translate.attending_in_person_subtitle}}
									/>
									<AssistanceOption
										option={{title: translate.not_attending}}
									/>
									<AssistanceOption
										option={{title: translate.want_to_delegate_in}}
									/>


								</div>
							) : (
								<CouncilState council={council} company={company} isAssistance/>
							)}
					</Card>
				</div>
			</div>
		);
	}
}

export default withTranslations()(ParticipantLogin);
