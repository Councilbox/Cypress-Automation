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
import { isMobile } from 'react-device-detect';
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
import logoIcon from "../../../assets/img/logo-icono.png";
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
	// textContainer: {
	// 	display: "flex",
	// 	flexDirection: "column",
	// 	alignItems: "center",
	// 	justifyContent: "center",
	// 	padding: "15px",
	// 	textAlign: "center"
	// },
	imageContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		padding: "15px"
	},
	image: {
		maxWidth: "60%"
	},
	textAndImage: {
		display: "flex",
		alignItems: "center",
		background: "blue"
	},
	displaiFlex: {
		display: "flex"
	},
	bottom1: {
		marginBottom: '1em'
	},
	bottom2: {
		marginBottom: '2em'
	},
};

class CouncilState extends React.Component {
	state = {
		modal: false,
		width: window.innerWidth,
		height: window.innerHeight
	}

	componentDidMount() {
		window.addEventListener("resize", this.updateDimensions);
	}

	updateDimensions = () => {
		this.setState({
			width: window.innerWidth,
			height: window.innerHeight
		});
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
					(windowSize === "xs" && windowOrientation === "portrait"
						? styles.container
						: styles.splittedContainer)
				}
			>
				<div
					style={{
						...styles.textContainer,
						...(windowSize === "xs" &&
							windowOrientation === "portrait"
							? { maxWidth: "100%" }
							: { maxWidth: "85%", minWidth: "50%" }),
						// : { maxWidth: "50%", minWidth: "50%" }),
					}}
				>
					{councilIsInTrash(council) && (
						// {true && (
						<StateContainer
							widths={this.state.width}
							heights={this.state.height}
							windowOrientation={windowOrientation}
						>
							<div style={{ width: "410px" }}>
								<TextRender
									title={translate.we_are_sorry}
									text={translate.not_held_council}
									council={council}
									company={company}
									translate={translate}
								/>
							</div>
							<Image
								src={emptyMeetingTable}
								widths={this.state.width}
								windowOrientation={windowOrientation}
								styles={{ marginLeft: "" }}
							>
							</Image>
						</StateContainer>
					)}

					{isAssistance && councilIsLive(council) && (
						<StateContainer
							widths={this.state.width}
							heights={this.state.height}
							windowOrientation={windowOrientation}
						>
							<div>
								<TextRender
									title={translate.we_are_sorry}
									text={'La sala ya ha sido abierta, para entrar necesita usar el email de acceso.'}//TRADUCCION
									isHtmlText={true}
									council={council}
									company={company}
									translate={translate}
									styles={styles}
									windowOrientation={windowOrientation}
								/>
							</div>
							<Image
								src={emptyMeetingTable}
								widths={this.state.width}
								windowOrientation={windowOrientation}
							>
							</Image>
						</StateContainer>
					)}

					{!isAssistance && councilIsNotLiveYet(council) && (
						<StateContainer
							widths={this.state.width}
							heights={this.state.height}
							windowOrientation={windowOrientation}
						>
							<div style={{ width: "410px" }}>
								<TextRender
									title={translate.we_are_sorry}
									text={translate.council_not_started_yet_retry_later}
									isHtmlText={true}
									council={council}
									company={company}
									translate={translate}
								/>
							</div>
							<Image
								src={emptyMeetingTable}
								widths={this.state.width}
								windowOrientation={windowOrientation}
							>
							</Image>
						</StateContainer>
					)}

					{councilIsNotCelebrated(council) && (
						<StateContainer
							widths={this.state.width}
							heights={this.state.height}
							windowOrientation={windowOrientation}
						>
							<div style={{ width: "410px" }}>
								<TextRender
									title={translate.we_are_sorry}
									text={translate.not_held_council}
									council={council}
									company={company}
									translate={translate}
								/>
							</div>
							<Image
								src={emptyMeetingTable}
								widths={this.state.width}
								windowOrientation={windowOrientation}
							>
							</Image>
						</StateContainer>
					)}

					{councilIsFinished(council) && (
						<React.Fragment>
							<StateContainer
								widths={this.state.width}
								heights={this.state.height}
								windowOrientation={windowOrientation}
							>
								<div style={{ width: "410px" }}>
									<TextRender
										title={translate.concil_finished}
										council={council}
										company={company}
										translate={translate}
									/>
									<BasicButton
										text={translate.see_participation}
										color={secondary}
										textStyle={{ color: 'white', fontWeight: '700', marginTop: '0.9em' }}
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
								</div>
								<Image
									src={emptyMeetingTable}
									widths={this.state.width}
									windowOrientation={windowOrientation}
								>
								</Image>
							</StateContainer>
						</React.Fragment>
					)}
				</div>
			</div >
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
			translate,
			styles,
			windowOrientation
		} = this.props;
		const primaryColor = getPrimary();

		return (
			<React.Fragment>
				<h3 style={{ color: primaryColor, marginBottom: windowOrientation === "landscape" ? "" : "1em" }}>{title}</h3>

				{text && (
					<p style={{ marginBottom: "8px", fontSize: '1.1em', marginBottom: windowOrientation === "landscape" ? "" : "2em" }}>
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


				<CouncilInfoCardRender council={council} company={company} windowOrientation={windowOrientation} />

				<TextDialog
					handleClose={this.handleCloseDialog}
					text={council.noCelebrateComment}
					open={this.state.dialogOpen}
				/>
			</React.Fragment>
		);
	}
}

const CouncilInfoCardRender = ({ council, company, windowOrientation }) => (
	<React.Fragment>
		<div
			style={{
				backgroundColor: lightTurquoise,
				borderRadius: "4px"
			}}
		>
			<CardHeader
				// style={{ padding: windowOrientation === "landscape" ? "0px" : "" }}
				// style={{...styles}}
				/* avatar={
					<Avatar
						src={company.logo}
						aria-label="CouncilLogo"
					/>
				} */
				title={
					<div style={{ marginBottom: windowOrientation === "landscape" ? "" : "10px" }}>
						{/* <img src={company.logo} style={{ height: company.logo !== "" ? '2em' : '' }}></img>{company.logo !== "" ? <br /> : ""} */}
						<img src={logoIcon} style={{ height: logoIcon !== "" ? '2em' : '' }}></img>{logoIcon !== "" ? <br /> : ""}
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

const Image = ({ src, widths, windowOrientation, styles }) => (
	<div
		style={{
			width: widths < 690 ? "60%" : "33%",
			minWidth: windowOrientation ? "" : '250px',
			marginLeft: widths < 690 ? (windowOrientation === "landscape" ? "3em" : "") : "6em",
			marginTop: widths < 690 ? (windowOrientation === "landscape" ? "" : "3em") : "",
			...styles
		}}>
		<img
			style={{ width: '100%' }}
			src={src}
		/>
	</div>
);

const StateContainer = ({ widths, windowOrientation, heights, children }) => (
	<div
		style={{
			overflow: "hidden",
			display: widths > 690 ? 'flex' : (windowOrientation === "landscape" ? "flex" : "contents"),
			alignItems: "center",
			margin: (windowOrientation === "landscape" ? "" : "3em"),
			justifyContent: 'space-between',
			fontSize: windowOrientation === "landscape" && heights < 370 ? "10px" : ""
		}}>
		{children}
	</div>
);

export default withTranslations()(
	withWindowOrientation(withWindowSize(CouncilState))
);
