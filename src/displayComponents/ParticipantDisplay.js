import React from "react";
import { getSecondary } from "../styles/colors";
import FontAwesome from "react-fontawesome";
import { Typography, Tooltip } from "material-ui";
import * as CBX from "../utils/CBX";

const ParticipantDisplay = ({ participant, translate, council, delegate }) => {
	const secondary = getSecondary();

	return (
		<div style={{padding: '0.5em'}}>
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
				<Typography variant="subheading" className="truncate">
					<b>{`${participant.name} ${participant.surname || ''}`}</b>
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
				<Typography variant="body1" className="truncate">{`${participant.dni || '-'}`}</Typography>
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
						name={"tag"}
						style={{
							color: secondary,
							fontSize: "0.8em",
							marginRight: "0.3em"
						}}
					/>
				</div>
				<Typography variant="body1" className="truncate">
					{`${participant.position || '-'}`}
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
						name={"at"}
						style={{
							color: secondary,
							fontSize: "0.8em",
							marginRight: "0.3em"
						}}
					/>
				</div>
				<Typography variant="body1" className="truncate">
				{`${participant.email || '-'}`}
				</Typography>
			</div>
			{!CBX.participantIsGuest(participant) &&!CBX.participantIsRepresentative(participant) &&
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
		</div>
	);
};

export default ParticipantDisplay;
