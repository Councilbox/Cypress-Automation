import React from "react";
import { MenuItem, Typography, Tooltip, Card } from "material-ui";
import { GridItem, Grid, BasicButton } from "../../../../displayComponents";
import FontAwesome from "react-fontawesome";
import { getSecondary, primary } from "../../../../styles/colors";
import StateIcon from "./StateIcon";
import EmailIcon from "./EmailIcon";
import TypeIcon from "./TypeIcon";
import { removeHTMLTags, isRepresented } from '../../../../utils/CBX';
import withWindowSize from '../../../../HOCs/withWindowSize';
import AttendIntentionIcon from "./AttendIntentionIcon";


class ParticipantItem extends React.PureComponent {

	// state = {
	// 	showIcons: false
	// };

	render() {
		const { participant, translate, layout, editParticipant, mode } = this.props;
		const secondary = getSecondary();

		return (
			<GridItem
				xs={this.props.orientation === 'portrait'? 12 : 6}
				md={layout !== 'squares' ? 12 : 4}
				lg={layout !== 'squares' ? 12 : 4}
			>
				<div
					style={{
						width: '98%',
						marginRight: '5%',
						height: layout === 'compact' ? '1.8em' : layout === 'table' ? '2.5em' : '6em'
					}}
				>
					<MenuItem
						style={{
							width: "100%",
							height: '100%',
							borderRadius: '2px',
							padding: '0px 2px',
							textOverflow: "ellipsis",
							overflow: "hidden"
						}}
						onClick={() => editParticipant(participant.id)}
					// onMouseEnter={() => this.setState({ showIcons: true })}
					// onMouseLeave={() => this.setState({ showIcons: false })}
					>
						{layout === 'compact' &&
							<CompactItemLayout
								secondary={secondary}
								participant={participant}
								translate={translate}
								showSignatureModal={this.props.showSignatureModal}
								mode={mode}
							/>
						}
						{layout === 'table' &&
							<CompactItemLayout
								secondary={secondary}
								participant={participant}
								translate={translate}
								showSignatureModal={this.props.showSignatureModal}
								mode={mode}
							/>
						}
						{layout === 'squares' &&
							<TabletItem
								secondary={secondary}
								participant={participant}
								translate={translate}
								showSignatureModal={this.props.showSignatureModal}
								mode={mode}
							/>
						}
					</MenuItem>
				</div>
			</GridItem>
		);
	}
};

const CompactItemLayout = ({ participant, translate, mode, showSignatureModal, secondary }) => (
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
		<GridItem
			xs={2}
			md={2}
			lg={2}
		>
			{!isRepresented(participant) &&
				<BasicButton
					text={participant.signed? translate.user_signed : translate.to_sign}
					fullWidth
					buttonStyle={{border: `1px solid ${participant.signed? primary : secondary}`}}
					type="flat"
					color={"white"}
					onClick={event => {
						event.stopPropagation();
						showSignatureModal()
					}}
					textStyle={{color: participant.signed? primary : secondary, fontWeight: '700'}}
				/>
			}
		</GridItem>
	</Grid>
)

const TabletItem = ({ participant, translate, secondary, mode, showSignatureModal }) => (
	<React.Fragment>
		<Card
			style={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				width: "100%",
				textOverflow: "ellipsis",
				overflow: "hidden"
			}}
		>
			<div style={{width: '65%', display: 'flex'}}>
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
						<Tooltip title={`${participant.name} ${participant.surname}`}>
							<Typography
								variant="body1"
								className="truncate"
								style={{
									fontWeight: "600",
									width: 'calc(100% - 2.2em)'
								}}
							>
								{`${participant.name} ${participant.surname}`}
							</Typography>
						</Tooltip>
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
			<div
				style={{
					width: '35%',
					padding: '0.3em',
					paddingRight: '0.6em',
					height: '6em',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center'
				}}
			>
				{!isRepresented(participant) &&
					<BasicButton
						text={participant.signed? translate.user_signed : translate.to_sign}
						fullWidth
						buttonStyle={{border: `1px solid ${participant.signed? primary : secondary}`}}
						type="flat"
						color={"white"}
						onClick={event => {
							event.stopPropagation();
							showSignatureModal()
						}}
						textStyle={{color: participant.signed? primary : secondary, fontWeight: '700'}}
					/>
				}
			</div>
		</Card>
	</React.Fragment>
)

const _getIcon = (mode, participant, translate, showCommentModal) => {
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
			return <AttendIntentionIcon participant={participant} translate={translate} size="2em" color={getSecondary()} />
		default:
			break;
	}
}

export default withWindowSize(ParticipantItem);
