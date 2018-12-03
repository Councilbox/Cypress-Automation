import React from "react";
import {
	CardHeader,
	Avatar,
	Dialog,
	DialogTitle,
	DialogContent
} from "material-ui";
import FontAwesome from "react-fontawesome";
import { BasicButton } from '../../../displayComponents';
import withTranslations from "../../../HOCs/withTranslations";
import withWindowSize from "../../../HOCs/withWindowSize";
import withWindowOrientation from "../../../HOCs/withWindowOrientation";
import Results from '../Results';
import OverFlowText from "../../../displayComponents/OverFlowText";
import {
	councilIsInTrash,
	councilIsNotLiveYet,
	councilIsNotCelebrated,
	councilIsFinished,
	councilIsLive
} from "../../../utils/CBX";
import {
	getPrimary,
	lightTurquoise,
	getSecondary
} from "../../../styles/colors";
import emptyMeetingTable from "../../../assets/img/empty_meeting_table.png";
import { moment } from '../../../containers/App';

const styles = {
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
	imageContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		padding: "15px"
	},
	image: {
		maxWidth: "60%"
	}
};

class CouncilState extends React.Component {
	state = {
		modal: false
	}

	render() {
		const {
			translate,
			council,
			company,
			windowSize,
			windowOrientation,
			isAssistance
		} = this.props;

		const secondary = getSecondary();

		return (
			<div
				style={
					windowSize === "xs" && windowOrientation === "portrait"
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
					{councilIsInTrash(council) && (
						<TextRender
							title={translate.we_are_sorry}
							text={translate.not_held_council}
							council={council}
							company={company}
							translate={translate}
						/>
					)}

					{isAssistance && councilIsLive(council) && (
						<TextRender
							title={translate.we_are_sorry}
							text={translate.council_not_started_yet_retry_later}
							isHtmlText={true}
							council={council}
							company={company}
							translate={translate}
						/>
					)}

					{!isAssistance && councilIsNotLiveYet(council) && (
						<TextRender
							title={translate.we_are_sorry}
							text={translate.council_not_started_yet_retry_later}
							isHtmlText={true}
							council={council}
							company={company}
							translate={translate}
						/>
					)}

					{councilIsNotCelebrated(council) && (
						<TextRender
							title={translate.we_are_sorry}
							text={translate.not_held_council}
							council={council}
							company={company}
							translate={translate}
						/>
					)}

					{councilIsFinished(council) && (
						<React.Fragment>
							<TextRender
								title={translate.concil_finished}
								council={council}
								company={company}
								translate={translate}
							/>
							<BasicButton
								text={translate.see_participation}
								color={secondary}
								textStyle={{color: 'white', fontWeight: '700', marginTop: '0.9em'}}
								onClick={() => this.setState({
									modal: true
								})}
							/>
							<Results
								council={council}
								participant={this.props.participant}
								requestClose={() => this.setState({ modal: false })}
								translate={translate}
								open={this.state.modal}
							/>
						</React.Fragment>

					)}
				</div>

				<div style={styles.imageContainer}>
					<img src={emptyMeetingTable} style={styles.image} alt="no-room-logo" />
				</div>
			</div>
		);
	}
}

class TextRender extends React.PureComponent {
	state = {
		dialogOpen: false
	};

	handleOpenDialog = () => {
		this.setState({ dialogOpen: true });
	};

	handleCloseDialog = () => {
		this.setState({ dialogOpen: false });
	};

	render() {
		const {
			title,
			text,
			isHtmlText,
			council,
			company,
			translate
		} = this.props;
		const primaryColor = getPrimary();
		return (
			<React.Fragment>
				<h3 style={{ color: primaryColor }}>{title}</h3>

				{text && (
					<p style={{ marginBottom: "8px" }}>
						{isHtmlText ? (
							<span dangerouslySetInnerHTML={{ __html: text }} />
						) : (
							text
						)}
					</p>
				)}

				{council.noCelebrateComment &&
					council.noCelebrateComment.trim() !== "" && (
						<div style={{ maxWidth: "100%", position: "relative" }}>
							<p style={{ marginBottom: "0px" }}>
								{translate.reason_not_held_council}:
							</p>
							<OverFlowText
								icon={"info-circle"}
								action={this.handleOpenDialog}
							>
								<p
									style={{
										maxWidth: "100%",
										marginBottom: "8px",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap",
										overflow: "hidden"
									}}
								>
									{council.noCelebrateComment}
								</p>
							</OverFlowText>
						</div>
					)}


				<CouncilInfoCardRender council={council} company={company} />

				<TextDialog
					handleClose={this.handleCloseDialog}
					text={council.noCelebrateComment}
					open={this.state.dialogOpen}
				/>
			</React.Fragment>
		);
	}
}

const CouncilInfoCardRender = ({ council, company }) => (
	<React.Fragment>
		<div
			style={{
				backgroundColor: lightTurquoise,
				borderRadius: "4px"
			}}
		>
			<CardHeader
				/* avatar={
					<Avatar
						src={company.logo}
						aria-label="CouncilLogo"
					/>
				} */
				title={
					<div>
						<img src={company.logo} style={{height: '2em'}}></img><br />
						<b>{council.name}</b>
					</div>
				}
				subheader={moment(new Date(council.dateStart)).format(
					"LLL"
				)}
			/>
			{/* <CardContent style={{ paddingBottom: "16px" }}>
						<p
							dangerouslySetInnerHTML={{
								__html: council.conveneText
							}}
						/>
					</CardContent> */}
		</div>
	</React.Fragment>
);

const TextDialog = ({ open, handleClose, title, text }) => (
	<Dialog
		open={open}
		onClose={handleClose}
		aria-labelledby="simple-dialog-title"
	>
		{title && (
			<DialogTitle id="simple-dialog-title">
				Set backup account
					</DialogTitle>
		)}
		<DialogContent>
			<FontAwesome
				name={"close"}
				style={{
					position: "absolute",
					right: "10px",
					top: "5px",
					cursor: "pointer",
					color: getSecondary()
				}}
				onClick={handleClose}
			/>
			{text}
		</DialogContent>
	</Dialog>
);

export default withTranslations()(
	withWindowOrientation(withWindowSize(CouncilState))
);
