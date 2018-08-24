import React from "react";
import { getEmailIconByReqCode, isRepresented, hasHisVoteDelegated } from "../../../../utils/CBX";
import { MenuItem, Tooltip, Typography } from "material-ui";
import { GridItem, Grid } from "../../../../displayComponents";
import ParticipantStateIcon from "../ParticipantStateIcon";
import AttendIntentionIcon from "./AttendIntentionIcon";
import FontAwesome from "react-fontawesome";
import { getSecondary } from "../../../../styles/colors";
import { Collapse } from 'react-collapse';

class ParticipantItem extends React.Component {

	state = {
		showIcons: false
	};

	render(){
		const { participant, translate, layout, editParticipant, mode } = this.props;
		const secondary = getSecondary();

		return (
			<GridItem
				xs={layout !== 'squares'? 12 : 6}
				md={layout !== 'squares'? 12 : 6}
				lg={layout !== 'squares'? 12 : 6}
			>
				<Collapse isOpened={true}>
					<div
						style={{
							width: '100%',
							height: layout === 'compact'? '1.8em' : layout === 'table' ? '2.5em' : '5em'
						}}
					>
						<MenuItem
							style={{
								width: "100%",
								height: '100%',
								padding: 0,
								textOverflow: "ellipsis",
								overflow: "hidden"
							}}
							onClick={() => editParticipant(participant.id)}
							onMouseEnter={() => this.setState({showIcons: true})}
							onMouseLeave={() => this.setState({showIcons: false})}
						>
							{layout === 'compact' &&
								<CompactItemLayout
									participant={participant}
									translate={translate}
									mode={mode}
								/>
							}
							{layout === 'table' &&
								<CompactItemLayout
									participant={participant}
									translate={translate}
									mode={mode}
								/>
							}
							{layout === 'squares' &&
								<TabletItem
									secondary={secondary}
									participant={participant}
									translate={translate}
									mode={mode}
								/>
							}
						</MenuItem>
					</div>
				</Collapse>
			</GridItem>
		);
	}
};

const CompactItemLayout = ({ participant, translate, mode }) => (
	<Grid
		spacing={0}
		style={{
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			width: "100%",
			fontSize: '14px',
			textOverflow: "ellipsis",
			overflow: "hidden"
		}}
	>
		<GridItem
			xs={1}
			lg={1}
			md={1}
		>
			{mode === "participantState" ? (
				<div style={{fontSize: '0.6em', position: 'relative', display: 'flex', justifyContent: 'center'}}>
					<ParticipantStateIcon
						participant={participant}
						translate={translate}
					/>
				</div>
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
		</GridItem>
		<GridItem
			xs={4}
			md={4}
			lg={4}
		>
			{`${participant.name} ${participant.surname}`}
		</GridItem>
		<GridItem
			xs={2}
			md={2}
			lg={2}
		>
			{`${participant.dni}`}
		</GridItem>
		<GridItem
			xs={2}
			md={2}
			lg={2}
		>
			{`${participant.position}`}
		</GridItem>
	</Grid>
)

const TabletItem = ({ participant, translate, secondary, mode }) => (
	<React.Fragment>
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
	</React.Fragment>
)

export default ParticipantItem;

/*
		<GridItem
			/*xs={showVideo(council) ? 6 : 4}
			md={showVideo(council) ? 6 : 4}
			lg={showVideo(council) ? 6 : 4}
			xs={12}
			md={12}
			lg={12}
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
*/
