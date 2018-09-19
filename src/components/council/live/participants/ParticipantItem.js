import React from "react";
import { MenuItem, Typography, Tooltip } from "material-ui";
import { GridItem, Grid } from "../../../../displayComponents";
import FontAwesome from "react-fontawesome";
import { getSecondary, primary } from "../../../../styles/colors";
import StateIcon from "./StateIcon";
import EmailIcon from "./EmailIcon";
import TypeIcon from "./TypeIcon";
import { removeHTMLTags } from '../../../../utils/CBX';


class ParticipantItem extends React.PureComponent {

	// state = {
	// 	showIcons: false
	// };

	render() {
		const { participant, translate, layout, editParticipant, mode } = this.props;
		const secondary = getSecondary();

		return (
			<GridItem
				xs={12}
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
					// onMouseEnter={() => this.setState({ showIcons: true })}
					// onMouseLeave={() => this.setState({ showIcons: false })}
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
			xs={mode === 'ATTENDANCE' ? 1 : 2}
			lg={mode === 'ATTENDANCE' ? 1 : 2}
			md={mode === 'ATTENDANCE' ? 1 : 2}
		>
			{_getIcon(mode, participant, translate)}
		</GridItem>
		{
			mode === 'ATTENDANCE' &&
			<GridItem
				xs={1}
				lg={1}
				md={1}
			>
				{participant.assistanceComment &&
					<Tooltip title={removeHTMLTags(participant.assistanceComment)}>
						<div style={{ padding: "0.5em" }}>
							<FontAwesome
								name={"comment"}
								style={{ fontSize: '1.5em', color: 'grey' }}
							/>
						</div>
					</Tooltip>
				}
			</GridItem>
		}

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
							width: "2.2em",
							display: "flex",
							justifyContent: "center"
						}}
					>
						<FontAwesome
							name={"info"}
							style={{
								color: secondary,
								fontSize: "1em",
								marginRight: 0
							}}
						/>
					</div>
					<Typography
						variant="body1"
						style={{
							fontWeight: "600",
							// fontSize: "0.95rem"
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
							width: "2.2em",
							display: "flex",
							justifyContent: "center"
						}}
					>
						<FontAwesome
							name={"id-card"}
							style={{
								color: secondary,
								fontSize: "1em",
								marginRight: 0
							}}
						/>
					</div>
					<Typography
						variant="body1"
						style={{ color: "grey", fontSize: "0.75rem" }}
					>
						{`${participant.dni}`}
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
							width: "2.2em",
							display: "flex",
							justifyContent: "center"
						}}
					>
						<FontAwesome
							name={"tag"}
							style={{
								color: secondary,
								fontSize: "1em",
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
				{mode === 'ATTENDANCE' && participant.assistanceComment &&
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center"
						}}
					>
						<div
							style={{
								width: "2.2em",
								display: "flex",
								justifyContent: "center",
								alignItems: 'center'
							}}
						>
							<FontAwesome
								name={"comment"}
								style={{
									color: primary,
									fontSize: "1em",
									marginRight: 0
								}}
							/>
						</div>
						<div
							style={{
								color: "grey",
								fontSize: "0.75rem",
								textOverflow: "ellipsis",
								height: '1.5em',
								overflow: "hidden"
							}}
						>
							{removeHTMLTags(participant.assistanceComment)}
						</div>
					</div>
				}

			</div>
		</div>
	</React.Fragment>
)

const _getIcon = (mode, participant, translate) => {
	switch (mode) {
		case 'STATES':
			return <StateIcon translate={translate} state={participant.state} />
		case 'CONVENE':
			return <EmailIcon translate={translate} reqCode={participant.sendConvene.reqCode} />
		case 'CREDENTIALS':
			return <EmailIcon translate={translate} reqCode={participant.sendCredentials.reqCode} />
		case 'TYPE':
			return <TypeIcon translate={translate} type={participant.type} />
		case 'ATTENDANCE':
			return <StateIcon translate={translate} state={participant.assistanceIntention} />
		default:
			break;
	}
}

export default ParticipantItem;
