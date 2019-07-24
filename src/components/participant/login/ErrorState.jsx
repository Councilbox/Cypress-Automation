import React from "react";
import { Card, Avatar } from "material-ui";
import FontAwesome from "react-fontawesome";
import Header from "../Header";
import withTranslations from "../../../HOCs/withTranslations";
import withWindowSize from "../../../HOCs/withWindowSize";
import withWindowOrientation from "../../../HOCs/withWindowOrientation";
import {
	lightTurquoise,
	secondary,
	primary
} from "../../../styles/colors";
import { PARTICIPANT_ERRORS } from "../../../constants";
import background from "../../../assets/img/fondo_test_mundo2.jpg";
import { moment } from '../../../containers/App';
import { variant } from "../../../config";
//import emptyMeetingTable from "../../../assets/img/empty_meeting_table.png";

const styles = {
	cardContainer: {
		margin: "20px",
		padding: "20px",
		maxWidth: "100%"
	},
	container: {
		width: "100%",
		height: "100%",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		position: "relative"
	},
	splittedContainer: {
		width: "100%",
		height: "100%",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		position: "relative"
	},
	textContainer: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		padding: "15px",
		textAlign: "center"
	},
	councilInfoContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		padding: "15px",
		width: '100%'
	}
};

const ErrorState = ({ code, translate, data, windowSize, windowOrientation }) => {
	const renderError = code => {
		switch (code) {
			case PARTICIPANT_ERRORS.PARTICIPANT_BLOCKED:
				return <ParticipantBlocked translate={translate} />;

			case PARTICIPANT_ERRORS.PARTICIPANT_IS_NOT_REMOTE:
				return <ParticipantNotInRemoteState translate={translate} />;

			case 'REMOTE_CLOSED':
				return <RemoteClosed translate={translate} />;

			case PARTICIPANT_ERRORS.DEADLINE_FOR_LOGIN_EXCEEDED:
				return <TimeLimitExceeded translate={translate} />;
			default:
				return <div />;
		}
	}

	return (
		<div
			style={{
				height: "100vh",
				width: "100vw"
			}}
		>
			<Header
				council={data.council}
			/>
			<div
				style={{
					display: "flex",
					height: "calc(100% - 3em)",
					width: "100%",
					alignItems: "center",
					justifyContent: "center",
					background: `url(${variant === 'COE'? '/img/fondo-conpaas.jpg' : background})`,
					backgroundSize: 'cover',
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center center',
				}}
			>
				<Card style={styles.cardContainer}>
					<div
						style={
							windowSize === "xs" &&
							windowOrientation === "portrait"
								? styles.container
								: styles.splittedContainer
						}
					>
						<div
							style={{
								...styles.textContainer,
								...(windowSize === "xs" &&
								windowOrientation === "portrait"
									? { maxWidth: "100%" }
									: { maxWidth: "50%", minWidth: "50%" })
							}}
						>
							{renderError(code)}
						</div>

						<div style={styles.councilInfoContainer}>
							<div
								style={{
									backgroundColor: lightTurquoise,
									padding: "5px",
									borderRadius: "4px",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
									textAlign: "center"
								}}
							>
								<Avatar
									src={data.council && data.council.company.logo}
									aria-label="CouncilLogo"
								/>
								<h3>{data.council.name}</h3>
								<span>
									{moment(
										new Date(data.council.dateStart)
									).format("LLL")}
								</span>

								{(data.council.statute.existsLimitedAccessRoom === 1) &&
									<p>
										{translate.room_access_closed_at}
										<span style={{fontWeight: 'bold', marginLeft: '2px'}}>
											{
												moment(
													new Date(data.council.dateRealStart)
												)
												.add(data.council.statute.limitedAccessRoomMinutes, 'm')
												.format("HH:mm")
											}
										</span>
									</p>
								}
							</div>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
}


const ParticipantBlocked = ({ translate }) => (
	<React.Fragment>
		<h5 style={{ color: primary, fontWeight: "bold" }}>
			{translate.we_are_sorry}
		</h5>

		<div className="fa-stack fa-lg" style={{ fontSize: "8vh" }}>
			<FontAwesome
				name={"user"}
				stack={"1x"}
				style={{ color: primary }}
			/>
			<FontAwesome
				name={"ban"}
				stack={"2x"}
				style={{ color: secondary }}
			/>
		</div>

		{translate.cant_access_video_room_expelled}
	</React.Fragment>
);

const RemoteClosed = ({ translate }) => (
	<React.Fragment>
		<h5 style={{ color: primary, fontWeight: "bold" }}>
			{translate.we_are_sorry}
		</h5>

		<div className="fa-stack fa-lg" style={{ fontSize: "8vh" }}>
			<FontAwesome
				name={"user"}
				stack={"1x"}
				style={{ color: primary }}
			/>
			<FontAwesome
				name={"ban"}
				stack={"2x"}
				style={{ color: secondary }}
			/>
		</div>

		{'Las votaciones remotas han finalizado' /*TRADUCCION*/}
	</React.Fragment>
);

const ParticipantNotInRemoteState = ({ translate }) => (
	<React.Fragment>
		<h5 style={{ color: primary, fontWeight: "bold" }}>
			{translate.we_are_sorry}
		</h5>

		<div className="fa-stack fa-lg" style={{ fontSize: "8vh" }}>
			<FontAwesome
				name={"globe"}
				stack={"2x"}
				style={{ color: secondary }}
			/>
			<FontAwesome
				name={"times"}
				stack={"1x"}
				style={{ color: primary }}
			/>
		</div>

		{translate.cant_access_video_room_no_remote_assistance}
	</React.Fragment>
);

const TimeLimitExceeded = ({ translate }) => (
	<React.Fragment>
		<h5 style={{ color: primary, fontWeight: "bold" }}>
			{translate.we_are_sorry}
		</h5>

		<div className="fa-stack fa-lg" style={{ fontSize: "8vh" }}>
			<FontAwesome
				name={"clock-o"}
				stack={"2x"}
				style={{ color: primary }}
			/>
		</div>

		{translate.cant_access_time_exceeded}
	</React.Fragment>
);

export default withTranslations()(
	withWindowOrientation(withWindowSize(ErrorState))
);
