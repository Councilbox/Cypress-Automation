import React, { Component, Fragment } from "react";
import { graphql } from "react-apollo";
import {
	CollapsibleSection,
	LoadingSection,
	PaginationFooter,
	Icon,
	ErrorWrapper,
	FilterButton,
	TextInput,
	Grid,
	Table,
	GridItem,
	Radio
} from "../../../displayComponents";
import { darkGrey, getPrimary, getSecondary } from "../../../styles/colors";
import { agendaVotings } from "../../../queries/agenda";
import FontAwesome from "react-fontawesome";
import { isPresentVote } from "../../../utils/CBX";
import { VOTE_VALUES, PARTICIPANT_STATES } from "../../../constants";
import { LIVE_COLLAPSIBLE_HEIGHT } from "../../../styles/constants";
import { TableRow, TableCell } from "material-ui";
import { Tooltip } from "material-ui";
import PresentVoteMenu from "./voting/PresentVoteMenu";
import VotingValueIcon from "./voting/VotingValueIcon";

class VotingsSection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			voteFilter: "all",
			stateFilter: "all",
			filterText: "",
			page: 1,
			agendaId: this.props.agenda.id
		};
	}

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

		return null;
	}

	_button = () => {
		return (
			<div
				style={{
					height: LIVE_COLLAPSIBLE_HEIGHT,
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center"
				}}
			>
				<div
					style={{
						width: "25%",
						height: LIVE_COLLAPSIBLE_HEIGHT,
						display: "flex",
						alignItems: "center",
						paddingLeft: "1.5em"
					}}
				>
					<Icon className="material-icons" style={{ color: "grey" }}>
						thumbs_up_down
					</Icon>
					<span
						style={{ marginLeft: "0.7em", color: darkGrey, fontWeight: "700" }}
					>
						{this.props.translate.voting}
					</span>
					{/*<span style={{marginLeft: '0.6em', color: darkGrey, fontSize: '0.7em'}}>
                        (Alt + V)
                    </span>*/}
				</div>
				<div
					style={{
						width: "25%",
						display: "flex",
						justifyContent: "flex-end",
						paddingRight: "2em"
					}}
				>
					<Icon className="material-icons" style={{ color: "grey" }}>
						keyboard_arrow_down
					</Icon>
				</div>
			</div>
		);
	};

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

	updateFilterText = value => {
		this.setState(
			{
				filterText: value
			},
			this.refreshTable
		);
	};

	changeVoteFilter = value => {
		this.setState(
			{
				voteFilter: this.state.voteFilter === value ? "all" : value
			},
			this.refreshTable
		);
	};

	changeStateFilter = value => {
		this.setState(
			{
				stateFilter: this.state.stateFilter === value ? "all" : value
			},
			this.refreshTable
		);
	};

	changePage = value => {
		const variables = this.buildVariables();
		variables.options = {
			limit: 10,
			offset: 10 * (value - 1)
		};

		this.setState({
			page: value
		});
		this.props.data.refetch(variables);
	};

	buildVariables = () => {
		let variables = {
			filters: [],
			authorFilters: null
		};

		if (this.state.voteFilter !== "all") {
			variables.filters = [
				{
					field: "vote",
					text: this.state.voteFilter
				}
			];
		}

		if (this.state.filterText) {
			variables = {
				...variables,
				authorFilters: {
					username: this.state.filterText
				}
			};
		}

		if (this.state.stateFilter !== "all") {
			variables = {
				...variables,
				filters: [
					...variables.filters,
					{
						field: "presentVote",
						text: this.state.stateFilter
					}
				]
			};
		}

		return variables;
	};

	refreshTable = async () => {
		const variables = this.buildVariables();
		const response = await this.props.data.refetch(variables);
	};

	toggle = event => {
		this.setState({ open: !this.state.open });
	};

	_section = () => {
		const { translate } = this.props;
		return (
			<Grid
				style={{
					width: "100%",
					padding: "1em",
					paddingTop: 0,
					backgroundColor: "white",
					border: "4px solid lightgrey",
					bottomLeftBorderRadius: "5px",
					bottomRightBorderRadius: "5px"
				}}
			>
				<GridItem
					xs={8}
					md={8}
					lg={8}
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center"
					}}
				>
					<div style={{ display: "flex", flexDirection: "row" }}>
						<FilterButton
							onClick={() => this.changeVoteFilter(VOTE_VALUES.NO_VOTE)}
							active={this.state.voteFilter === VOTE_VALUES.NO_VOTE}
							tooltip={`${translate.filter_by} - ${translate.no_vote}`}
						>
							<VotingValueIcon vote={VOTE_VALUES.NO_VOTE} />
						</FilterButton>
						<FilterButton
							onClick={() => this.changeVoteFilter(VOTE_VALUES.POSITIVE)}
							active={this.state.voteFilter === VOTE_VALUES.POSITIVE}
							tooltip={`${translate.filter_by} - ${translate.positive_votings}`}
						>
							<VotingValueIcon vote={VOTE_VALUES.POSITIVE} />
						</FilterButton>
						<FilterButton
							tooltip={`${translate.filter_by} - ${translate.negative_votings}`}
							active={this.state.voteFilter === VOTE_VALUES.NEGATIVE}
							onClick={() => this.changeVoteFilter(VOTE_VALUES.NEGATIVE)}
						>
							<VotingValueIcon vote={VOTE_VALUES.NEGATIVE} />
						</FilterButton>
						<FilterButton
							tooltip={`${translate.filter_by} - ${translate.abstention}`}
							active={this.state.voteFilter === VOTE_VALUES.ABSTENTION}
							onClick={() => this.changeVoteFilter(VOTE_VALUES.ABSTENTION)}
						>
							<VotingValueIcon vote={VOTE_VALUES.ABSTENTION} />
						</FilterButton>
					</div>

					<div
						xs={4}
						md={4}
						lg={4}
						style={{
							display: "flex",
							flexDirection: "row",
							marginLeft: "0.9em"
						}}
					>
						<FilterButton
							onClick={() => this.changeStateFilter(1)}
							active={this.state.stateFilter === 1}
							tooltip={`${translate.filter_by} - ${translate.present_vote}`}
						>
							{this.getStateIcon(1)}
						</FilterButton>
						<FilterButton
							onClick={() => this.changeStateFilter(0)}
							active={this.state.stateFilter === 0}
							tooltip={`${translate.filter_by} - ${translate.remote_vote}`}
						>
							{this.getStateIcon(0)}
						</FilterButton>
					</div>
				</GridItem>
				<GridItem xs={4} md={4} lg={4}>
					<TextInput
						adornment={<Icon>search</Icon>}
						floatingText={" "}
						type="text"
						value={this.state.filterText}
						onChange={event => {
							this.updateFilterText(event.target.value);
						}}
					/>
				</GridItem>
				<div style={{ width: "100%" }}>
					{this.props.data.loading ? (
						<LoadingSection />
					) : this.props.data.agendaVotings.list.length > 0 ? (
						<React.Fragment>
							<Table
								headers={[
									{},
									{ name: translate.participant_data },
									{ name: translate.position },
									{ name: translate.votes }
								]}
							>
								{this.props.data.agendaVotings.list.map(vote => {
									return (
										<TableRow key={`vote_${vote.id}`}>
											<TableCell>
												<div
													style={{
														display: "flex",
														flexDirection: "row",
														alignItems: "center"
													}}
												>
													<Tooltip title={this.getTooltip(vote.vote)}>
														<VotingValueIcon vote={vote.vote} />
													</Tooltip>

													{isPresentVote(vote) && (
														<PresentVoteMenu
															agendaVoting={vote}
															active={vote.vote}
															refetch={this.props.data.refetch}
														/>
													)}

													<Tooltip
														title={
															vote.presentVote === 1
																? translate.customer_present
																: translate.customer_initial
														}
													>
														{this.getStateIcon(vote.presentVote)}
													</Tooltip>
												</div>
											</TableCell>
											<TableCell>
												{vote.authorRepresentative?
                                                    <React.Fragment>
														{`${vote.author.name} ${vote.author.surname}`}
                                                        <br/>														
                                                        {`${translate.voting_delegate} - ${vote.authorRepresentative.name} ${vote.authorRepresentative.surname}`}
                                                    </React.Fragment>
											: 
                                                `${vote.author.name} ${vote.author.surname}`}<br/>
                                                
											</TableCell>
											<TableCell>{`${vote.author.position}`}</TableCell>
											<TableCell>
												{`${vote.author.numParticipations} (${(
													vote.author.numParticipations /
													this.props.agenda.currentRemoteCensus *
													100
												).toFixed(2)}%)`}
											</TableCell>
										</TableRow>
									);
								})}
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
									page={this.state.page}
									translate={translate}
									length={this.props.data.agendaVotings.list.length}
									total={this.props.data.agendaVotings.total}
									limit={10}
									changePage={this.changePage}
								/>
							</div>
						</React.Fragment>
					) : (
						translate.no_results
					)}
				</div>
			</Grid>
		);
	};

	render() {
		const { translate } = this.props;

		return (
			<div
				style={{
					width: "100%",
					backgroundColor: "lightgrey",
					position: "relative"
				}}
				onKeyUp={this.handleKeyPress}
			>
				<CollapsibleSection
					trigger={this._button}
					collapse={this._section}
					open={false}
				/>
			</div>
		);
	}
}

export default graphql(agendaVotings, {
	options: props => ({
		variables: {
			agendaId: props.agenda.id,
			options: {
				limit: 10,
				offset: 0
			}
		},
		pollInterval: 4000
	})
})(VotingsSection);
