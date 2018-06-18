import React, { Component } from "react";
import { compose, graphql } from "react-apollo";
import {
	liveParticipant,
	updateLiveParticipant,
	updateLiveParticipantSends
} from "../../../../queries";
import { getPrimary, getSecondary } from "../../../../styles/colors";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
	Card
} from "material-ui";
import {
	BasicButton,
	Icon,
	CloseIcon,
	Grid,
	GridItem,
	LoadingSection,
	FilterButton,
	ParticipantDisplay,
	RefreshButton
} from "../../../../displayComponents";
import * as CBX from "../../../../utils/CBX";
import ParticipantStateSelector from "./ParticipantStateSelector";
import moment from "moment";
import FontAwesome from "react-fontawesome";

class LiveParticipantEditor extends Component {
	refreshEmailStates = async () => {
		this.setState({
			loadingSends: true
		});
		const response = await this.props.updateLiveParticipantSends({
			variables: {
				participantId: this.props.data.liveParticipant.id
			}
		});

		if (response.data.updateLiveParticipantSends.success) {
			this.props.data.refetch();
			this.setState({
				loadingSends: false
			});
		}
	};
	
	removeDelegatedVote = async id => {
		const response = await this.props.updateLiveParticipant({
			variables: {
				participant: {
					id: id,
					state: 0,
					delegateId: null,
					councilId: this.props.council.id
				}
			}
		});

		if (response) {
			this.props.data.refetch();
		}
	};

	constructor(props) {
		super(props);
		this.state = {
			loadingSends: false
		};
	}

	componentDidMount() {
		this.props.data.refetch();
	}

	render() {
		const { translate } = this.props;

		if (this.props.data.loading) {
			return <LoadingSection />;
		}

		const participant = this.props.data.liveParticipant;
		const secondary = getSecondary();
		const primary = getPrimary();

		return (
			<Grid
				style={{
					padding: "2em",
					position: "relative",
					minHeight: "60%"
				}}
			>
				<FontAwesome
					name={"times"}
					style={{
						position: "absolute",
						right: "25px",
						top: "20px",
						cursor: "pointer",
						color: secondary,
						fontSize: "2em"
					}}
					onClick={this.props.requestClose}
				/>
				<GridItem
					xs={6}
					lg={6}
					md={6}
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center"
					}}
				>
					<div style={{ width: "4em" }}>
						<FontAwesome
							name={"info-circle"}
							style={{
								color: secondary,
								fontSize: "2.2em",
								marginRight: "1.2em"
							}}
						/>
					</div>
					<ParticipantDisplay
						participant={participant}
						translate={translate}
						council={this.props.council}
					/>
				</GridItem>
				<GridItem
					xs={6}
					lg={6}
					md={6}
					style={{ display: "flex", flexDirection: "column" }}
				>
					<Typography variant="body2">
						<div style={{ fontWeight: "700" }}>
							{`${translate.current_status}:  `}
						</div>
						{translate[CBX.getParticipantStateField(participant)]}
					</Typography>
					<ParticipantStateSelector
						participant={participant}
						council={this.props.council}
						translate={translate}
						refetch={this.props.data.refetch}
					/>
				</GridItem>
				{CBX.isRepresented(participant) && (
					<div style={{ marginTop: "1.2em", marginBottom: "0.4" }}>
						{translate.represented_by}
						<GridItem
							xs={12}
							lg={12}
							md={12}
							style={{ display: "flex", flexDirection: "row" }}
						>
							<Tooltip title={translate.represented_by}>
								<div
									style={{
										position: "relative",
										width: "4em",
										display: "flex",
										alignItems: "center"
									}}
								>
									<FontAwesome
										name={"user-o"}
										style={{
											color: secondary,
											fontSize: `2.2em`
										}}
									/>
									<FontAwesome
										name={"user"}
										style={{
											color: primary,
											fontSize: `1.5em`,
											position: "absolute",
											top: "0.5em",
											right: "1.2em"
										}}
									/>
								</div>
							</Tooltip>
							<div
								style={{
									display: "flex",
									flexDirection: "column"
								}}
							>
								<ParticipantDisplay
									participant={participant.representative}
									translate={translate}
									delegate={true}
									council={this.props.council}
								/>
							</div>
						</GridItem>
					</div>
				)}

