import React from "react";
import {
	Card,
	CardHeader,
	Avatar,
	CardContent,
	Dialog,
	DialogTitle,
	DialogContent
} from "material-ui";
import moment from "moment";
import FontAwesome from "react-fontawesome";
import withTranslations from "../../../HOCs/withTranslations";
import withWindowSize from "../../../HOCs/withWindowSize";
import withWindowOrientation from "../../../HOCs/withWindowOrientation";
import OverFlowText from "../../../displayComponents/OverFlowText";
import {
	councilIsInTrash,
	councilIsNotLiveYet,
	councilIsNotCelebrated,
	councilIsFinished
} from "../../../utils/CBX";
import {
	getPrimary,
	getSecondary,
	lightGrey,
	lightTurquoise,
	secondary
} from "../../../styles/colors";
import emptyMeetingTable from "../../../assets/img/empty_meeting_table.png";

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
	render() {
		const {
			translate,
			council,
			company,
			windowSize,
			windowOrientation
		} = this.props;

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

					{councilIsNotLiveYet(council) && (
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
						<TextRender
							title={translate.concil_finished}
							council={council}
							company={company}
							translate={translate}
						/>
					)}
				</div>

				<div style={styles.imageContainer}>
					<img src={emptyMeetingTable} style={styles.image} />
				</div>
			</div>
		);
	}
}

class TextRender extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			dialogOpen: false
		};
	}

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
			hasCouncilInfo,
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
				avatar={
					<Avatar
						src={company.logo}
						aria-label="CouncilLogo"
					/>
				}
				title={<b>{council.name}</b>}
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
					color: secondary
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
