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
		loadingRefresh: false,
		showCommentModal: false,
		showComment: '',
		appliedFilters: {
			limit: PARTICIPANTS_LIMITS[0],
			text: 0,
			field: 'fullName',
			page: 1,
			notificationStatus: null,
			orderBy: 'name',
			orderDirection: 'asc'
		}
	};

	componentDidMount(){
		this.refreshEmailStates();
	}

	static getDerivedStateFromProps(nextProps, prevState){
		if(!nextProps.data.loading){
			const councilParticipants = nextProps.data.councilParticipantsWithNotifications;
			const filteredParticipants = applyFilters(councilParticipants? councilParticipants.list : [], prevState.appliedFilters)
			const offset = (prevState.appliedFilters.page - 1) * prevState.appliedFilters.limit;
			let paginatedParticipants = filteredParticipants.slice(offset, offset + prevState.appliedFilters.limit);
			return {
				participants: paginatedParticipants,
				total: filteredParticipants.length
			}
		}

		return null;
	}

	updateFilteredParticipants = appliedFilters => {
		const councilParticipants = this.props.data.councilParticipantsWithNotifications;
		const filteredParticipants = applyFilters(councilParticipants? councilParticipants.list : [], appliedFilters)
		const offset = (appliedFilters.page - 1) * appliedFilters.limit;
		let paginatedParticipants = filteredParticipants.slice(offset, offset + appliedFilters.limit);
		return {
			participants: paginatedParticipants,
			total: filteredParticipants.length
		}
	}

	closeParticipantEditor = () => {
		this.props.refetch();
		this.setState({ editingParticipant: false });
	};

	refresh = object => {
		this.table.refresh(object);
	};

	resetPage = () => {
		this.table.setPage(this.state.appliedFilters.page);
	}

	showModalComment = comment => event => {
		event.stopPropagation();
		this.setState({
			showCommentModal: true,
			showComment: comment
		})
	}

	updateFilters = value => {
		const appliedFilters =  {
			...this.state.appliedFilters,
			text: value.filters[0]? value.filters[0].text : '',
			field: value.filters[0]? value.filters[0].field : '',
			page: (value.options.offset / value.options.limit) + 1,
			limit: value.options.limit,
			orderBy: value.options.orderBy,
			orderDirection: value.options.orderDirection
		}

		const filteredParticipants = this.updateFilteredParticipants(appliedFilters);

		this.setState({
			appliedFilters,
			participants: filteredParticipants.participants,
			total: filteredParticipants.total
		}, () => this.resetPage());
	}

	updateNotificationFilter = value => {
		const appliedFilters = {
			...this.state.appliedFilters,
			notificationStatus: value.notificationStatus,
			page: 1
		}

		const filteredParticipants = this.updateFilteredParticipants(appliedFilters);

		this.setState({
			appliedFilters,
			participants: filteredParticipants.participants,
			total: filteredParticipants.total
		}, () => this.resetPage());
	}

	refreshEmailStates = async () => {
		this.setState({
			loadingRefresh: true
		});
		const response = await this.props.updateConveneSends({
			variables: {
				councilId: this.props.council.id
			}
		});

		if (response.data.updateConveneSends.success) {
			await this.props.data.refetch();
			this.setState({
				loadingRefresh: false
			});
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

		console.log(this.state.participants);

		headers.push({text: ''});
		return (
			<div style={{ width: "100%", height: '100%' }}>
				<React.Fragment>
					<Grid style={{ margin: "0.5em 0" }}>
						<GridItem xs={12} lg={6} md={6}>
							{!hideNotifications &&
								<NotificationFilters
									translate={translate}
									refetch={this.updateNotificationFilter}
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
													loading={this.state.loadingRefresh}
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
							page={this.state.appliedFilters.page}
							loading={loading}
							length={this.state.participants.length}
							total={this.state.total}
							refetch={this.updateFilters}
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
							{this.state.participants.map(
								item => {
									let participant = formatParticipant(item);
									return (
										<React.Fragment
											key={`participant${participant.id}_${this.state.appliedFilters.notificationStatus}`}
										>
											<HoverableRow
												translate={translate}
												participant={participant}
												representative={participant.representative}
												showModalComment={this.showModalComment}
												cbxData={false}
												editParticipant={() => {
													!this.props.cantEdit &&
														this.setState({
															editingParticipant: true,
															participant
														})
												}}
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
					{editingParticipant &&
						<ConvenedParticipantEditor
							key={participant.id}
							translate={translate}
							close={this.closeParticipantEditor}
							councilId={council.id}
							participations={participations}
							participant={participant}
							opened={editingParticipant}
							refetch={refetch}
						/>
					}
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

		console.log(representative);

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
							{!CBX.isRepresentative(participant)?
								`${
									participant.numParticipations
								} (${participant.numParticipations > 0?(
									(participant.numParticipations /
										totalVotes) *
									100
								).toFixed(2) : 0}%)`
							:
								`${
									participant.representing.numParticipations
								} (${participant.representing.numParticipations > 0?(
									(participant.representing.numParticipations /
										totalVotes) *
									100
								).toFixed(2) : 0}%)`
							}
                        </GridItem>
						{this.props.participations && (
							<React.Fragment>
								<GridItem xs={4} md={4} style={{fontWeight: '700'}}>
									{translate.census_type_social_capital}
								</GridItem>
								<GridItem xs={7} md={7}>
									{!CBX.isRepresentative(participant) &&
										`${participant.socialCapital} (${participant.socialCapital > 0?(
										(participant.socialCapital /
											socialCapital) *
										100).toFixed(2): 0}%)`
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
					} (${participant.numParticipations > 0?(
						(participant.numParticipations /
							totalVotes) *
						100
					).toFixed(2) : 0}%)`}
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
						} (${participant.socialCapital > 0?
							((participant.socialCapital / socialCapital) * 100).toFixed(2)
						:
							0
						}%)`}
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
							{participant.notifications
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
							)}
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

const formatParticipant = participant => {
	let { representing, ...newParticipant } = participant;
	if(representing && representing.type === 3){
		let { representative, ...rest } = newParticipant;
		newParticipant = {
			...representing,
			notifications: rest.notifications,
			representative: rest
		}
	}
	return newParticipant;
}

const applyFilters = (participants, filters) => {

	return applyOrder(participants.filter(item => {
		const participant = formatParticipant(item);
		if(filters.text){
			const unaccentedText = CBX.unaccent(filters.text.toLowerCase());

			if(filters.field === 'fullName'){
				const fullName = `${participant.name} ${participant.surname}`;
				let repreName = '';
				if(participant.representative){
					repreName = `${participant.representative.name} ${participant.representative.surname}`;
				}
				if(!CBX.unaccent(fullName.toLowerCase()).includes(unaccentedText)
					&& !CBX.unaccent(repreName.toLowerCase()).includes(unaccentedText)){
					return false;
				}
			}

			if(filters.field === 'position'){
				if(participant.representative){
					if(!CBX.unaccent(participant.position.toLowerCase()).includes(unaccentedText) &&
						!CBX.unaccent(participant.representative.position.toLowerCase()).includes(unaccentedText)){
						return false;
					}
				} else {
					if(!CBX.unaccent(participant.position.toLowerCase()).includes(unaccentedText)){
						return false;
					}
				}
			}

			if(filters.field === 'dni'){
				if(participant.representative){
					if(!CBX.unaccent(participant.dni.toLowerCase()).includes(unaccentedText) &&
						!CBX.unaccent(participant.representative.dni.toLowerCase()).includes(unaccentedText)){
						return false;
					}
				} else {
					if(!CBX.unaccent(participant.dni.toLowerCase()).includes(unaccentedText)){
						return false;
					}
				}
			}
		}

		if(filters.notificationStatus){
			if(participant.representative){
				if(participant.representative.notifications[0].reqCode !== filters.notificationStatus){
					return false;
				}
			} else {
				if(participant.notifications[0].reqCode !== filters.notificationStatus){
					return false;
				}
			}
		}

		return true;
	}), filters.orderBy, filters.orderDirection);
}

const applyOrder = (participants, orderBy, orderDirection) => {
	return participants.sort((a, b) => {
		let participantA = formatParticipant(a);
		let participantB = formatParticipant(b);
		return participantA[orderBy] > participantB[orderBy]
	});
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
			},
			forceFetch: true,
			pollInterval: 8000
		})
	})
)(ConvenedParticipantsTable);
