import React from "react";
import { TableCell, TableRow } from "material-ui/Table";
import { Tooltip, Card } from "material-ui";
import { getSecondary } from "../../../styles/colors";
import * as CBX from "../../../utils/CBX";
import {
	BasicButton,
	ButtonIcon,
	LoadingSection,
	EnhancedTable,
	Grid,
	GridItem
} from "../../../displayComponents";
import { compose, graphql } from "react-apollo";
import { downloadCBXData, updateConveneSends } from "../../../queries";
import { convenedcouncilParticipants } from "../../../queries/councilParticipant";
import { PARTICIPANTS_LIMITS, PARTICIPANT_STATES } from "../../../constants";
import NotificationFilters from "./NotificationFilters";
import DownloadCBXDataButton from "./DownloadCBXDataButton";
import AddConvenedParticipantButton from "./modals/AddConvenedParticipantButton";
import ConvenedParticipantEditor from "./modals/ConvenedParticipantEditor";
import AttendIntentionIcon from "../live/participants/AttendIntentionIcon";
import AttendComment from "./modals/AttendComment";
import { isMobile } from 'react-device-detect';


class ConvenedParticipantsTable extends React.Component {

	state = {
		editingParticipant: false,
		participant: {},
		activeStatusFilter: "",
		showCommentModal: false,
		showComment: ''
	};

	closeParticipantEditor = () => {
		this.setState({ editingParticipant: false });
	};

	refresh = object => {
		this.table.refresh(object);
	};

	showModalComment = comment => event => {
		event.stopPropagation();
		this.setState({
			showCommentModal: true,
			showComment: comment
		})
	}

	refreshEmailStates = async () => {
		const response = await this.props.updateConveneSends({
			variables: {
				councilId: this.props.council.id
			}
		});

		if (response.data.updateConveneSends.success) {
			this.table.refresh();
		}
	};

	render() {
		const { translate, council, participations, hideNotifications, hideAddParticipant } = this.props;
		const { loading, refetch } = this.props.data;
		const councilParticipants = this.props.data.councilParticipantsWithNotifications;
		const { participant, editingParticipant } = this.state;

		let headers = [
			{
				text: translate.name,
				name: "name",
				canOrder: true
			},
			{
				text: translate.dni,
				name: "dni",
				canOrder: true
			},
			{ text: translate.position },
			{
				text: translate.votes,
				name: "numParticipations",
				canOrder: true
			}
		];

		if (participations) {
			headers.push({
				text: translate.census_type_social_capital,
				name: "socialCapital",
				canOrder: true
			});
		}

		if (CBX.councilIsNotified(council)) {
			if (!hideNotifications) {
				headers.push({
					text: translate.convene
				});
				if (CBX.councilHasAssistanceConfirmation(council)) {
					headers.push({
						text: translate.assistance_intention
					});
				}
			}
		}

		headers.push({text: ''});

		return (
			<div style={{ width: "100%", height: '100%' }}>
				<React.Fragment>
					<Grid style={{ margin: "0.5em 0" }}>
						<GridItem xs={12} lg={6} md={6}>
							{!hideNotifications &&
								<NotificationFilters
									translate={translate}
									refetch={this.refresh}
								/>
							}
						</GridItem>
					</Grid>
					{!!councilParticipants?
						<EnhancedTable
							ref={table => (this.table = table)}
							translate={translate}
							menuButtons={
								<div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '0.3em'}}>
									{!hideNotifications &&
										<Tooltip
											title={
												translate.tooltip_refresh_convene_email_state_assistance
											}
										>
											<div>
												<BasicButton
													floatRight
													text={translate.refresh_convened}
													color={getSecondary()}
													buttonStyle={{
														margin: "0",
														marginRight: '1.2em'
													}}
													textStyle={{
														color: "white",
														fontWeight: "700",
														fontSize: "0.9em",
														textTransform: "none"
													}}
													icon={
														<ButtonIcon
															color="white"
															type="refresh"
														/>
													}
													textPosition="after"
													onClick={() =>
														this.refreshEmailStates()
													}
												/>
											</div>
										</Tooltip>
									}
									{!hideAddParticipant &&
										<div>
											<AddConvenedParticipantButton
												participations={participations}
												translate={translate}
												councilId={council.id}
												refetch={refetch}
											/>
										</div>
									}
								</div>
							}
							defaultLimit={PARTICIPANTS_LIMITS[0]}
							defaultFilter={"fullName"}
							defaultOrder={["name", "asc"]}
							limits={PARTICIPANTS_LIMITS}
							page={1}
							loading={loading}
							length={councilParticipants.list.length}
							total={councilParticipants.total}
							refetch={this.props.data.refetch}
							action={this._renderDeleteIcon}
							fields={[
								{
									value: "fullName",
									translation: translate.participant_data
								},
								{
									value: "dni",
									translation: translate.dni
								},
								{
									value: "position",
									translation: translate.position
								}
							]}
							headers={headers}
						>
							{councilParticipants.list.map(
								(participant, index) => {
									return (
										<React.Fragment
											key={`participant${participant.id}`}
										>
											<HoverableRow
												translate={translate}
												participant={participant}
												representative={participant.representative}
												showModalComment={this.showModalComment}
												cbxData={false}
												editParticipant={() =>
													!this.props.cantEdit &&
														this.setState({
															editingParticipant: true,
															participant: participant
														})
												}
												{...this.props}
											/>
										</React.Fragment>
									);
								}
							)}
						</EnhancedTable>
					:
						<div
							style={{
								height: '10em',
								display: 'flex',
								alignItems: 'center'
							}}
						>
							<LoadingSection/>
						</div>
					}
					<ConvenedParticipantEditor
						translate={translate}
						close={this.closeParticipantEditor}
						councilId={council.id}
						participations={participations}
						participant={participant}
						opened={editingParticipant}
						refetch={refetch}
					/>
					<AttendComment
					 	requestClose={() => this.setState({
							showCommentModal: false,
							showComment: false
						})}
						open={this.state.showCommentModal}
						comment={this.state.showComment}
						translate={translate}
					/>
				</React.Fragment>
				{this.props.children}
			</div>
		);
	}
}