				{CBX.hasHisVoteDelegated(participant) && (
					<div style={{ marginTop: "1.2em", marginBottom: "0.4" }}>
						{translate.voting_delegate}
						<GridItem
							xs={12}
							lg={12}
							md={12}
							style={{ display: "flex", flexDirection: "row" }}
						>
							<Tooltip title={translate.voting_delegate}>
								<div
									style={{
										position: "relative",
										width: "4em",
										display: "flex",
										alignItems: "center"
									}}
								>
									<FontAwesome
										name={"user"}
										style={{
											color: secondary,
											fontSize: `2.2em`
										}}
									/>
									<FontAwesome
										name={"user"}
										style={{
											color: primary,
											fontSize: `1.5em`,
											position: "absolute",
											top: "0.5em",
											right: "1.2em"
										}}
									/>
								</div>
							</Tooltip>
							<div
								style={{
									display: "flex",
									flexDirection: "column"
								}}
							>
								<ParticipantDisplay
									participant={participant.representative}
									translate={translate}
									delegate={true}
									council={this.props.council}
								/>
							</div>
						</GridItem>
					</div>
				)}

				{participant.delegatedVotes.length > 0 && (
					<React.Fragment>
						<GridItem
							xs={12}
							lg={12}
							md={12}
							style={{
								display: "flex",
								flexDirection: "row",
								marginTop: "1.2em"
							}}
						>
							{translate.delegated_votes}
						</GridItem>
						{participant.delegatedVotes.map(participant => (
							<GridItem
								xs={12}
								md={6}
								lg={6}
								key={`delegateVote_${participant.id}`}
							>
								<ParticipantDisplay
									participant={participant}
									translate={translate}
									council={this.props.council}
								/>
							</GridItem>
						))}
					</React.Fragment>
				)}
				{participant.notifications.length > 0 && (
					<React.Fragment>
						<GridItem
							xs={12}
							lg={12}
							md={12}
							style={{
								marginTop: "1.7em",
								display: "flex",
								flexDirection: "row",
								alignItems: "center"
							}}
						>
							<Typography
								variant="subheading"
								style={{ marginRight: "1.6em" }}
							>
								{translate.sends}
							</Typography>
							<RefreshButton
								tooltip={translate.refresh_emails}
								loading={this.state.loadingSends}
								onClick={this.refreshEmailStates}
							/>
						</GridItem>
						<GridItem xs={12} lg={12} md={12}>
							<NotificationsTable
								notifications={participant.notifications}
								translate={translate}
							/>
						</GridItem>
					</React.Fragment>
				)}
			</Grid>
		);
	}
}

const DelegatedTable = ({
	participants = [],
	translate,
	council,
	removeDelegatedVote
}) =>
	participants.map(participant => (
		<React.Fragment>
			<ParticipantDisplay
				participant={participant}
				translate={translate}
				council={council}
			/>
		</React.Fragment>
	));

const NotificationsTable = ({ notifications, translate }) => (
	<Table>
		<TableHead>
			<TableRow>
				<TableCell>{translate.current_status}</TableCell>
				<TableCell>{translate.send_type}</TableCell>
				<TableCell>{translate.send_date}</TableCell>
				<TableCell>{translate.last_date_updated}</TableCell>
			</TableRow>
		</TableHead>
		<TableBody>
			{notifications.map((notification, index) => (
				<TableRow key={`notification_${index}`}>
					<TableCell>
						<Tooltip
							title={
								translate[
								CBX.getTranslationReqCode(
									notification.reqCode
								)
								]
							}
						>
							<img
								style={{
									height: "2.1em",
									width: "auto"
								}}
								src={CBX.getEmailIconByReqCode(
									notification.reqCode
								)}
								alt="email-state-icon"
							/>
						</Tooltip>
					</TableCell>
					<TableCell>
						{translate[CBX.getSendType(notification.sendType)]}
					</TableCell>
					<TableCell>
						{moment(notification.sendDate).isValid()
							? moment(notification.sendDate).format("LLL")
							: "-"}
					</TableCell>
					<TableCell>
						{moment(notification.refreshDate).isValid()
							? moment(notification.refreshDate).format("LLL")
							: "-"}
					</TableCell>
				</TableRow>
			))}
		</TableBody>
	</Table>
);

export default compose(
	graphql(liveParticipant, {
		options: props => ({
			variables: {
				participantId: props.id
			},
			notifyOnNetworkStatusChange: true
		})
	}),
	graphql(updateLiveParticipant, {
		name: "updateLiveParticipant"
	}),
	graphql(updateLiveParticipantSends, {
		name: "updateLiveParticipantSends"
	})
)(LiveParticipantEditor);
