import React from 'react';
import { agendaVotings } from "../../../../queries/agenda";
import { graphql } from 'react-apollo';
import { VOTE_VALUES, AGENDA_TYPES, PARTICIPANT_STATES } from "../../../../constants";
import { TableRow, TableCell } from "material-ui";
import { getPrimary, getSecondary } from "../../../../styles/colors";
import {
	LoadingSection,
	PaginationFooter,
	Icon,
	FilterButton,
	TextInput,
	Grid,
	Table,
	GridItem
} from "../../../../displayComponents";
import FontAwesome from "react-fontawesome";
import VotingValueIcon from "./VotingValueIcon";
import PresentVoteMenu from "./PresentVoteMenu";
import { Tooltip, Card } from "material-ui";
import { isPresentVote, agendaVotingsOpened } from "../../../../utils/CBX";
import { isMobile } from 'react-device-detect';


class VotingsTable extends React.Component {

  state = {
		open: false,
		voteFilter: "all",
		stateFilter: "all",
		filterText: "",
		page: 1,
		agendaId: this.props.agenda.id
	};

    static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.agenda.id !== prevState.agendaId) {
			return {
				open: false,
				voteFilter: "all",
				stateFilter: "all",
				filterText: "",
				agendaId: nextProps.agenda.id
			};
		}
		return {
			...nextProps.state
		}
	}

    getTooltip = vote => {
		switch (vote) {
			case VOTE_VALUES.NO_VOTE:
				return this.props.translate.no_vote;
			case VOTE_VALUES.NEGATIVE:
				return this.props.translate.against_btn;
			case VOTE_VALUES.POSITIVE:
				return this.props.translate.in_favor_btn;
			case VOTE_VALUES.ABSTENTION:
				return this.props.translate.abstention;
			default:
				return "-";
		}
	};

	getStateIcon = vote => {
		const primary = getPrimary();

		switch (vote) {
			case 1:
				return (
					<FontAwesome
						name={"user"}
						color={primary}
						style={{
							margin: "0.5em",
							color: getSecondary(),
							fontSize: "1.1em"
						}}
					/>
				);

			case 0:
				return (
					<FontAwesome
						name={"globe"}
						color={primary}
						style={{
							margin: "0.5em",
							color: getSecondary(),
							fontSize: "1.1em"
						}}
					/>
				);

			default:
				return <div> </div>;
		}
	};

 	refreshTable = async () => {
		//const variables = this.buildVariables();
		await this.props.data.refetch();
	};


    render(){
		const { translate } = this.props;
		let mappedVotings = [];

		if(this.props.data.agendaVotings){
			if(this.props.data.agendaVotings.list.length > 0){
				this.props.data.agendaVotings.list.forEach(voting => {
					if(voting.authorRepresentative){
						const sameRepresentative = mappedVotings.findIndex(vote => vote.delegateId === voting.delegateId || vote.participantId === voting.delegateId);
						if(sameRepresentative !== -1){
							if(voting.author.state === PARTICIPANT_STATES.REPRESENTATED){
								mappedVotings[sameRepresentative].representing = [voting];
							} else {
								mappedVotings[sameRepresentative].delegatedVotes = !!mappedVotings[sameRepresentative].delegatedVotes?
									[...mappedVotings[sameRepresentative].delegatedVotes, voting]
								:
									[voting];
							}
						} else {
							if(voting.author.state === PARTICIPANT_STATES.REPRESENTATED){
								mappedVotings.push({...voting, author: voting.authorRepresentative, representing: [voting]});
							} else {
								mappedVotings.push({...voting, author: voting.authorRepresentative, delegatedVotes: [voting]});
							}
						}
					} else {
						const authorAlreadyInList = mappedVotings.findIndex(vote => vote.author.id === voting.participantId);
						if(authorAlreadyInList === -1) {
							mappedVotings.push({...voting, delegatedVotes: []});
						}
					}
				})
			}
		}

		const offset = (this.props.page - 1) * this.props.pageLimit;
		const slicedVotings = mappedVotings.slice(offset, offset + this.props.pageLimit);

		return (
			<Grid
				style={{
					width: "100%",
					padding: "1em",
					paddingTop: 0,
					backgroundColor: "white",
					bottomLeftBorderRadius: "5px",
					bottomRightBorderRadius: "5px"
				}}
			>

				<GridItem
					xs={12}
					md={6}
					lg={6}
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center"
					}}
				>
					{this.props.agenda.subjectType !== AGENDA_TYPES.PRIVATE_VOTING &&
						<React.Fragment>
							<div style={{ display: "flex", flexDirection: "row", alignItems: 'center' }}>
								<span style={{marginRight: '0.2em'}}>Filtrar por:</span>
								<FilterButton
									onClick={() =>
										this.props.changeVoteFilter(VOTE_VALUES.NO_VOTE)
									}
									active={
										this.state.voteFilter === VOTE_VALUES.NO_VOTE
									}
									tooltip={`${translate.filter_by} - ${
										translate.no_vote
									}`}
								>
									<VotingValueIcon vote={VOTE_VALUES.NO_VOTE} />
								</FilterButton>
								<FilterButton
									onClick={() =>
										this.props.changeVoteFilter(VOTE_VALUES.POSITIVE)
									}
									active={
										this.state.voteFilter === VOTE_VALUES.POSITIVE
									}
									tooltip={`${translate.filter_by} - ${
										translate.positive_votings
									}`}
								>
									<VotingValueIcon vote={VOTE_VALUES.POSITIVE} />
								</FilterButton>
								<FilterButton
									tooltip={`${translate.filter_by} - ${
										translate.negative_votings
									}`}
									active={
										this.state.voteFilter === VOTE_VALUES.NEGATIVE
									}
									onClick={() =>
										this.props.changeVoteFilter(VOTE_VALUES.NEGATIVE)
									}
								>
									<VotingValueIcon vote={VOTE_VALUES.NEGATIVE} />
								</FilterButton>
								<FilterButton
									tooltip={`${translate.filter_by} - ${
										translate.abstention
									}`}
									active={
										this.state.voteFilter === VOTE_VALUES.ABSTENTION
									}
									onClick={() =>
										this.props.changeVoteFilter(VOTE_VALUES.ABSTENTION)
									}
								>
									<VotingValueIcon vote={VOTE_VALUES.ABSTENTION} />
								</FilterButton>
							</div>

							<div
								style={{
									display: "flex",
									flexDirection: "row",
									marginLeft: "0.9em"
								}}
							>
								{this.props.agenda.subjectType === AGENDA_TYPES.PUBLIC_VOTING &&
									<React.Fragment>
										<FilterButton
											onClick={() => this.props.changeStateFilter(5)}
											active={this.state.stateFilter === 5}
											tooltip={`${translate.filter_by} - ${
												translate.present_vote
											}`}
										>
											{this.getStateIcon(1)}
										</FilterButton>
										<FilterButton
											onClick={() => this.props.changeStateFilter(0)}
											active={this.state.stateFilter === 0}
											tooltip={`${translate.filter_by} - ${
												translate.remote_vote
											}`}
										>
											{this.getStateIcon(0)}
										</FilterButton>
									</React.Fragment>

								}

							</div>
						</React.Fragment>
					}
				</GridItem>

				<GridItem xs={4} md={2} lg={2} >
					{!agendaVotingsOpened(this.props.agenda) && !this.props.hideStatus &&
						'Votaciones cerradas' //TRADUCCION
					}
				</GridItem>
				<GridItem xs={8} md={4} lg={4}>
					<TextInput
						adornment={<Icon>search</Icon>}
						floatingText={" "}
						type="text"
						value={this.state.filterText}
						onChange={event => {
							this.props.updateFilterText(event.target.value);
						}}
					/>
				</GridItem>
				<div style={{ width: "100%" }}>
					{!this.props.data.agendaVotings ? (
						<LoadingSection />
					) : this.props.data.agendaVotings.list.length > 0 ? (
						<React.Fragment>
							<Table
								style={{width: '100%'}}
								forceMobileTable={true}
								headers={[
									{},
									{ name: translate.participant_data },
									{ name: translate.votes }
								]}
							>
								{slicedVotings.map(vote => (
									<TableRow key={`vote_${vote.id}`}>
										<TableCell>
											{vote.author.numParticipations === 0 && vote.representing && vote.representing[0].author.numParticipations === 0?
												'-'
											:
												<div
													style={{
														display: "flex",
														flexDirection:
															"row",
														alignItems: "center"
													}}
												>
													{this.props.agenda.subjectType === AGENDA_TYPES.PRIVATE_VOTING?
														<React.Fragment>
															{vote.vote !== -1?
																'Ha votado'
															:
																'No ha votado'
															}
														</React.Fragment>
													:
														<React.Fragment>
															<Tooltip
																title={this.getTooltip(vote.vote)}
															>
																<VotingValueIcon
																	vote={vote.vote}
																/>
															</Tooltip>
															{isPresentVote(vote) && (
																<PresentVoteMenu
																	agenda={this.props.agenda}
																	agendaVoting={vote}
																	active={vote.vote}
																	refetch={this.refreshTable}
																/>
															)}
														</React.Fragment>
													}

													<Tooltip
														title={
															vote.presentVote ===
															1
																? translate.customer_present
																: translate.customer_initial
														}
													>
														{this.getStateIcon(
															vote.presentVote
														)}
													</Tooltip>
												</div>
											}
										</TableCell>
										<TableCell>
											<div style={{minWidth: '7em', fontSize: '0.9em'}}>
												<span style={{fontWeight: '700'}}>
													{!!vote.representing &&
														`${vote.representing[0].author.name} ${vote.representing[0].author.surname} - Representado por: `
													}
													{`${vote.author.name} ${vote.author.surname} ${vote.author.position? ` - ${vote.author.position}` : ''}`}
												</span>
												{!!vote.delegatedVotes &&
													vote.delegatedVotes.map(delegatedVote => (
														<React.Fragment key={`delegatedVote_${delegatedVote.id}`}>
															<br/>
															{`${delegatedVote.author.name} ${delegatedVote.author.surname} ${vote.author.position? ` - ${vote.author.position}` : ''} ${`(Ha delegado su voto)`}`}
														</React.Fragment>
													))
												}
											</div>
										</TableCell>
										<TableCell>
											{vote.author.numParticipations > 0 && `${
												vote.author.numParticipations > 0? vote.author.numParticipations : ''
											}`}
											{!!vote.representing &&
												`${
													vote.representing[0].author.numParticipations > 0 && vote.representing[0].author.numParticipations
												}`
											}
											{!!vote.delegatedVotes &&
												vote.delegatedVotes.map(delegatedVote => (
													<React.Fragment key={`delegatedVote_${delegatedVote.id}`}>
														<br/>
														{`${
															delegatedVote.author.numParticipations > 0 && delegatedVote.author.numParticipations
														}`}
													</React.Fragment>
												))
											}
										</TableCell>
									</TableRow>
								))}
							</Table>
							<div
								style={{
									width: "90%",
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
									marginTop: "1em",
									paddinRight: "10em"
								}}
							>
								<PaginationFooter
									page={this.props.page}
									translate={translate}
									length={slicedVotings.length}
									total={mappedVotings.length}
									limit={this.props.pageLimit}
									changePage={this.props.changePage}
								/>
							</div>
						</React.Fragment>
					) : (
						translate.no_results
					)}
				</div>
			</Grid>
		);
    }
}

export default graphql(agendaVotings, {
	options: props => ({
		variables: {
			agendaId: props.agenda.id,
			...props.variables
		},
		pollInterval: 4000,
		notifyOnNetworkStatusChange: true
	})
})(VotingsTable);