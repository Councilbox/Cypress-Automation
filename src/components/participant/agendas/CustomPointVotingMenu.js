import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { AGENDA_TYPES, AGENDA_STATES } from '../../../constants';
import { VotingButton, DeniedDisplay } from './VotingMenu';
import { VotingContext } from './AgendaNoSession';
import {
	agendaPointOpened, councilHasSession, getAgendaTypeLabel, removeTypenameField, showNumParticipations, voteAllAtOnce
} from '../../../utils/CBX';
import { ConfigContext } from '../../../containers/AppControl';

const createSelectionsFromBallots = (ballots = [], participantId) => ballots
	.filter(ballot => ballot.participantId === participantId)
	.map(ballot => ({
		id: ballot.itemId,
		value: ballot.value
	}));

const asbtentionOption = {
	id: -1,
	value: 'Abstention'
};

const CustomPointVotingMenu = ({
	agenda, translate, ownVote, council, updateCustomPointVoting, cantVote, ...props
}) => {
	const [selections, setSelections] = React.useState(ownVote ? createSelectionsFromBallots(ownVote.ballots, ownVote.participantId) : []); // (props.ownVote.ballots, props.ownVote.participantId));
	const votingContext = React.useContext(VotingContext);
	const config = React.useContext(ConfigContext);

	const disabled = agenda.votingState !== AGENDA_STATES.DISCUSSION || cantVote;

	const ownVoteId = ownVote ? ownVote.id : null;

	React.useEffect(() => {
		if (ownVoteId) {
			setSelections(createSelectionsFromBallots(ownVote.ballots, ownVote.participantId));
		} else {
			setSelections([]);
		}
	}, [ownVoteId]);

	const sendCustomAgendaVote = async selected => {
		if (voteAllAtOnce({ council })) {
			votingContext.responses.set(ownVote.id, selected);
			votingContext.setResponses(new Map(votingContext.responses));
		} else {
			await updateCustomPointVoting({
				variables: {
					selections: selected,
					votingId: ownVote.id
				}
			});
			await props.refetch();
		}
	};

	const buildRecountText = itemId => {
		if (!agenda.votingsRecount) {
			return '';
		}

		if (!councilHasSession(council)) return '';

		const showRecount = ((getAgendaTypeLabel(agenda) !== 'private_votation'
			&& council.statute.hideVotingsRecountFinished === 0) || agenda.votingState === AGENDA_STATES.CLOSED) && !config.hideRecount;

		return (
			showRecount ?
				` (${translate.recount}: ${agenda.votingsRecount[itemId] !== undefined ?
					showNumParticipations(agenda.votingsRecount[itemId], council.company, council.statute)
					: 0})`
				: ''
		);
	};

	const addSelection = item => {
		let newSelections = [...selections, removeTypenameField(item)];
		if (selections.length === 1) {
			if (selections[0].id === -1) {
				newSelections = [removeTypenameField(item)];
			}
		}
		setSelections(newSelections);
		if (newSelections.length >= agenda.options.minSelections) {
			sendCustomAgendaVote(newSelections);
		}
	};

	const getSelectedRadio = id => !!selections.find(selection => selection.id === id);

	const removeSelection = item => {
		const newSelections = selections.filter(selection => selection.id !== item.id);
		setSelections(newSelections);
		if (newSelections.length < agenda.options.minSelections) {
			return sendCustomAgendaVote([]);
		}
		return sendCustomAgendaVote(newSelections);
	};

	const setSelection = item => {
		setSelections([removeTypenameField(item)]);
		sendCustomAgendaVote([removeTypenameField(item)]);
	};

	const setAbstentionOption = () => {
		setSelections([asbtentionOption]);
		sendCustomAgendaVote([asbtentionOption]);
	};

	const resetSelections = () => {
		setSelections([]);
		sendCustomAgendaVote([]);
	};

	const getRemainingOptions = () => {
		if (selections.length === 1) {
			if (selections[0].id === -1) {
				return agenda.options.minSelections;
			}
		}
		return agenda.options.minSelections - selections.length;
	};

	if (ownVote && (ownVote.vote !== -1 && ownVote.ballots.length === 0 && agenda.subjectType === AGENDA_TYPES.CUSTOM_PRIVATE)) {
		// return 'Tu voto ha sido registrado en la apertura de votos anterior, para preservar el anonimato de los votos, los registrados antes del cierre no pueden ser cambiados';
	}

	let voteDenied = false;
	let denied = [];


	if (config.denyVote && (agenda.votings && agenda.votings.length > 0)) {
		denied = agenda.votings.filter(voting => voting.author.voteDenied);


		if (denied.length === agenda.votings.length) {
			voteDenied = true;
		}
	}

	const renderCommonButtons = () => {
		if (config.hideNoVoteButton || config.hideAbstentionButton) {
			return (
				<div style={{ paddingTop: '5px' }}>
					<div style={{ display: 'flex', width: '100%', height: '2.5em' }}>
						{(config.hideNoVoteButton && !config.hideAbstentionButton)
							&& <VotingButton
								text={`${translate.abstention_btn} ${buildRecountText('abstention')}`}
								disabled={disabled}
								disabledColor={disabled}
								vote={ownVote}
								agenda={agenda}
								translate={translate}
								styleButton={{ width: '100%' }}
								onClick={setAbstentionOption}
								selectedCheckbox={getSelectedRadio(-1)}
							/>
						}
						{(!config.hideNoVoteButton && config.hideAbstentionButton)
							&& <VotingButton
								text={`${translate.dont_vote} ${buildRecountText('noVote')}`}
								disabled={disabled}
								translate={translate}
								disabledColor={disabled}
								vote={ownVote}
								agenda={agenda}
								styleButton={{ width: '100%' }}
								selectedCheckbox={selections.length === 0}
								onClick={resetSelections}
							/>
						}
					</div>
				</div>
			);
		}

		return (
			<div style={{ paddingTop: '0px' }}>
				<div style={{ display: 'flex', width: '52.5%' }}>
					<VotingButton
						text={`${translate.abstention_btn} ${buildRecountText('abstention')}`}
						disabled={disabled}
						disabledColor={disabled}
						vote={ownVote}
						agenda={agenda}
						translate={translate}
						styleButton={{ width: '90%' }}
						onClick={setAbstentionOption}
						selectedCheckbox={getSelectedRadio(-1)}
					/>
					<VotingButton
						text={`${translate.dont_vote} ${buildRecountText('noVote')}`}
						disabled={disabled}
						vote={ownVote}
						agenda={agenda}
						customAccent={false}
						translate={translate}
						disabledColor={disabled}
						styleButton={{ width: '90%' }}
						selectedCheckbox={selections.length === 0 && ownVote?.vote === -1}
						onClick={resetSelections}
					/>
				</div>
			</div>
		);
	};

	if (voteDenied) {
		return (
			<DeniedDisplay translate={translate} denied={denied} />
		);
	}

	return (
		<div>
			{denied.length > 0
				&& 'Dentro de los votos depositados en usted, tiene votos denegados' //
			}
			{(ownVote && ownVote.fixed)
				&& <>
					{ownVote.numParticipations === 0 ?
						translate.cant_vote_this_point
						: translate.participant_vote_fixed
					}
				</>
			}
			{agenda.options.maxSelections === 1 ?
				<React.Fragment>
					{agenda.items.map((item, index) => (
						<React.Fragment key={`item_${item.id}`}>
							<div>
								<VotingButton
									disabled={disabled}
									disabledColor={disabled}
									vote={ownVote}
									agenda={agenda}
									translate={translate}
									styleButton={{ padding: '0', width: '100%' }}
									selectedCheckbox={getSelectedRadio(item.id)}
									onClick={() => setSelection(item)}
									text={`${item.value} ${buildRecountText(item.id)}`}
								/>
							</div>
							{agenda.items.length - 1 === index && renderCommonButtons()}
						</React.Fragment>
					))}
				</React.Fragment>
				: <React.Fragment>
					{agendaPointOpened(agenda)
						&& <div style={{ fontSize: '0.85em', textAlign: 'left' }}>
							{(selections.length < agenda.options.minSelections && agenda.options.minSelections > 1)
								&& <React.Fragment>{translate.need_select_more.replace('{{options}}', getRemainingOptions())}</React.Fragment>
							}
							{(agenda.options.maxSelections > 1)
								&& <React.Fragment>{translate.can_select_between_min_max
									.replace('{{min}}', agenda.options.minSelections)
									.replace('{{max}}', agenda.options.maxSelections)}
								</React.Fragment>
							}
						</div>
					}
					{agenda.items.map((item, index) => (
						<React.Fragment key={`item_${item.id}`}>
							<div >
								<VotingButton
									styleButton={{ padding: '0', width: '100%' }}
									disabledColor={disabled}
									vote={ownVote}
									agenda={agenda}
									translate={translate}
									selectedCheckbox={getSelectedRadio(item.id)}
									disabled={((agenda.options.maxSelections === selections.length) && (!getSelectedRadio(item.id) || disabled))}
									onClick={() => {
										if (!getSelectedRadio(item.id)) {
											addSelection(item);
										} else {
											removeSelection(item);
										}
									}}
									text={`${item.value} ${buildRecountText(item.id)}`}
								/>
							</div>
							{agenda.items.length - 1 === index && renderCommonButtons()}
						</React.Fragment>
					))}
				</React.Fragment>
			}
		</div>
	);
};


export const updateCustomPointVoting = gql`
	mutation updateCustomPointVoting($selections: [PollItemInput]!, $votingId: Int!){
		updateCustomPointVoting(selections: $selections, votingId: $votingId){
			success
		}
	}
`;

export default graphql(updateCustomPointVoting, {
	name: 'updateCustomPointVoting'
})(CustomPointVotingMenu);
