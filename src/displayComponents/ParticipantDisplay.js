import React from "react";
import { getPrimary, getSecondary } from "../styles/colors";
import FontAwesome from "react-fontawesome";
import { Card, Typography, Tooltip } from "material-ui";
import * as CBX from "../utils/CBX";

const ParticipantDisplay = ({ participant, translate, council, delegate }) => {
	const secondary = getSecondary();

	return (
		<Card elevation={0}>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center"
				}}
			>
				<div
					style={{
						width: "2em",
						display: "flex",
						justifyContent: "center"
					}}
				>
					<FontAwesome
						name={"info"}
						style={{
							color: secondary,
							fontSize: "0.8em",
							marginRight: "0.3em"
						}}
					/>
				</div>
				<Typography variant="subheading">
					{`${participant.name} ${participant.surname} - ${
						participant.position
					}`}
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
						width: "2em",
						display: "flex",
						justifyContent: "center"
					}}
				>
					<FontAwesome
						name={"id-card"}
						style={{
							color: secondary,
							fontSize: "0.8em",
							marginRight: "0.3em"
						}}
					/>
				</div>
				<Typography variant="body1">{`${participant.dni}`}</Typography>
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
						width: "2em",
						display: "flex",
						justifyContent: "center"
					}}
				>
					<FontAwesome
						name={"at"}
						style={{
							color: secondary,
							fontSize: "0.8em",
							marginRight: "0.3em"
						}}
					/>
				</div>
				<Typography variant="body1">
					{`${participant.email}`}
				</Typography>
			</div>
			{!CBX.participantIsGuest(participant) &&
				!delegate && (
					<React.Fragment>
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center"
							}}
						>
							<Tooltip title={translate.votes}>
								<div
									style={{
										width: "2em",
										display: "flex",
										justifyContent: "center"
									}}
								>
									<FontAwesome
										name={"ticket"}
										style={{
											color: secondary,
											fontSize: "0.8em",
											marginRight: "0.3em"
										}}
									/>
								</div>
							</Tooltip>
							<Typography variant="body1">
								{`${participant.numParticipations}`}
							</Typography>
						</div>
						{CBX.hasParticipations(council.statute) && (
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center"
								}}
							>
								<Tooltip
									title={translate.census_type_social_capital}
								>
									<div
										style={{
											width: "2em",
											display: "flex",
											justifyContent: "center"
										}}
									>
										<FontAwesome
											name={"percent"}
											style={{
												color: secondary,
												fontSize: "0.8em",
												marginRight: "0.3em"
											}}
										/>
									</div>
								</Tooltip>
								<Typography variant="body1">
									{`${participant.socialCapital}`}
								</Typography>
							</div>
						)}
					</React.Fragment>
				)}
		</Card>
	);
};

export default ParticipantDisplay;
