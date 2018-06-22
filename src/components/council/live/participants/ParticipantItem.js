import React from "react";
import {
	showVideo,
	getEmailIconByReqCode,
	isRepresented,
	hasHisVoteDelegated
} from "../../../../utils/CBX";
import { MenuItem, Tooltip, Typography } from "material-ui";
import { GridItem } from "../../../../displayComponents";
import ParticipantStateIcon from "../ParticipantStateIcon";
import AttendIntentionIcon from "./AttendIntentionIcon";
import FontAwesome from "react-fontawesome";
import { getSecondary } from "../../../../styles/colors";

const ParticipantItem = ({
	participant,
	translate,
	council,
	editParticipant,
	mode
}) => {
	const secondary = getSecondary();

	return (
		<GridItem
			xs={showVideo(council) ? 6 : 4}
			md={showVideo(council) ? 6 : 4}
			lg={showVideo(council) ? 6 : 4}
			key={`liveParticipant_${participant.id}`}
			style={{
				display: "flex",
				alignItem: "center",
				justifyContent: "center",
				marginBottom: "1.2em",
				cursor: "pointer",
				position: "relative"
			}}
		>
			<MenuItem
				style={{
					width: "80%",
					height: "4.3em",
					textOverflow: "ellipsis",
					overflow: "hidden"
				}}
				onClick={() => editParticipant(participant.id)}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						width: "100%",
						textOverflow: "ellipsis",
						overflow: "hidden"
					}}
				>
					{mode === "participantState" ? (
						<ParticipantStateIcon
							participant={participant}
							translate={translate}
						/>
					) : mode === "attendIntention" ? (
						<AttendIntentionIcon
							translate={translate}
							participant={participant}
						/>
					) : participant.notifications.length > 0 ? (
						<img
							style={{
								height: "2.1em",
								width: "auto"
							}}
							src={getEmailIconByReqCode(
								participant.notifications[
									participant.notifications.length - 1
								].reqCode
							)}
							alt="email-state-icon"
						/>
					) : (
						"-"
					)}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							marginLeft: "0.6em",
							width: "100%",
							textOverflow: "ellipsis",
							overflow: "hidden"
						}}
					>
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center"
							}}
						>
							<div
								style={{
									width: "1.6em",
									display: "flex",
									justifyContent: "center"
								}}
							>
								<FontAwesome
									name={"info"}
									style={{
										color: secondary,
										fontSize: "0.8em",
										marginRight: 0
									}}
								/>
							</div>
							<Typography
								variant="body1"
								style={{
									fontWeight: "600",
									fontSize: "0.95rem"
								}}
							>
								{`${participant.name} ${participant.surname}`}
							</Typography>
						</div>
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center"
							}}
						>
							<div
								style={{
									width: "1.6em",
									display: "flex",
									justifyContent: "center"
								}}
							>
								<FontAwesome
									name={"tag"}
									style={{
										color: secondary,
										fontSize: "0.8em",
										marginRight: 0
									}}
								/>
							</div>
							<Typography
								variant="body1"
								style={{ color: "grey", fontSize: "0.75rem" }}
							>
								{`${participant.position}`}
							</Typography>
						</div>
						{isRepresented(participant) && (
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center"
								}}
							>
								<Tooltip
									title={`${translate.represented_by}: ${
										participant.representative.name
									} ${participant.representative.surname}`}
								>
									<div style={{ display: "flex" }}>
										<div
											style={{
												width: "1.6em",
												display: "flex",
												justifyContent: "center"
											}}
										>
											<FontAwesome
												name={"user"}
												style={{
													color: secondary,
													fontSize: "0.8em",
													marginRight: 0
												}}
											/>
										</div>
										<Typography
											variant="body1"
											style={{
												fontSize: "0.75rem",
												color: "grey",
												width: "85%",
												textOverflow: "ellipsis",
												overflow: "hidden"
											}}
										>
											{`${translate.represented_by}: ${
												participant.representative.name
											} ${
												participant.representative
													.surname
											}`}
										</Typography>
									</div>
								</Tooltip>
							</div>
						)}
						{hasHisVoteDelegated(participant) && (
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center"
								}}
							>
								<Tooltip
									title={`${translate.voting_delegate}: ${
										participant.representative.name
									} ${participant.representative.surname}`}
								>
									<div style={{ display: "flex" }}>
										<div
											style={{
												width: "1.6em",
												display: "flex",
												justifyContent: "center"
											}}
										>
											<FontAwesome
												name={"user"}
												style={{
													color: secondary,
													fontSize: "0.8em",
													marginRight: 0
												}}
											/>
										</div>
										<Typography
											variant="body1"
											style={{
												fontSize: "0.75rem",
												width: "85%",
												color: "grey",
												textOverflow: "ellipsis",
												overflow: "hidden"
											}}
										>
											{`${translate.voting_delegate}: ${
												participant.representative.name
											} ${
												participant.representative
													.surname
											}`}
										</Typography>
									</div>
								</Tooltip>
							</div>
						)}
					</div>
				</div>
			</MenuItem>
		</GridItem>
	);
};

export default ParticipantItem;
