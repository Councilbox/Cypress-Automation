import React from 'react';
import { VOTE_VALUES, AGENDA_TYPES, PARTICIPANT_STATES } from "../../../../constants";
import { TableRow, TableCell } from "material-ui";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getPrimary, getSecondary } from "../../../../styles/colors";
import {
	LoadingSection,
	DropDownMenu,
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
import { Tooltip, MenuItem } from "material-ui";
import { isPresentVote, agendaVotingsOpened } from "../../../../utils/CBX";
import { isMobile } from 'react-device-detect';
import { useOldState } from '../../../../hooks';

let timeout = null;

const VotingsTable = ({ data, agenda, translate, state, ...props }) => {
	const primary = getPrimary();
	const secondary = getSecondary();

	const getTooltip = vote => {
		switch (vote) {
			case VOTE_VALUES.NO_VOTE:
				return translate.no_vote;
			case VOTE_VALUES.NEGATIVE:
				return translate.against_btn;
			case VOTE_VALUES.POSITIVE:
				return translate.in_favor_btn;
			case VOTE_VALUES.ABSTENTION:
				return translate.abstention;
			default:
				return "-";
		}
	};

	const getStateIcon = vote => {
		switch (vote) {
			case 1:
				return (
					<FontAwesome
						name={"user"}
						color={primary}
						style={{
							margin: "0.5em",
							color: secondary,
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
							color: secondary,
							fontSize: "1.1em"
						}}
					/>
				);

			default:
				return <div> </div>;
		}
	};

 	const refreshTable = async () => {
		clearTimeout(timeout);
		setTimeout(props.refetch, 1000);
	};

	let mappedVotings = [];
	let presentVotes = 0;

	if(data.agendaVotings){
		if(data.agendaVotings.list.length > 0){
			data.agendaVotings.list.forEach(voting => {
				if (voting.presentVote === 5) presentVotes++;
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

	const offset = (props.page - 1) * props.pageLimit;
	const slicedVotings = mappedVotings.slice(offset, offset + props.pageLimit);

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
				{agenda.subjectType !== AGENDA_TYPES.PRIVATE_VOTING &&
					<React.Fragment>
						<div style={{ display: "flex", flexDirection: "row", alignItems: 'center' }}>
							<span style={{marginRight: '0.2em'}}>Filtrar por:</span>
							<FilterButton
								onClick={() => props.changeVoteFilter(VOTE_VALUES.NO_VOTE)}
								active={state.voteFilter === VOTE_VALUES.NO_VOTE}
								tooltip={`${translate.filter_by} - ${translate.no_vote}`}
							>
								<VotingValueIcon vote={VOTE_VALUES.NO_VOTE} />
							</FilterButton>
							<FilterButton
								onClick={() => props.changeVoteFilter(VOTE_VALUES.POSITIVE)}
								active={state.voteFilter === VOTE_VALUES.POSITIVE}
								tooltip={`${translate.filter_by} - ${translate.positive_votings}`}
							>
								<VotingValueIcon vote={VOTE_VALUES.POSITIVE} />
							</FilterButton>
							<FilterButton
								tooltip={`${translate.filter_by} - ${translate.negative_votings}`}
								active={state.voteFilter === VOTE_VALUES.NEGATIVE}
								onClick={() => props.changeVoteFilter(VOTE_VALUES.NEGATIVE)}
							>
								<VotingValueIcon vote={VOTE_VALUES.NEGATIVE} />
							</FilterButton>
							<FilterButton
								tooltip={`${translate.filter_by} - ${translate.abstention}`}
								active={state.voteFilter === VOTE_VALUES.ABSTENTION}
								onClick={() => props.changeVoteFilter(VOTE_VALUES.ABSTENTION)}
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
							{agenda.subjectType === AGENDA_TYPES.PUBLIC_VOTING &&
								<React.Fragment>
									<FilterButton
										onClick={() => props.changeStateFilter(5)}
										active={state.stateFilter === 5}
										tooltip={`${translate.filter_by} - ${translate.present_vote}`}
									>
										{getStateIcon(1)}
									</FilterButton>
									<FilterButton
										onClick={() => props.changeStateFilter(0)}
										active={state.stateFilter === 0}
										tooltip={`${translate.filter_by} - ${translate.remote_vote}`}
									>
										{getStateIcon(0)}
									</FilterButton>
								</React.Fragment>

							}

						</div>
					</React.Fragment>
				}
			</GridItem>

			<GridItem xs={4} md={2} lg={2} >
				{!agendaVotingsOpened(agenda) && !props.hideStatus && translate.closed_votings}
			</GridItem>
			<GridItem xs={8} md={4} lg={4}>
				<TextInput
					adornment={<Icon>search</Icon>}
					floatingText={" "}
					type="text"
					value={state.filterText}
					onChange={event => {
						props.updateFilterText(event.target.value);
					}}
				/>
			</GridItem>
			<div style={{ width: "100%" }}>
				{!data.agendaVotings ? (
					<LoadingSection />
				) : data.agendaVotings.list.length > 0 ? (
					<React.Fragment>
						<Table
							style={{width: '100%'}}
							forceMobileTable={true}
							headers={[
								presentVotes > 0?
								{name:
									<SelectAllMenu
										translate={translate}
										agenda={agenda}
										refetch={refreshTable}
									/>
								} : {name: ''},
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
												{agenda.subjectType === AGENDA_TYPES.PRIVATE_VOTING?
													<React.Fragment>
														{vote.vote !== -1?
															translate.has_voted
														:
															translate.no_vote_lowercase
														}
													</React.Fragment>
												:
													<React.Fragment>
														<Tooltip
															title={getTooltip(vote.vote)}
														>
															<VotingValueIcon
																vote={vote.vote}
															/>
														</Tooltip>
														{isPresentVote(vote) && (
															<PresentVoteMenu
																agenda={agenda}
																agendaVoting={vote}
																active={vote.vote}
																refetch={refreshTable}
															/>
														)}
													</React.Fragment>
												}

												<Tooltip
													title={
														vote.presentVote === 1
															? translate.customer_present
															: translate.customer_initial
													}
												>
													{getStateIcon(vote.presentVote)}
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
								page={props.page}
								translate={translate}
								length={slicedVotings.length}
								total={mappedVotings.length}
								limit={props.pageLimit}
								changePage={props.changePage}
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

const setAllPresentVotingsMutation = gql`
	mutation SetAllPresentVotings($agendaId: Int!, $vote: Int!){
		setAllPresentVotings(agendaId: $agendaId, vote: $vote){
			success
			message
		}
	}
`;

const SelectAllMenu = graphql(setAllPresentVotingsMutation, {
	name: 'setAllPresentVotings'
})(({ translate, agenda, setAllPresentVotings, refetch }) => {
	const [loading, setLoading] = React.useState(false);

	const setAllPresents = async vote => {
		setLoading(true);

		const response = await setAllPresentVotings({
			variables: {
				agendaId: agenda.id,
				vote
			}
		});

		refetch();

		setLoading(false);
	}

	return (
		<DropDownMenu
			color="transparent"
			Component={() =>
				<div style={{cursor: 'pointer'}}>
					Marcar presentes como: {loading && <LoadingSection size={10} />}
				</div>
			}
			type="flat"
			items={
				<React.Fragment>
					<MenuItem onClick={() => setAllPresents(VOTE_VALUES.POSITIVE)}>
						A favor
					</MenuItem>
					<MenuItem onClick={() => setAllPresents(VOTE_VALUES.NEGATIVE)}>
						En contra
					</MenuItem>
					<MenuItem onClick={() => setAllPresents(VOTE_VALUES.ABSTENTION)}>
						Abstención
					</MenuItem>
				</React.Fragment>
			}
		/>
	)
})

export default VotingsTable;