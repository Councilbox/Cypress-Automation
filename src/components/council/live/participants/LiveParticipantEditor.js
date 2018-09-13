import React from "react";
import { compose, graphql } from "react-apollo";
import { liveParticipant, updateParticipantSends } from "../../../../queries";
import { getPrimary, getSecondary } from "../../../../styles/colors";
import {
	Typography,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell
} from "material-ui";
import {
	Grid,
	GridItem,
	LoadingSection,
	ParticipantDisplay,
	RefreshButton
} from "../../../../displayComponents";
import * as CBX from "../../../../utils/CBX";
import ParticipantStateSelector from "./ParticipantStateSelector";
import FontAwesome from "react-fontawesome";
import NotificationsTable from "../../../notifications/NotificationsTable";
import { changeParticipantState } from "../../../../queries/liveParticipant";
import StateIcon from "./StateIcon";
import TypeIcon from "./TypeIcon";
import DownloadCBXDataButton from "../../prepare/DownloadCBXDataButton";
import ResendCredentialsModal from "./modals/ResendCredentialsModal";

class LiveParticipantEditor extends React.Component {
	state = {
		loadingSends: false
	};

	componentDidMount() {
		this.props.data.refetch();
	}

	refreshEmailStates = async () => {
		this.setState({
			loadingSends: true
		});
		const response = await this.props.updateParticipantSends({
			variables: {
				participantId: this.props.data.liveParticipant.id
			}
		});

		if (response.data.updateParticipantSends.success) {
			this.props.data.refetch();
			this.setState({
				loadingSends: false
			});
		}
	};

	removeDelegatedVote = async id => {
		const response = await this.props.changeParticipantState({
			variables: {
				participantId: id,
				state: 0
			}
		});

		if (response) {
			this.props.data.refetch();
		}
	};


	render() {
		const { translate } = this.props;

		if (!this.props.data.liveParticipant) {
			return <LoadingSection />;
		}

		const participant = this.props.data.liveParticipant;
		const secondary = getSecondary();
		const primary = getPrimary();

		return (
			<div style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'flex-start', /* align items in Main Axis */
				alignItems: 'stretch', /* align items in Cross Axis */
				alignContent: 'stretch', /* Extra space in Cross Axis */
				padding: "1em"
			}}>
				<FontAwesome
					name={"times"}
					style={{
						position: "absolute",
						right: "25px",
						top: "2em",
						cursor: "pointer",
						color: secondary,
						fontSize: "2em"
					}}
					onClick={this.props.requestClose}
				/>
				<div style={{ paddingBottom: '0.5em' }}>
					<Grid>
						<GridItem md={1}>
							<TypeIcon
								translate={translate}
								type={participant.type}
								ratio={1.3}
							/>
							<div style={{ marginLeft: '-1.5em', marginTop: '0.5em' }}>
								<DownloadCBXDataButton
									translate={translate}
									participantId={
										participant.participantId
									}
								/>
							</div>
						</GridItem>
						<GridItem md={4}>
							<ParticipantDisplay
								participant={participant}
								translate={translate}
								council={this.props.council}
							/>
						</GridItem>
						<GridItem md={1}>
							<StateIcon
								translate={translate}
								state={participant.state}
								ratio={1.3}
							/>
						</GridItem>
						<GridItem md={6}>
							<Typography variant="body2">
								<b>{`${translate.current_status}:  `}</b>
								<br />
								{
									translate[
									CBX.getParticipantStateField(participant)
									]
								}
								<br />
								<div style={{ marginTop: '0.5em' }}>
									<ParticipantStateSelector
										participant={participant}
										council={this.props.council}
										translate={translate}
										refetch={this.props.data.refetch}
									/>
								</div>
							</Typography>
						</GridItem>
					</Grid>
				</div>
				<div style={{
					flexGrow: 1,
					overflow: 'auto',
					/* for Firefox */
					minHeight: 0,
					paddingRight: '0.5em'
				}}>
					<Grid>
						{(CBX.isRepresented(participant) ||
							CBX.hasHisVoteDelegated(participant)) && (
								<GridItem xs={12} lg={12} md={12}>
									{CBX.isRepresented(participant) && (
										<Typography variant="subheading">
											{translate.represented_by}
										</Typography>
									)}
									{CBX.hasHisVoteDelegated(participant) && (
										<Typography variant="subheading">
											{translate.voting_delegate}
										</Typography>
									)}
									{
										participant.representative &&
										<ParticipantTable
											translate={translate}
											participants={[participant.representative]}
										/>
									}

								</GridItem>
							)}

						{participant.delegatedVotes.length > 0 && (
							<React.Fragment>
								<GridItem xs={12} lg={12} md={12}>
									<Typography variant="subheading">
										{translate.delegated_votes}
									</Typography>
									<ParticipantTable
										translate={translate}
										participants={participant.delegatedVotes}
									/>
								</GridItem>
							</React.Fragment>
						)}

						{participant.notifications.length > 0 && (
							<React.Fragment>
								<GridItem
									xs={12}
									lg={12}
									md={12}
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center"
									}}
								>
									<Typography
										variant="subheading"
										style={{
											marginRight: "1em",
										}}
									>
										{translate.sends}
									</Typography>
									<RefreshButton
										tooltip={translate.refresh_emails}
										loading={this.state.loadingSends}
										onClick={this.refreshEmailStates}
									/>
									<ResendCredentialsModal
										participant={participant}
										council={this.props.council}
										translate={translate}
										refetch={this.props.data.refetch}
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
				</div>
			</div>
		);
	}
}

const ParticipantTable = ({ participants, translate }) => (
	<Table style={{ maxWidth: "100%", width: "100%" }}>
		<TableHead>
			<TableRow>
				<TableCell style={{ padding: "0.2em" }}>
					{translate.name}
				</TableCell>
				<TableCell style={{ padding: "0.2em" }}>{translate.dni}</TableCell>
				<TableCell style={{ padding: "0.2em" }}>{translate.position}</TableCell>
				<TableCell style={{ padding: "0.2em" }}>{translate.votes}</TableCell>
			</TableRow>
		</TableHead>
		<TableBody>
			{participants.map((participant, index) => (
				<TableRow key={`part_${index}`}>
					<TableCell style={{ padding: "0.2em" }}>
						{`${participant.name} ${participant.surname}`}
					</TableCell>
					<TableCell style={{ padding: "0.2em" }}>{`${participant.dni}`}</TableCell>
					<TableCell style={{ padding: "0.2em" }}>{`${participant.position}`}</TableCell>
					<TableCell style={{ padding: "0.2em" }}>{`${participant.numParticipations}`}</TableCell>
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
	graphql(changeParticipantState, {
		name: "changeParticipantState"
	}),
	graphql(updateParticipantSends, {
		name: "updateParticipantSends"
	}),
)(LiveParticipantEditor);