class HoverableRow extends React.Component {

	state = {
		showActions: false
	}

	mouseEnterHandler = () => {
		this.setState({
			showActions: true
		});
	}

	mouseLeaveHandler = () => {
		this.setState({
			showActions: false
		});
	}

	render() {
		const { translate, participant, hideNotifications, totalVotes, socialCapital, council, editParticipant } = this.props;

		let representative = this.props.representative;

		if(participant.live && participant.live.representative){
			representative = participant.live.representative;
		}

		if(isMobile){
            return(
                <Card
                    style={{marginBottom: '0.5em', padding: '0.3em', position: 'relative'}}
                    onClick={editParticipant}
                >
                    <Grid>
                        <GridItem xs={4} md={4} style={{fontWeight: '700'}}>
                            {translate.participant_data}
                        </GridItem>
                        <GridItem xs={7} md={7}>
							<span style={{fontWeight: '700'}}>{`${participant.name} ${participant.surname}`}</span>
							{!!representative &&
								<React.Fragment>
									<br />
									{`${this.props.translate.represented_by}: ${representative.name} ${representative.surname}`}
								</React.Fragment>
							}
                        </GridItem>
						<GridItem xs={4} md={4} style={{fontWeight: '700'}}>
                            {translate.dni}
                        </GridItem>
                        <GridItem xs={7} md={7}>
							{!!representative?
								<React.Fragment>
									{representative.dni}
								</React.Fragment>
							:
								participant.dni
							}
                        </GridItem>
						<GridItem xs={4} md={4} style={{fontWeight: '700'}}>
                            {translate.position}
                        </GridItem>
                        <GridItem xs={7} md={7}>
							{!!representative?
								<React.Fragment>
									{representative.position}
								</React.Fragment>
							:
								participant.position
							}
                        </GridItem>
						<GridItem xs={4} md={4} style={{fontWeight: '700'}}>
                            {translate.votes}
                        </GridItem>
                        <GridItem xs={7} md={7}>
							{!CBX.isRepresentative(participant) &&
								`${
									participant.numParticipations
								} (${(
									(participant.numParticipations /
										totalVotes) *
									100
								).toFixed(2)}%)`
							}
                        </GridItem>
						{this.props.participations && (
							<React.Fragment>
								<GridItem xs={4} md={4} style={{fontWeight: '700'}}>
									{translate.census_type_social_capital}
								</GridItem>
								<GridItem xs={7} md={7}>
									{!CBX.isRepresentative(participant) &&
										`${participant.socialCapital} (${(
										(participant.socialCapital /
											socialCapital) *
										100).toFixed(2)}%)`
									}

								</GridItem>
							</React.Fragment>
						)}
                    </Grid>
                    <div style={{position: 'absolute', top: '5px', right: '5px'}}>
						<DownloadCBXDataButton
							translate={translate}
							participantId={participant.live.id}
						/>
                    </div>
                </Card>
            )
		}

		return (
			<TableRow
				hover
				onMouseOver={this.mouseEnterHandler}
				onMouseLeave={this.mouseLeaveHandler}
				onClick={editParticipant}
				style={{
					cursor: "pointer"
				}}
			>
				<TableCell>
					<span style={{fontWeight: '700'}}>{`${participant.name} ${
						participant.surname
					}`}</span>
					{!!representative &&
						<React.Fragment>
							<br/>
							{`${participant.live.state === PARTICIPANT_STATES.DELEGATED? translate.delegated_in : this.props.translate.represented_by}: ${representative.name} ${representative.surname}`}
						</React.Fragment>
					}
				</TableCell>
				<TableCell>
					{participant.dni}
					{!!representative &&
						<React.Fragment>
							<br/>
							{representative.dni}
						</React.Fragment>
					}
				</TableCell>
				<TableCell>
					{participant.position}
					{!!representative &&
						<React.Fragment>
							<br/>
							{representative.position}
						</React.Fragment>
					}
				</TableCell>
				<TableCell>
					{`${
						participant.numParticipations
					} (${(
						(participant.numParticipations /
							totalVotes) *
						100
					).toFixed(2)}%)`}
					{!!representative &&
						<React.Fragment>
							<br/>
						</React.Fragment>
					}
				</TableCell>
				{this.props.participations && (
					<TableCell>
						{`${
							participant.socialCapital
						} (${(
							(participant.socialCapital /
								socialCapital) *
							100
						).toFixed(2)}%)`}
						{!!representative &&
							<React.Fragment>
								<br/>
							</React.Fragment>
						}
					</TableCell>
				)}

				{this.props.cbxData &&
					<TableCell>
						<div style={{width: '4em'}}>
							{this.state.showActions &&
								<DownloadCBXDataButton
									translate={translate}
									participantId={participant.live.id}
								/>
							}
						</div>
					</TableCell>

				}

				{!hideNotifications &&
					<React.Fragment>
						<TableCell>
							{!!representative?
								participant.representative.notifications
									.length > 0 ? (
									<Tooltip
										title={
											translate[
												CBX.getTranslationReqCode(
													participant.representative
														.notifications[0]
														.reqCode
												)
											]
										}
									>
										<img
											style={{
												height:
													"2.1em",
												width:
													"auto"
											}}
											src={CBX.getEmailIconByReqCode(
												participant.representative
													.notifications[0]
													.reqCode
											)}
											alt="email-state-icon"
										/>
									</Tooltip>
								) : (
									""
								)

							:
								participant.notifications
									.length > 0 ? (
									<Tooltip
										title={
											translate[
												CBX.getTranslationReqCode(
													participant
														.notifications[0]
														.reqCode
												)
											]
										}
									>
										<img
											style={{
												height:
													"2.1em",
												width:
													"auto"
											}}
											src={CBX.getEmailIconByReqCode(
												participant
													.notifications[0]
													.reqCode
											)}
											alt="email-state-icon"
										/>
									</Tooltip>
								) : (
									""
								)
							}
						</TableCell>
						{CBX.councilHasAssistanceConfirmation(
							council
						) && (
							<TableCell>
								<AttendIntentionIcon
									participant={participant.live.state === PARTICIPANT_STATES.REPRESENTATED? participant.representative.live : participant.live}
									showCommentIcon
									onCommentClick={this.props.showModalComment({
										text: participant.live.state === PARTICIPANT_STATES.REPRESENTATED? participant.representative.live.assistanceComment : participant.live.assistanceComment,
										author: participant.live.state === PARTICIPANT_STATES.REPRESENTATED?
											`${participant.name} ${participant.surname} - ${translate.represented_by} ${representative.name} ${representative.surname}`
										:
											`${participant.name} ${participant.surname}`
									})}
									translate={translate}
									size="2em"
								/>
							</TableCell>
						)}
					</React.Fragment>
				}
			</TableRow>
		)
	}
}

export default compose(
	graphql(updateConveneSends, {
		name: "updateConveneSends"
	}),
	graphql(downloadCBXData, {
		name: "downloadCBXData"
	}),
	graphql(convenedcouncilParticipants, {
		options: props => ({
			variables: {
				councilId: props.council.id,
				options: {
					limit: PARTICIPANTS_LIMITS[0],
					offset: 0
				}
			},
			forceFetch: true
		})
	})
)(ConvenedParticipantsTable);
