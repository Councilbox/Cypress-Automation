import React from 'react';
import {
	TableRow, TableCell, withStyles, Card, CardContent, Tooltip, MenuItem
} from 'material-ui';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import gql from 'graphql-tag';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import {
	VOTE_VALUES, AGENDA_TYPES, PARTICIPANT_STATES, COUNCIL_TYPES
} from '../../../../constants';
import { getPrimary, getSecondary } from '../../../../styles/colors';
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
} from '../../../../displayComponents';
import VotingValueIcon from './VotingValueIcon';
import PresentVoteMenu from './PresentVoteMenu';
import {
	isPresentVote, agendaVotingsOpened, isCustomPoint, showNumParticipations, getPercentage, getActiveVote, isConfirmationRequest
} from '../../../../utils/CBX';
import NominalCustomVoting, { DisplayVoting } from './NominalCustomVoting';
import { isMobile } from '../../../../utils/screen';
import withSharedProps from '../../../../HOCs/withSharedProps';
import OwnedVotingsRightPoint from '../participants/ownedVotes/OwnedVotingsRightPoint';


const timeout = null;

const VotingsTable = ({
	data, agenda, translate, state, classes, ...props
}) => {
	const primary = getPrimary();
	const secondary = getSecondary();
	const [delegatedVotesModal, setDelegatedVotesModal] = React.useState(false);

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
				return '-';
		}
	};

	const getStateIcon = vote => {
		switch (vote) {
			case 1:
				return (
					<FontAwesome
						name={'user'}
						color={primary}
						style={{
							margin: '0.5em',
							color: secondary,
							fontSize: '1.1em'
						}}
					/>
				);

			case 0:
				return (
					<FontAwesome
						name={'globe'}
						color={primary}
						style={{
							margin: '0.5em',
							color: secondary,
							fontSize: '1.1em'
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

	const printPercentage = value => {
		// This companies work based on coefficients
		if (props.company === 10) {
			return '';
		}

		return `(${getPercentage(value, props.recount.partTotal)}%)`;
	};

	const defaultZero = value => (value || 0);
	const printPercentageTotal = (num, base = null) => {
		const totalVotes = defaultZero(agenda.votingsRecount.positiveVotings)
			+ defaultZero(agenda.votingsRecount.positiveManual)
			+ defaultZero(agenda.votingsRecount.negativeVotings)
			+ defaultZero(agenda.votingsRecount.negativeManual)
			+ defaultZero(agenda.votingsRecount.abstentionVotings)
			+ defaultZero(agenda.votingsRecount.abstentionManual)
			+ defaultZero(agenda.votingsRecount.noVoteVotings)
			+ defaultZero(agenda.votingsRecount.noVoteManual);
		if (props.company.type === 10) {
			return '';
		}
		const total = base || (totalVotes + props.recount.treasuryShares);

		if (total === 0) {
			return '(0%)';
		}

		return `(${((num / total) * 100).toFixed(3)}%)`;
	};

	let votings = [];

	if (data.agendaVotings) {
		votings = data.agendaVotings.list;
	}

	const renderVotingMenu = agendaVoting => {
		const vote = getActiveVote(agendaVoting);

		if (!vote) {
			return <span />;
		}

		return (
			<>
				{agenda.subjectType === AGENDA_TYPES.PRIVATE_VOTING || agenda.subjectType === AGENDA_TYPES.CUSTOM_PRIVATE || props.council.councilType === 3 ?
					<PrivateVotingDisplay
						vote={vote}
						council={props.council}
						agenda={agenda}
						translate={translate}
						refetch={refreshTable}
					/>
					: <>
						{!isCustomPoint(agenda.subjectType)
							&& <Tooltip
								title={vote ? vote.vote : null}
							>
								<VotingValueIcon
									vote={vote.vote}
								/>
							</Tooltip>
						}

						{isPresentVote(agendaVoting) && (
							<>
								{isCustomPoint(agenda.subjectType) ?
									<NominalCustomVoting
										agenda={agenda}
										translate={translate}
										agendaVoting={vote}
										active={vote}
										council={props.council}
										refetch={refreshTable}
									/>
									: <PresentVoteMenu
										agenda={agenda}
										agendaVoting={vote}
										refetch={refreshTable}
									/>
								}

							</>

						)}
						<Tooltip
							title={
								agendaVoting.presentVote === 1 ?
									translate.customer_present
									: translate.customer_initial
							}
						>
							{getStateIcon(agendaVoting.presentVote)}
						</Tooltip>
						{isCustomPoint(agenda.subjectType) && !isPresentVote(agendaVoting)
							&& <DisplayVoting
								ballots={vote.ballots}
								translate={translate}
								items={agenda.items}
							/>
						}
					</>
				}
			</>
		);
	};

	const renderParticipantInfo = vote => {
		const delegatedVotes = vote.delegatedVotes ?
			vote.delegatedVotes.filter(item => item.author.state !== PARTICIPANT_STATES.REPRESENTATED)
			: [];


		return (
			<div style={{ minWidth: '7em' }}>
				<span style={{ fontWeight: '700' }}>
					{vote.authorRepresentative ?
						<React.Fragment>
							{`${vote.authorRepresentative.name} ${vote.authorRepresentative.surname || ''} ${vote.authorRepresentative.position ? ` - ${vote.authorRepresentative.position}` : ''}`}
						</React.Fragment>
						: <React.Fragment>
							{`${vote.author.name} ${vote.author.surname || ''} ${vote.author.position ? ` - ${vote.author.position}` : ''}`}
							{vote.author.voteDenied
								&& <Tooltip title={vote.author.voteDeniedReason}>
									<span style={{ color: 'red', fontWeight: '700' }}>
										(Voto denegado)
									</span>
								</Tooltip>
							}
						</React.Fragment>

					}
				</span>
				<b>
					{!!vote.delegatedVotes
						&& vote.delegatedVotes.filter(item => item.author.state === PARTICIPANT_STATES.REPRESENTATED).map(delegatedVote => (
							<React.Fragment key={`delegatedVote_${delegatedVote.id}`}>
								<br />
								{delegatedVote.fixed
									&& <Tooltip
										title={getTooltip(delegatedVote.vote)}
									>
										<VotingValueIcon
											vote={delegatedVote.vote}
											fixed
										/>
									</Tooltip>
								}
								{`${translate.representative_of} ${delegatedVote.author.name} ${delegatedVote.author.surname || ''} ${delegatedVote.author.position ? ` - ${delegatedVote.author.position}` : ''} ${isMobile ? ` - ${showNumParticipations(delegatedVote.numParticipations, props.company, props.council.statute)} ${printPercentage(delegatedVote.numParticipations)}` : ''}`}
								{delegatedVote.author.voteDenied
									&& <Tooltip title={delegatedVote.author.voteDeniedReason}>
										<span style={{ color: 'red', fontWeight: '700' }}>
											(Voto denegado)
										</span>
									</Tooltip>
								}
							</React.Fragment>
						))
					}
				</b>
				<React.Fragment>
					{!!delegatedVotes
						&& delegatedVotes.slice(0, 10).map(delegatedVote => (
							<React.Fragment key={`delegatedVote_${delegatedVote.id}`}>
								<br />
								{delegatedVote.fixed
									&& <Tooltip
										title={getTooltip(delegatedVote.vote)}
									>
										<VotingValueIcon
											vote={delegatedVote.vote}
											fixed
										/>
									</Tooltip>
								}
								{`${delegatedVote.author.name} ${delegatedVote.author.surname || ''} ${delegatedVote.author.position ? ` - ${delegatedVote.author.position}` : ''} (Ha delegado su voto) ${isMobile ? ` - ${showNumParticipations(delegatedVote.author.numParticipations, props.company, props.council.statute)} ` : ''}`}
								{delegatedVote.author.voteDenied
									&& <Tooltip title={delegatedVote.author.voteDeniedReason}>
										<span style={{ color: 'red', fontWeight: '700' }}>
											(Voto denegado)
										</span>
									</Tooltip>
								}
							</React.Fragment>
						))
					}
					{delegatedVotes?.length > 10 &&
						<>
							<OwnedVotingsRightPoint
								open={delegatedVotesModal}
								agenda={agenda}
								council={props.council}
								translate={translate}
								requestClose={() => setDelegatedVotesModal(false)}
								participant={vote.author.state === PARTICIPANT_STATES.REPRESENTATED ? vote.authorRepresentative : vote.author}
							/>
							<div
								onClick={() => setDelegatedVotesModal(true)}
								style={{
									cursor: 'pointer',
									color: secondary
								}}
							>
								{translate.num_delegated_votes_see_all.replace(/{{number}}/, delegatedVotes?.length - 10)}
							</div>
						</>
					}
				</React.Fragment>
			</div>
		);
	};

	return (
		<Grid
			style={{
				width: '100%',
				paddingTop: 0,
				backgroundColor: 'white',
				margin: '0px',
				// overflow: "hidden"
			}}
		>
			<GridItem
				xs={12}
				md={6}
				lg={6}
				style={{
					display: 'flex',
					alignItems: 'center',
					width: '100%',
					overflow: 'hidden',
					margin: '0px'
				}}
			>
				{(agenda.subjectType !== AGENDA_TYPES.PRIVATE_VOTING && !isCustomPoint(agenda.subjectType))
					&& <React.Fragment>
						<div style={{
							display: isMobile ? 'block' : 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', padding: '0px',
						}}>
							<div >
								<span>{translate.filter_by}</span>
							</div>
							<div style={{ display: 'flex' }}>
								<FilterButton
									onClick={() => props.changeVoteFilter(VOTE_VALUES.NO_VOTE)}
									active={state.voteFilter === VOTE_VALUES.NO_VOTE}
									tooltip={`${translate.filter_by} - ${props.council.councilType === COUNCIL_TYPES.ONE_ON_ONE ?
										translate.without_selection
										: translate.no_vote
										}`}
								>
									<VotingValueIcon vote={VOTE_VALUES.NO_VOTE} />
								</FilterButton>
								<FilterButton
									onClick={() => props.changeVoteFilter(VOTE_VALUES.POSITIVE)}
									active={state.voteFilter === VOTE_VALUES.POSITIVE}
									tooltip={`${translate.filter_by} - ${props.council.councilType === COUNCIL_TYPES.ONE_ON_ONE ?
										translate.they_accept
										: translate.positive_votings
										}`}
								>
									<VotingValueIcon vote={VOTE_VALUES.POSITIVE} />
								</FilterButton>
								<FilterButton
									tooltip={`${translate.filter_by} - ${props.council.councilType === COUNCIL_TYPES.ONE_ON_ONE ?
										translate.they_refuse
										: translate.negative_votings
										}`}
									active={state.voteFilter === VOTE_VALUES.NEGATIVE}
									onClick={() => props.changeVoteFilter(VOTE_VALUES.NEGATIVE)}
								>
									<VotingValueIcon vote={VOTE_VALUES.NEGATIVE} />
								</FilterButton>
								{!isConfirmationRequest(agenda.subjectType)
									&& <FilterButton
										tooltip={`${translate.filter_by} - ${translate.abstention}`}
										active={state.voteFilter === VOTE_VALUES.ABSTENTION}
										onClick={() => props.changeVoteFilter(VOTE_VALUES.ABSTENTION)}
									>
										<VotingValueIcon vote={VOTE_VALUES.ABSTENTION} />
									</FilterButton>
								}
								{agenda.subjectType === AGENDA_TYPES.PUBLIC_VOTING
									&& <React.Fragment>
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
			{!agendaVotingsOpened(agenda) && !props.hideStatus
				&& <GridItem xs={12} md={12} lg={12}
					style={{
						margin: '1em 0em',
						border: '1px solid gainsboro',
						fontWeight: '700',
						padding: '8px 16px',
						textAlign: 'center'
					}}>
					{isConfirmationRequest(agenda.subjectType) ?
						translate.closed
						: translate.closed_votings
					}
				</GridItem>
			}
			<GridItem xs={4} md={8} lg={8} style={{ display: 'flex', alignItems: 'center' }}>
				{state.voteFilter === 'all' &&
					<div style={{
						border: '1px solid gainsboro',
						padding: '8px 16px',
						display: 'inline-flex',
						alignItems: 'center',
						fontWeight: 'bold',
						fontSize: '13px'
					}}>
						<div>{translate.no_vote_lowercase}: {agenda.votingsRecount.noVoteVotings} {printPercentageTotal(agenda.votingsRecount.noVoteVotings + agenda.votingsRecount.noVoteManual)}</div>
						<div style={{ margin: '0 .5em' }}>|</div>
						<div>{translate.positive_votings}: {agenda.votingsRecount.positiveVotings} {printPercentageTotal(agenda.votingsRecount.positiveVotings + agenda.votingsRecount.positiveManual)}</div>
						<div style={{ margin: '0 .5em' }}>|</div>
						<div>{translate.negative_votings}: {agenda.votingsRecount.negativeVotings} {printPercentageTotal(agenda.votingsRecount.negativeVotings + agenda.votingsRecount.negativeManual)}</div>
						<div style={{ margin: '0 .5em' }}>|</div>
						{!isConfirmationRequest(agenda.subjectType) &&
							<div>{translate.abstention_lowercase}: {agenda.votingsRecount.abstentionVotings} {printPercentageTotal(agenda.votingsRecount.abstentionVotings + agenda.votingsRecount.abstentionManual)}</div>
						}
					</div>
				}
				{state.voteFilter !== 'all' &&
					<div style={{
						border: '1px solid gainsboro',
						padding: '0.8em',
						display: 'inline-flex',
						alignItems: 'center',
						fontSize: '13px'
					}}>
						{state.voteFilter === VOTE_VALUES.NO_VOTE &&
							<div><span style={{ fontWeight: 'bold' }}>{translate.no_vote_lowercase}: {agenda.votingsRecount.noVoteVotings} {printPercentageTotal(agenda.votingsRecount.noVoteVotings + agenda.votingsRecount.noVoteManual)}</span> {translate.table_showing_part3} {agenda.votingsRecount.noVoteVotings + agenda.votingsRecount.noVoteManual} <span style={{ textTransform: 'lowercase' }}>{translate.participants}</span> </div>
						}
						{state.voteFilter === VOTE_VALUES.POSITIVE &&
							<div><span style={{ fontWeight: 'bold' }}>{translate.positive_votings}: {agenda.votingsRecount.positiveVotings} {printPercentageTotal(agenda.votingsRecount.positiveVotings + agenda.votingsRecount.positiveManual)}</span> {translate.table_showing_part3} {agenda.votingsRecount.positiveVotings + agenda.votingsRecount.positiveManual} <span style={{ textTransform: 'lowercase' }}>{translate.participants}</span> </div>
						}
						{state.voteFilter === VOTE_VALUES.NEGATIVE &&
							<div><span style={{ fontWeight: 'bold' }}>{translate.negative_votings}: {agenda.votingsRecount.negativeVotings} {printPercentageTotal(agenda.votingsRecount.negativeVotings + agenda.votingsRecount.negativeManual)}</span> {translate.table_showing_part3} {agenda.votingsRecount.negativeVotings + agenda.votingsRecount.negativeManual} <span style={{ textTransform: 'lowercase' }}>{translate.participants}</span> </div>
						}
						{!isConfirmationRequest(agenda.subjectType) &&
							state.voteFilter === VOTE_VALUES.ABSTENTION &&
							<div><span style={{ fontWeight: 'bold' }}>{translate.abstention_lowercase}: {agenda.votingsRecount.abstentionVotings} {printPercentageTotal(agenda.votingsRecount.abstentionVotings + agenda.votingsRecount.abstentionManual)}</span> {translate.table_showing_part3} {agenda.votingsRecount.abstentionVotings + agenda.votingsRecount.abstentionManual} <span style={{ textTransform: 'lowercase' }}>{translate.participants}</span> </div>

						}
					</div>
				}
			</GridItem>
			<GridItem xs={8} md={4} lg={4}>
				<TextInput
					adornment={<Icon>search</Icon>}
					floatingText={' '}
					type="text"
					value={state.filterText}
					onChange={event => {
						props.updateFilterText(event.target.value);
					}}
				/>
			</GridItem>

			<div style={{ width: '100%' }}>
				{!data.agendaVotings ? (
					<LoadingSection />
				) : data.agendaVotings.list.length > 0 ? (
					isMobile ?
						<React.Fragment>
							{votings.map(vote => (
								<Card key={vote.id} style={{ marginBottom: '1em', fontSize: '0.9em' }}>
									<CardContent>
										{renderParticipantInfo(vote)}
										<div>
											{translate.votes}:
											{vote.numParticipations > 0 ? `${showNumParticipations(vote.numParticipations, props.company, props.council.statute)} ${printPercentage(vote.numParticipations)}` : 0}
											{!!vote.representing
												&& `${vote.numParticipations > 0 ? `${showNumParticipations(vote.numParticipations, props.company, props.council.statute)}${printPercentage(vote.numParticipations)}` : 0}`
											}
										</div>
										<div style={{ marginLeft: '-5px' }}>
											{vote.author.numParticipations === 0 && vote.representing && vote.representing[0].author.numParticipations === 0 ?
												'-'
												: <div
													style={{
														display: 'flex',
														flexDirection: 'row',
														alignItems: 'center',
														fontSize: '0.8rem'
													}}
												>
													{vote.delegateId && vote.author.state !== PARTICIPANT_STATES.REPRESENTATED ?
														translate.customer_delegated
														: <React.Fragment>
															{renderVotingMenu(vote)}
														</React.Fragment>
													}
												</div>
											}
										</div>
									</CardContent>
								</Card>
							))}
						</React.Fragment>
						: <React.Fragment>
							<Table
								style={{ width: '100%' }}
								forceMobileTable={true}
								headers={[
									(agenda.presentCensus > 0
										&& !isCustomPoint(agenda.subjectType)
										&& !isConfirmationRequest(agenda.subjectType)
										&& props.council.councilType !== 3) ?
										{
											name:
												<SelectAllMenu
													translate={translate}
													agenda={agenda}
													refetch={refreshTable}
												/>
										} : { name: '' },
									{ name: translate.participant_data },
									{ name: isConfirmationRequest(agenda.subjectType) ? '' : translate.votes }
								]}
							>
								{votings.map(vote => (
									<TableRow key={`vote_${vote.id}`}>
										<TableCell style={{ fontSize: '0.95em' }}>
											{vote.author.numParticipations === 0 && vote.representing && vote.representing[0].author.numParticipations === 0 ?
												'-'
												: <div
													style={{
														display: 'flex',
														flexDirection:
															'row',
														alignItems: 'center',
													}}
												>
													{vote.delegateId && vote.author.state !== PARTICIPANT_STATES.REPRESENTATED ?
														translate.customer_delegated
														: <React.Fragment>
															{renderVotingMenu(vote)}
														</React.Fragment>
													}
												</div>
											}
										</TableCell>
										<TableCell style={{ fontSize: '0.95em' }}>
											{renderParticipantInfo(vote)}
										</TableCell>
										{!isConfirmationRequest(agenda.subjectType)
											&& <TableCell style={{ fontSize: '0.95em' }}>
												{(vote.author.state !== PARTICIPANT_STATES.REPRESENTATED) ?
													(vote.numParticipations > 0 ? `${showNumParticipations(vote.numParticipations, props.company, props.council.statute)} ${printPercentage(vote.numParticipations)}` : '-')
													: vote.authorRepresentative.numParticipations > 0 ? `${showNumParticipations(vote.authorRepresentative.numParticipations, props.company, props.council.statute)} ${printPercentage(vote.authorRepresentative.numParticipations)}` : '-'
												}

												<React.Fragment>
													{!!vote.delegatedVotes
														&& vote.delegatedVotes.filter(item => item.author.state === PARTICIPANT_STATES.REPRESENTATED).map(delegatedVote => (
															<React.Fragment key={`delegatedVote_${delegatedVote.id}`}>
																<br />
																{`${delegatedVote.author.numParticipations > 0 ? `${showNumParticipations(delegatedVote.numParticipations, props.company, props.council.statute)} ${printPercentage(delegatedVote.numParticipations)}` : '-'}`}
															</React.Fragment>
														))
													}
												</React.Fragment>
												<React.Fragment>
													{!!vote.delegatedVotes
														&& vote.delegatedVotes.slice(0, 10).filter(item => item.author.state !== PARTICIPANT_STATES.REPRESENTATED).map(delegatedVote => (
															<React.Fragment key={`delegatedVote_${delegatedVote.id}`}>
																<br />
																{`${delegatedVote.author.numParticipations > 0 ? `${showNumParticipations(delegatedVote.author.numParticipations, props.company, props.council.statute)}  ${printPercentage(delegatedVote.author.numParticipations)}` : 0}`}
															</React.Fragment>
														))
													}
												</React.Fragment>
											</TableCell>
										}

									</TableRow>
								))}
							</Table>
							<div
								style={{
									width: '90%',
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-between',
									marginTop: '1em',
									paddinRight: '10em'
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
};

const RemoveRemoteVoteAlert = ({
	translate, open, requestClose, vote, ...props
}) => {
	const body = () => (
		<div>
			{translate.void_remote_vote_warning}
		</div>
	);

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
	);
};


const PrivateVotingDisplay = compose(
	graphql(gql`
		mutation TogglePresentVote($votingId: Int!){
			togglePresentVote(votingId: $votingId){
				success
			}
		}
	`, {
		name: 'togglePresentVote'
	}),
	graphql(gql`
		mutation cancelRemoteVote($votingId: Int!){
			cancelRemoteVote(votingId: $votingId){
				success
			}
		}
	`, {
		name: 'cancelRemoteVote'
	})
)(({
	translate, agenda, vote, refetch, togglePresentVote, cancelRemoteVote, council
}) => {
	const [loading, setLoading] = React.useState(false);
	const [modal, setModal] = React.useState(false);

	const closeModal = () => {
		setModal(false);
	};

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
		const votingTimeout = setTimeout(() => {
			setLoading(false);
			clearTimeout(votingTimeout);
			if (modal) {
				setModal(false);
			}
		}, 1500);
	};

	const toggleVote = () => {
		setLoading(true);
		if (vote.vote === 3) {
			setModal(true);
			setLoading(false);
			return;
		}
		setVoting();
	};

	//

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
						<div style={{
							width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'flex-start'
						}}>
							<div>
								<LoadingSection size={16} />
							</div>
						</div>
						: vote.vote === 3 && council.presentVoteOverwrite === 1 ?
							<div onClick={toggleVote} style={{ cursor: 'pointer' }}>
								<i className="fa fa-times" style={{ marginRight: '1em' }} />
								{translate.vote_remote_vote}
							</div>
							: <Checkbox
								label={vote.vote === -1 ?
									translate.mark_voted_in_person
									: vote.vote === -3 ?
										`${translate.remote_vote_voided} - ${translate.voted_in_person}`
										: translate.voted_in_person
								}
								onChange={toggleVote}
								loading={loading}
								value={vote.vote === -2 || vote.vote === -3}
							/>
					}
				</React.Fragment>
				: council.councilType === 3 ?
					<React.Fragment>
						{loading ?
							<div style={{
								width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'flex-start'
							}}>
								<div>
									<LoadingSection size={16} />
								</div>
							</div>
							: vote.vote === 3 && council.presentVoteOverwrite === 1 ?
								<div onClick={toggleVote} style={{ cursor: 'pointer' }}>
									<i className="fa fa-times" style={{ marginRight: '1em' }} />
									{'Anular voto telemático'}
								</div>
								: vote.vote === -1 ?
									'No ha votado presencialmente'
									: vote.vote === -3 ?
										'Voto remoto anulado - Ha votado presencialmente'
										: 'Ha votado presencialmente'
						}
					</React.Fragment>
					: <React.Fragment>
						{vote.vote !== -1 ?
							translate.has_voted
							: translate.no_vote_lowercase
						}
					</React.Fragment>
			}
		</React.Fragment>
	);
});


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
})(({
	agenda, setAllPresentVotings, refetch, translate
}) => {
	const [loading, setLoading] = React.useState(false);

	const setAllPresents = async vote => {
		setLoading(true);

		await setAllPresentVotings({
			variables: {
				agendaId: agenda.id,
				vote
			}
		});

		refetch();

		setLoading(false);
	};

	return (
		<DropDownMenu
			color="transparent"
			Component={() => <div style={{ cursor: 'pointer' }}>
				{translate.set_presents_as}: {loading && <LoadingSection size={10} />}
			</div>
			}
			type="flat"
			items={
				<React.Fragment>
					<MenuItem onClick={() => setAllPresents(VOTE_VALUES.POSITIVE)}>
						{translate.in_favor_btn}
					</MenuItem>
					<MenuItem onClick={() => setAllPresents(VOTE_VALUES.NEGATIVE)}>
						{translate.against_btn}
					</MenuItem>
					<MenuItem onClick={() => setAllPresents(VOTE_VALUES.ABSTENTION)}>
						{translate.abstention_btn}
					</MenuItem>
				</React.Fragment>
			}
		/>
	);
});

const regularCardStyle = {
	cardTitle: {
		fontSize: '1em',
	},
};

VotingsTable.propTypes = {
	classes: PropTypes.object.isRequired,
	cardTitle: PropTypes.node,
};

export default withStyles(regularCardStyle)(withSharedProps()(VotingsTable));
