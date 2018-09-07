import React from "react";
import { getEmailIconByReqCode } from "../../../../utils/CBX";
import { MenuItem, Typography } from "material-ui";
import { GridItem, Grid } from "../../../../displayComponents";
import ParticipantStateIcon from "./ParticipantStateIcon";
import AttendIntentionIcon from "./AttendIntentionIcon";
import FontAwesome from "react-fontawesome";
import { getSecondary } from "../../../../styles/colors";
import { Collapse } from 'react-collapse';
import StateIcon from "./StateIcon";
import EmailIcon from "./EmailIcon";
import TypeIcon from "./TypeIcon";



class ParticipantItem extends React.Component {

	state = {
		showIcons: false
	};

	render() {
		const { participant, translate, layout, editParticipant, mode } = this.props;
		const secondary = getSecondary();

		return (
			<GridItem
				xs={layout !== 'squares' ? 12 : 6}
				md={layout !== 'squares' ? 12 : 6}
				lg={layout !== 'squares' ? 12 : 6}
			>
				<div
					style={{
						width: '100%',
						height: layout === 'compact' ? '1.8em' : layout === 'table' ? '2.5em' : '5em'
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
						onMouseEnter={() => this.setState({ showIcons: true })}
						onMouseLeave={() => this.setState({ showIcons: false })}
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
			xs={2}
			lg={2}
			md={2}
		>
			{_getIcon(mode, participant, translate)}
		</GridItem>
		<GridItem
			xs={6}
			md={6}
			lg={6}
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
			{_getIcon(mode, participant, translate)}
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
			</div>
		</div>
	</React.Fragment>
)

const _getIcon = (mode, participant, translate) => {
	switch (mode) {
		case 'STATES':
			return <StateIcon translate={translate} state={participant.state}/>
		case 'CONVENE':
			return <StateIcon translate={translate} reqCode={participant.sendConvene.reqCode}/>
		case 'CREDENTIALS':
			return <StateIcon translate={translate} reqCode={participant.sendCredentials.reqCode}/>
		case 'TYPE':
			return <TypeIcon translate={translate} type={participant.type}/>
		case 'ATTENDANCE':
			return <StateIcon translate={translate} state={participant.assistanceIntention}/>
		default:
			break;
	}
}

export default ParticipantItem;
