import React from "react";
import { Card, CardHeader, Avatar, CardContent } from "material-ui";
import moment from "moment";
import withTranslations from "../../../HOCs/withTranslations";
import withWindowSize from "../../../HOCs/withWindowSize";
import withWindowOrientation from "../../../HOCs/withWindowOrientation";
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
	lightTurquoise
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
							? {}
							: { maxWidth: "50%" })
					}}
				>
					{councilIsInTrash(council) && (
						<TextRender
							title={translate.we_are_sorry}
							text={translate.not_held_council}
							council={council}
							company={company}
						/>
					)}

					{councilIsNotLiveYet(council) && (
						<TextRender
							title={translate.we_are_sorry}
							text={translate.council_not_started_yet_retry_later}
							isHtmlText={true}
							council={council}
							company={company}
						/>
					)}

					{councilIsNotCelebrated(council) && (
						<TextRender
							title={translate.we_are_sorry}
							text={translate.not_held_council}
							council={council}
							company={company}
						/>
					)}

					{councilIsFinished(council) && (
						<TextRender
							title={translate.we_are_sorry}
							text={translate.concil_finished}
							council={council}
							company={company}
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
	render() {
		const {
			title,
			text,
			isHtmlText,
			hasCouncilInfo,
			council,
			company
		} = this.props;
		const primaryColor = getPrimary();
		return (
			<React.Fragment>
				<h3 style={{ color: primaryColor }}>{title}</h3>

				<p>
					{isHtmlText ? (
						<span dangerouslySetInnerHTML={{ __html: text }} />
					) : (
						text
					)}
				</p>

				<CouncilInfoCardRender council={council} company={company} />
			</React.Fragment>
		);
	}
}

class CouncilInfoCardRender extends React.PureComponent {
	render() {
		const { council, company } = this.props;
		return (
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
						title={council.name}
						subheader={moment(new Date(council.dateStart)).format(
							"LLL"
						)}
						style={{ paddingBottom: "0px" }}
					/>
					<CardContent style={{ paddingBottom: "16px" }}>
						<p
							dangerouslySetInnerHTML={{
								__html: council.conveneText
							}}
						/>
					</CardContent>
				</div>
			</React.Fragment>
		);
	}
}

export default withTranslations()(
	withWindowOrientation(withWindowSize(CouncilState))
);
