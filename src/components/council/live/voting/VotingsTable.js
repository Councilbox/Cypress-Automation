import React from 'react';
import { VOTE_VALUES, AGENDA_TYPES, PARTICIPANT_STATES } from "../../../../constants";
import { TableRow, TableCell, withStyles, Card, CardContent, CardHeader } from "material-ui";
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { getPrimary, getSecondary } from "../../../../styles/colors";
import {
	LoadingSection,
	DropDownMenu,
	PaginationFooter,
	Icon,
	Checkbox,
	FilterButton,
	TextInput,
	Grid,
	Table,
	GridItem,
	AlertConfirm
} from "../../../../displayComponents";
import { updateAgendaVoting } from "../../../../queries/agenda";
import FontAwesome from "react-fontawesome";
import VotingValueIcon from "./VotingValueIcon";
import PresentVoteMenu from "./PresentVoteMenu";
import { Tooltip, MenuItem } from "material-ui";
import { isPresentVote, agendaVotingsOpened, isCustomPoint } from "../../../../utils/CBX";
import { isMobile } from 'react-device-detect';
import PropTypes from "prop-types";
import NominalCustomVoting, { DisplayVoting } from './NominalCustomVoting';


let timeout = null;

const VotingsTable = ({ data, agenda, translate, state, classes, ...props }) => {
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

	let votings = [];

	if (data.agendaVotings) {
		votings = data.agendaVotings.list;
	}

	return (
		<Grid
			style={{
				width: "100%",
				paddingTop: 0,
				backgroundColor: "white",
				margin: "0px",
				// overflow: "hidden"

			}}
		>
			<GridItem
				xs={12}
				md={6}
				lg={6}
				style={{
					display: "flex",
					alignItems: "center",
					width: "100%",
					overflow: "hidden",
					margin: "0px"
				}}
			>
				{(agenda.subjectType !== AGENDA_TYPES.PRIVATE_VOTING && !isCustomPoint(agenda.subjectType)) &&
					<React.Fragment>
						<div style={{ display: isMobile ? "block" : "flex", flexDirection: "row", alignItems: 'center', width: "100%", padding: "0px", }}>
							<div   >
								<span >Filtrar por:</span>
							</div>
							<div style={{ display: "flex" }}>
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
						</div>
					</React.Fragment>
				}
			</GridItem>
			{!agendaVotingsOpened(agenda) && !props.hideStatus &&
				<GridItem xs={12} md={12} lg={12}
					style={{
						margin: '1em 0em',
						border: '1px solid gainsboro',
						fontWeight: '700',
						padding: '2em 0em',
						textAlign: 'center'
					}}>
					{translate.closed_votings}
				</GridItem>
			}
			<GridItem xs={4} md={8} lg={8}>
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

			<div style={{ width: "100%", }}>
				{!data.agendaVotings ? (
					<LoadingSection />
				) : data.agendaVotings.list.length > 0 ? (
					isMobile ?
						<React.Fragment>
							{votings.map(vote => (
								<Card key={vote.id} style={{ marginBottom: "1em" }}>
									<CardHeader
										style={{ paddingBottom: "0px" }}
										title={
											<div style={{ display: "flex", fontSize: "15px" }}>
												<div style={{ marginRight: "0.5em" }}>
													<span >
														{!!vote.authorRepresentative ?
															`${vote.author.name} ${vote.author.surname} - Representado por: ${vote.authorRepresentative.name} ${vote.authorRepresentative.surname} ${vote.authorRepresentative.position ? ` - ${vote.authorRepresentative.position}` : ''}`
															:
															`${vote.author.name} ${vote.author.surname} ${vote.author.position ? ` - ${vote.author.position}` : ''}`
														}
													</span>
													<React.Fragment>
														{!!vote.delegatedVotes &&
															vote.delegatedVotes.filter(vote => vote.author.state !== PARTICIPANT_STATES.REPRESENTATED).map(delegatedVote => (
																<React.Fragment key={`delegatedVote_${delegatedVote.id}`}>
																	<br />
																	{`${delegatedVote.author.name} ${delegatedVote.author.surname} ${delegatedVote.author.position ? ` - ${delegatedVote.author.position}` : ''} ${`(Ha delegado su voto)`}`}
																</React.Fragment>
															))
														}
													</React.Fragment>
												</div>
											</div>
										}
									/>
									<CardContent >
										<div style={{ marginLeft: "-5px" }}>
											{vote.author.numParticipations === 0 && vote.representing && vote.representing[0].author.numParticipations === 0 ?
												'-'
												:
												<div
													style={{
														display: "flex",
														flexDirection:
															"row",
														alignItems: "center",
														fontSize: "0.8rem"
													}}
												>
													{vote.delegateId && vote.author.state !== PARTICIPANT_STATES.REPRESENTATED ?
														translate.customer_delegated
														:
														<React.Fragment>
															{agenda.subjectType === AGENDA_TYPES.PRIVATE_VOTING || agenda.subjectType === AGENDA_TYPES.CUSTOM_PRIVATE || props.council.councilType === 3 ?
																<PrivateVotingDisplay
																	vote={vote}
																	council={props.council}
																	agenda={agenda}
																	translate={translate}
																	refetch={refreshTable}
																/>
																:
																<React.Fragment>
																	{!isCustomPoint(agenda.subjectType) &&
																		<Tooltip
																			title={getTooltip(vote.vote)}
																		>
																			<VotingValueIcon
																				vote={vote.vote}
																			/>
																		</Tooltip>
																	}

																	{isPresentVote(vote) && (
																		<React.Fragment>
																			{isCustomPoint(agenda.subjectType) ?
																				<NominalCustomVoting
																					agenda={agenda}
																					translate={translate}
																					agendaVoting={vote}
																					active={vote.vote}
																					refetch={refreshTable}
																				/>
																				:
																				<PresentVoteMenu
																					agenda={agenda}
																					agendaVoting={vote}
																					active={vote.vote}
																					refetch={refreshTable}
																				/>
																			}

																		</React.Fragment>

																	)}
																	<Tooltip
																		title={
																			vote.presentVote === 1
																				? translate.customer_present
																				: translate.customer_initial
																		}
																	>
																		{getStateIcon(vote.presentVote)}
																	</Tooltip>
																	{isCustomPoint(agenda.subjectType) && !isPresentVote(vote) &&
																		<DisplayVoting
																			ballots={vote.ballots}
																			translate={translate}
																		/>
																	}
																</React.Fragment>
															}
														</React.Fragment>
													}
												</div>
											}
										</div>
										<div>
											<div style={{ display: "flex", fontSize: "14px" }}>
												<div style={{ marginRight: "0.5em", fontWeight: '700' }}>
													{translate.votes}:
												</div>
												<div>
													<div>
														{vote.numParticipations > 0 ? `${vote.numParticipations}` : 0}
														{!!vote.representing &&
															`${
															vote.numParticipations > 0 ? vote.numParticipations : 0
															}`
														}
														<React.Fragment>
															{!!vote.delegatedVotes &&
																vote.delegatedVotes.filter(vote => vote.author.state !== PARTICIPANT_STATES.REPRESENTATED).map(delegatedVote => (
																	<React.Fragment key={`delegatedVote_${delegatedVote.id}`}>
																		<br />
																		{`${delegatedVote.author.numParticipations > 0 ? delegatedVote.author.numParticipations : 0}`}
																	</React.Fragment>
																))
															}
														</React.Fragment>
													</div>
													{/* ))} */}
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</React.Fragment>
						:
						<React.Fragment>
							<Table
								style={{ width: '100%', }}
								forceMobileTable={true}
								headers={[
									(agenda.presentCensus > 0 && !isCustomPoint(agenda.subjectType) && props.council.councilType !== 3) ?
										{
											name:
												<SelectAllMenu
													translate={translate}
													agenda={agenda}
													refetch={refreshTable}
												/>
										} : { name: '' },
									{ name: translate.participant_data },
									{ name: translate.votes }
								]}
							>
								{votings.map(vote => (
									<TableRow key={`vote_${vote.id}`}>
										<TableCell>
											{vote.author.numParticipations === 0 && vote.representing && vote.representing[0].author.numParticipations === 0 ?
												'-'
												:
												<div
													style={{
														display: "flex",
														flexDirection:
															"row",
														alignItems: "center",
													}}
												>
													{vote.delegateId && vote.author.state !== PARTICIPANT_STATES.REPRESENTATED ?
														translate.customer_delegated
														:
														<React.Fragment>
															{agenda.subjectType === AGENDA_TYPES.PRIVATE_VOTING || agenda.subjectType === AGENDA_TYPES.CUSTOM_PRIVATE || props.council.councilType === 3 ?
																<PrivateVotingDisplay
																	vote={vote}
																	council={props.council}
																	agenda={agenda}
																	translate={translate}
																	refetch={refreshTable}
																/>
																:
																<React.Fragment>
																	{!isCustomPoint(agenda.subjectType) &&
																		<Tooltip
																			title={getTooltip(vote.vote)}
																		>
																			<VotingValueIcon
																				vote={vote.vote}
																			/>
																		</Tooltip>
																	}

																	{isPresentVote(vote) && (
																		<React.Fragment>
																			{isCustomPoint(agenda.subjectType) ?
																				<NominalCustomVoting
																					agenda={agenda}
																					translate={translate}
																					agendaVoting={vote}
																					active={vote.vote}
																					refetch={refreshTable}
																				/>
																				:
																				<PresentVoteMenu
																					agenda={agenda}
																					agendaVoting={vote}
																					active={vote.vote}
																					refetch={refreshTable}
																				/>
																			}

																		</React.Fragment>

																	)}
																	<Tooltip
																		title={
																			vote.presentVote === 1
																				? translate.customer_present
																				: translate.customer_initial
																		}
																	>
																		{getStateIcon(vote.presentVote)}
																	</Tooltip>
																	{isCustomPoint(agenda.subjectType) && !isPresentVote(vote) &&
																		<DisplayVoting
																			ballots={vote.ballots}
																			translate={translate}
																		/>
																	}
																</React.Fragment>
															}
														</React.Fragment>
													}
												</div>
											}
										</TableCell>
										<TableCell>
											<div style={{ minWidth: '7em', fontSize: '0.9em' }}>
												<span style={{ fontWeight: '700' }}>
													{!!vote.authorRepresentative ?
														`${vote.author.name} ${vote.author.surname} - Representado por: ${vote.authorRepresentative.name} ${vote.authorRepresentative.surname} ${vote.authorRepresentative.position ? ` - ${vote.authorRepresentative.position}` : ''}`
														:
														`${vote.author.name} ${vote.author.surname} ${vote.author.position ? ` - ${vote.author.position}` : ''}`
													}
												</span>
												<React.Fragment>
													{!!vote.delegatedVotes &&
														vote.delegatedVotes.filter(vote => vote.author.state !== PARTICIPANT_STATES.REPRESENTATED).map(delegatedVote => (
															<React.Fragment key={`delegatedVote_${delegatedVote.id}`}>
																<br />
																{`${delegatedVote.author.name} ${delegatedVote.author.surname} ${delegatedVote.author.position ? ` - ${delegatedVote.author.position}` : ''} ${`(Ha delegado su voto)`}`}
															</React.Fragment>
														))
													}
												</React.Fragment>
											</div>
										</TableCell>
										<TableCell>
											{vote.numParticipations > 0 ? `${vote.numParticipations}` : 0}
											{!!vote.representing &&
												`${vote.numParticipations > 0 ? vote.numParticipations : 0}`
											}
											<React.Fragment>
												{!!vote.delegatedVotes &&
													vote.delegatedVotes.filter(vote => vote.author.state !== PARTICIPANT_STATES.REPRESENTATED).map(delegatedVote => (
														<React.Fragment key={`delegatedVote_${delegatedVote.id}`}>
															<br />
															{`${delegatedVote.author.numParticipations > 0 ? delegatedVote.author.numParticipations : 0}`}
														</React.Fragment>
													))
												}
											</React.Fragment>
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
									length={votings.length}
									total={data.agendaVotings.total}
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

const RemoveRemoteVoteAlert = ({ translate, open, requestClose, vote, ...props }) => {

	const body = () => {
		return (
			<div>
				Anulará de forma permanente el voto telemático de este asistente, ¿Desea continuar?
			</div>
		)
	}

	return (
		<AlertConfirm
			requestClose={requestClose}
			open={open}
			acceptAction={props.acceptAction}
			buttonAccept={translate.accept}
			buttonCancel={translate.cancel}
			bodyText={body()}
			title={translate.warning}
		/>
	)
}


const PrivateVotingDisplay = compose(
	graphql(gql`
		mutation TogglePresentVote($votingId: Int!){
					togglePresentVote(votingId: $votingId){
					success
				}
				}
	`, {
			name: "togglePresentVote"
		}),
	graphql(gql`
		mutation cancelRemoteVote($votingId: Int!){
					cancelRemoteVote(votingId: $votingId){
					success
				}
				}
	`, {
			name: "cancelRemoteVote"
		})
)(({ translate, agenda, vote, refetch, togglePresentVote, cancelRemoteVote, council, ...props }) => {
	const [loading, setLoading] = React.useState(false);
	const [modal, setModal] = React.useState(false);
	const secondary = getSecondary();

	const closeModal = () => {
		setModal(false);
	}

	const toggleVote = () => {
		setLoading(true);
		if (vote.vote === 3) {
			setModal(true);
			setLoading(false);
			return;
		}
		setVoting();
	}

	const setVoting = async () => {
		if (isCustomPoint(agenda.subjectType) && agenda.votingState === 4 && vote.vote === 3) {
			await cancelRemoteVote({
				variables: {
					votingId: vote.id
				}
			});
		} else {
			await togglePresentVote({
				variables: {
					votingId: vote.id,
				}
			});
		}
		await refetch();
		let timeout = setTimeout(() => {
			setLoading(false);
			clearTimeout(timeout);
			if (modal) {
				setModal(false);
			}
		}, 1500);
	}

	//TRADUCCION

	return (
		<React.Fragment>
			<RemoveRemoteVoteAlert
				open={modal}
				translate={translate}
				requestClose={closeModal}
				acceptAction={setVoting}
			/>
			{agenda.votingState === 4 ?
				<React.Fragment>
					{loading ?
						<div style={{ width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'flex-start' }}>
							<div>
								<LoadingSection size={16} />
							</div>
						</div>
						:
						vote.vote === 3 && council.presentVoteOverwrite === 1 ?
							<div onClick={toggleVote} style={{ cursor: 'pointer' }}>
								<i className="fa fa-times" style={{ marginRight: '1em' }} />
								{'Anular voto telemático'}
							</div>
							:
							<Checkbox
								label={vote.vote === -1 ?
									'No ha votado presencialmente' :
									vote.vote === -3 ?
										'Voto remoto anulado - Ha votado presencialmente'
										:
										'Ha votado presencialmente'
								}
								onChange={toggleVote}
								loading={loading}
								value={vote.vote === -2 || vote.vote === -3}
							/>
					}
				</React.Fragment>
				:
				council.councilType === 3 ?
					<React.Fragment>
						{loading ?
							<div style={{ width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'flex-start' }}>
								<div>
									<LoadingSection size={16} />
								</div>
							</div>
							:
							vote.vote === 3 && council.presentVoteOverwrite === 1 ?
								<div onClick={toggleVote} style={{ cursor: 'pointer' }}>
									<i className="fa fa-times" style={{ marginRight: '1em' }} />
									{'Anular voto telemático'}
								</div>
								:
								vote.vote === -1 ?
									'No ha votado presencialmente' :
									vote.vote === -3 ?
										'Voto remoto anulado - Ha votado presencialmente'
										:
										'Ha votado presencialmente'
						}
					</React.Fragment>
					:
					<React.Fragment>
						{vote.vote !== -1 ?
							translate.has_voted
							:
							translate.no_vote_lowercase
						}
					</React.Fragment>
			}
		</React.Fragment>
	)
})


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
				<div style={{ cursor: 'pointer' }}>
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


const regularCardStyle = {
	cardTitle: {
		fontSize: "1em",
	},
}

VotingsTable.propTypes = {
	classes: PropTypes.object.isRequired,
	cardTitle: PropTypes.node,
};

export default withStyles(regularCardStyle)(VotingsTable);