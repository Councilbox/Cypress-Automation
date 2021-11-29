import React from 'react';
import { BasicButton, AlertConfirm } from '../../../displayComponents';
import ActHTML from '../../council/writing/actViewer/ActHTML';
import * as CBX from '../../../utils/CBX';
import { getSecondary } from '../../../styles/colors';
import AttachmentDownload from '../../attachments/AttachmentDownload';
import { PARTICIPANT_TYPE } from '../../../constants';
import VotingSection from './VotingSection';
import CustomPointVotingMenu from './CustomPointVotingMenu';
import { isMobile } from '../../../utils/screen';
import ConfirmationRequestMenu from './ConfirmationRequestMenu';
import { useOldState } from '../../../hooks';
import { ConfigContext } from '../../../containers/AppControl';

const participantWithVote = participant => (
	participant.type === PARTICIPANT_TYPE.PARTICIPANT
		&& participant.numParticipations > 0
);

const representativeWithVote = participant => (
	participant.type === PARTICIPANT_TYPE.REPRESENTATIVE
	// && !!participant.delegatedVotes?.find(vote => vote.numParticipations > 0)
);

export const checkHasVotingRights = participant => {
	return (participantWithVote(participant) || representativeWithVote(participant));
};


const AgendaMenu = ({ agenda, translate, council, participant, refetch }) => {
	const [state, setState] = useOldState({
		voting: true,
		open: false,
		showModal: false,
		reopen: false
	});
	const config = React.useContext(ConfigContext);

	const toggle = () => {
		setState({
			open: !state.open
		});
	};

	const activateVoting = () => {
		if (state.voting) {
			toggle();
		} else if (state.open) {
			setState({
				open: false,
				reopen: true
			});
		} else {
			setState({
				open: true,
				voting: true
			});
		}
	};

	const shouldDisplayVotingMenu = () => {
		if (participant.type === PARTICIPANT_TYPE.GUEST) {
			return false;
		}

		if (config.hideVotingButtons) {
			return CBX.agendaVotingsOpened(agenda);
		}

		return CBX.hasVotation(agenda.subjectType);
	};

	const secondary = getSecondary();
	let ownVote = CBX.findOwnVote(agenda.votings, participant);

	if (!ownVote || (ownVote.fixed && ownVote.numParticipations === 0)) {
		ownVote = checkVotings(agenda.votings, participant) || ownVote;
	}

	return (
		<div>
			{agenda.attachments &&
				agenda.attachments.filter(attachment => attachment.state !== 2).map(attachment => <AttachmentDownload attachment={attachment} key={`attachment_${attachment.id}`} agenda />)
			}
			{(shouldDisplayVotingMenu()) &&
				<>
					{(agenda.subjectType === CBX.getActPointSubjectType() && CBX.agendaVotingsOpened(agenda)) &&
						<BasicButton
							text={translate.show_act_draft}
							textStyle={{ color: secondary, fontWeight: '700' }}
							buttonStyle={{ border: `2px solid ${secondary}`, marginBottom: '1.2em' }}
							color={'white'}
							onClick={() => setState({
								showModal: true
							})}
						/>
					}
					{CBX.agendaVotingsOpened(agenda) &&
						<>
							{ownVote ?
								ownVote.delegateId && (ownVote.delegateId !== participant.id) &&
									translate.your_vote_is_delegated
								:
								!(checkHasVotingRights(participant)) && translate.cant_exercise_vote
							}
						</>
					}
					<>
						{CBX.isCustomPoint(agenda.subjectType) &&
							<CustomPointVotingMenu
								agenda={agenda}
								refetch={refetch}
								ownVote={ownVote}
								cantVote={!(CBX.agendaVotingsOpened(agenda) && checkVotings(agenda.votings, participant))}
								council={council}
								translate={translate}
							/>
						}
						{CBX.isConfirmationRequest(agenda.subjectType) &&
							<ConfirmationRequestMenu
								disabledColor={!(CBX.agendaVotingsOpened(agenda) && checkVotings(agenda.votings, participant))}
								agenda={agenda}
								ownVote={ownVote}
								open={state.open}
								council={council}
								voting={state.voting}
								translate={translate}
								activateVoting={activateVoting}
								refetch={refetch}
								toggle={toggle}
								hasSession={CBX.councilHasSession(council)}
							/>
						}
						{(!CBX.isCustomPoint(agenda.subjectType) && !CBX.isConfirmationRequest(agenda.subjectType)) &&
							<VotingSection
								disabledColor={!(CBX.agendaVotingsOpened(agenda) && checkVotings(agenda.votings, participant))}
								agenda={agenda}
								ownVote={ownVote}
								open={state.open}
								council={council}
								voting={state.voting}
								translate={translate}
								activateVoting={activateVoting}
								refetch={refetch}
								toggle={toggle}
								hasSession={CBX.councilHasSession(council)}
							/>
						}
					</>
				</>
			}
			<AlertConfirm
				requestClose={() => setState({ showModal: false })}
				open={state.showModal}
				acceptAction={() => setState({ showModal: false })}
				buttonAccept={translate.accept}
				PaperProps={isMobile ? {
					style: {
						width: '100vw',
						margin: '0'
					}
				} : {}}
				bodyText={
					<div>
						<ActHTML
							council={council}
						/>
					</div>
				}
				title={translate.edit}
			/>
		</div>
	);
};

const checkVotings = (votings, participant) => (
	votings.find(voting => (voting.numParticipations > 0 &&
		!voting.fixed && (!voting.delegateId || voting.delegateId === participant.id)))
);

export default AgendaMenu;
