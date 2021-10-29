import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton, Grid, GridItem } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import VoteConfirmationModal from './VoteConfirmationModal';
import { VotingContext } from './AgendaNoSession';
import { voteAllAtOnce } from '../../../utils/CBX';
import { ConfigContext } from '../../../containers/AppControl';
import { isMobile } from '../../../utils/screen';
import * as CBX from '../../../utils/CBX';
import { AGENDA_STATES, VOTE_VALUES } from '../../../constants';
import VoteSuccessMessage from './VoteSuccessMessage';


const styles = {
	division: {
		display: 'flex',
		alignItems: 'center',
		marginTop: '.5em'
	},
	divisionM: {
		display: 'flex',
		alignItems: 'center',
		marginTop: '.5em'
	}
};

const VotingMenu = ({
	translate, singleVoteMode, agenda, council, votings, client, disabledColor, hasSession, ...props
}) => {
	const [loading, setLoading] = React.useState(false);
	const config = React.useContext(ConfigContext);
	const [modal, setModal] = React.useState(false);
	const [vote, setVote] = React.useState(-1);
	const primary = getPrimary();
	const votingContext = React.useContext(VotingContext);
	const voteAtTheEnd = voteAllAtOnce({ council });
	const freezed = React.useRef(false);
	let fixed;

	if (props.ownVote) {
		fixed = props.ownVote.fixed;
	}

	const handleFreezing = (newVote, previousVote) => {
		const ownParticipations = agenda.votings.reduce((acc, curr) => acc + curr.numParticipations, 0);
		const getFieldByValue = value => {
			switch (value) {
				case 0: return 'negativeVotings';
				case 1: return 'positiveVotings';
				case 2: return 'abstentionVotings';
				case -1: return 'noVoteVotings';
				default: return 'noVoteVotings';
			}
		};

		const freezedRecount = {
			...agenda.votingsRecount,
			...freezed.current
		};
		freezedRecount[getFieldByValue(newVote)] += ownParticipations;
		freezedRecount[getFieldByValue(previousVote)] -= ownParticipations;
		freezed.current = freezedRecount;
	};

	React.useEffect(() => {
		let timeout;
		if (freezed.current) {
			timeout = setTimeout(() => {
				freezed.current = null;
			}, 8000);
		}
		return () => clearTimeout(timeout);
	}, [freezed.current]);

	const setAgendaVoting = newVote => {
		if (props.ownVote) {
			votingContext.responses.set(props.ownVote.id, newVote);
			votingContext.setResponses(new Map(votingContext.responses));
		}
	};

	const closeModal = () => {
		setModal(false);
		setVote(-1);
	};


	const buildRecountText = newRecount => {
		const showRecount = ((CBX.getAgendaTypeLabel(agenda) !== 'private_votation'
			&& council.statute.hideVotingsRecountFinished === 0) || agenda.votingState === AGENDA_STATES.CLOSED) && !config.hideRecount;

		return (
			showRecount ?
				` (${translate.recount}: ${newRecount})`
				:
				''
		);
	};

	const updateAgendaVoting = async newVote => {
		if (loading !== false) {
			return;
		}

		setLoading(newVote);
		const previousVote = props.ownVote.vote;

		const response = await Promise.all(agenda.votings.map(voting => props.updateAgendaVoting({
			variables: {
				agendaVoting: {
					id: voting.id,
					vote: newVote,
				}
			}
		})));

		if (response[0].data.updateAgendaVoting && response[0].data.updateAgendaVoting.success) {
			handleFreezing(newVote, previousVote);
			await props.refetch();
			setModal(false);
			setLoading(false);
			props.close();
		} else {
			setLoading(false);
		}
	};

	const getSelected = value => {
		if (props.ownVote) {
			return voteAtTheEnd ? votingContext.responses.get(props.ownVote.id) === value : props.ownVote.vote === value;
		}
	};

	let voteDenied = false;
	let denied = [];


	if (config.denyVote && agenda.votings.length > 0) {
		denied = agenda.votings.filter(voting => voting.author.voteDenied);


		if (denied.length === agenda.votings.length) {
			voteDenied = true;
		}
	}

	const disabled = fixed || !props.ownVote;

	return (
		<Grid
			style={{
				width: '100%',
				backgroundColor: 'white',
				display: 'flex',
				flexDirection: 'row'
			}}
		>
			{voteDenied &&
				<DeniedDisplay translate={translate} denied={denied} />
			}
			{(props.ownVote && props.ownVote.fixed) &&
				<>
					{props.ownVote.numParticipations === 0 ?
						translate.cant_vote_this_point
						:
						translate.participant_vote_fixed
					}
				</>
			}
			<VotingButton
				text={
					!hasSession ?
						translate.in_favor_btn
						:
						translate.in_favor_btn +
						buildRecountText(
							CBX.showNumParticipations(
								freezed.current ? freezed.current.positiveVotings + agenda.votingsRecount.positiveManual :
									agenda.votingsRecount.positiveVotings + agenda.votingsRecount.positiveManual,
								council.company,
								council.statute
							)
						)
				}
				agenda={agenda}
				translate={translate}
				vote={props.ownVote}
				loading={loading === 1}
				disabledColor={disabledColor}
				disabled={disabled}
				selected={getSelected(1)}
				icon={<i className="fa fa-check" aria-hidden="true" style={{ marginLeft: '0.2em', color: getSelected(1) ? primary : 'silver' }}></i>}
				onClick={() => {
					if (voteAtTheEnd) {
						setAgendaVoting(1);
					} else {
						updateAgendaVoting(1);
					}
				}}
			/>
			<VotingButton
				text={
					!hasSession ?
						translate.against_btn
						:
						translate.against_btn +
						buildRecountText(
							CBX.showNumParticipations(
								freezed.current ? freezed.current.negativeVotings + agenda.votingsRecount.negativeManual :
									agenda.votingsRecount.negativeVotings + agenda.votingsRecount.negativeManual,
								council.company,
								council.statute
							)
						)
				}
				agenda={agenda}
				translate={translate}
				vote={props.ownVote}
				loading={loading === 0}
				disabledColor={disabledColor}
				disabled={disabled}
				selected={getSelected(0)}
				icon={<i className="fa fa-times" aria-hidden="true" style={{ marginLeft: '0.2em', color: getSelected(0) ? primary : 'silver' }}></i>}
				onClick={() => {
					if (voteAtTheEnd) {
						setAgendaVoting(0);
					} else {
						updateAgendaVoting(0);
					}
				}}
			/>

			{!config.hideAbstentionButton &&
				<VotingButton
					text={
						!hasSession ?
							translate.abstention_btn
							:
							translate.abstention_btn +
							buildRecountText(
								CBX.showNumParticipations(
									freezed.current ? freezed.current.abstentionVotings + agenda.votingsRecount.abstentionManual :
										agenda.votingsRecount.abstentionVotings + agenda.votingsRecount.abstentionManual,
									council.company,
									council.statute
								)
							)
					}
					agenda={agenda}
					translate={translate}
					vote={props.ownVote}
					loading={loading === 2}
					disabledColor={disabledColor}
					disabled={disabled}
					icon={<i className="fa fa-circle-o" aria-hidden="true" style={{ marginLeft: '0.2em', color: getSelected(2) ? primary : 'silver' }}></i>}
					selected={getSelected(2)}
					onClick={() => {
						if (voteAtTheEnd) {
							setAgendaVoting(2);
						} else {
							updateAgendaVoting(2);
						}
					}}
				/>
			}
			{!config.hideNoVoteButton &&
				<VotingButton
					text={
						!hasSession ?
							translate.dont_vote
							:
							translate.dont_vote +
							buildRecountText(
								CBX.showNumParticipations(
									freezed.current ? freezed.current.noVoteVotings + agenda.votingsRecount.noVoteManual :
										agenda.votingsRecount.noVoteVotings + agenda.votingsRecount.noVoteManual,
									council.company,
									council.statute
								)
							)
					}
					agenda={agenda}
					translate={translate}
					vote={props.ownVote}
					loading={loading === -1}
					disabled={disabled}
					disabledColor={disabledColor}
					selected={getSelected(-1)}
					onClick={() => {
						if (voteAtTheEnd) {
							setAgendaVoting(-1);
						} else {
							updateAgendaVoting(-1);
						}
					}}
				/>
			}
			{voteAtTheEnd &&
				<VoteConfirmationModal
					open={modal}
					requestClose={closeModal}
					translate={translate}
					acceptAction={() => updateAgendaVoting(vote)}
				/>
			}
		</Grid>
	);
};

export const DeniedDisplay = ({ denied }) => (
	<div style={{ marginTop: '1em' }}>
		{denied.map(deniedVote => (
			<React.Fragment key={`denied_vote_${deniedVote.id}`}>
				<br />
				{`${deniedVote.author.name} ${deniedVote.author.surname || ''} ${deniedVote.author.voteDeniedReason ? `: ${deniedVote.author.voteDeniedReason}` : ''}`}
			</React.Fragment>
		))}

	</div>
);

export const VotingButton = ({
	onClick,
	text,
	selected = false,
	customAccent = true,
	icon,
	loading,
	onChange,
	disabled,
	selectedCheckbox = false,
	styleButton,
	color,
	id = '',
	disabledColor,
	vote,
	translate,
	agenda
}) => {
	const primary = getPrimary();
	const features = React.useContext(ConfigContext);
	const highlighted = (selected || selectedCheckbox);

	const config = ((highlighted) && (vote && vote.vote !== VOTE_VALUES.NO_VOTE) && features.altSelectedOption && customAccent) ? {
		text: <div style={{ padding: '0.6em', width: '100%' }}>
			{text}
			<hr style={{ borderTop: '1px solid white' }} />
			{(vote && agenda) &&
				<VoteSuccessMessage
					vote={vote}
					agenda={agenda}
					color="white"
					translate={translate}
				/>
			}
		</div>,
		color: primary,
		textStyle: {
			color: 'white',
			fontWeight: '700',
		},
		buttonStyle: {
			width: '100%',
			whiteSpace: 'pre-wrap',
			border: highlighted && `2px solid ${primary}`,
			...styleButton,
		}
	} : {
		text,
		color: color || (disabledColor ? 'gainsboro' : 'white'),
		textStyle: {
			color: '#000000de',
			fontWeight: '700',
		},
		buttonStyle: {
			width: '100%',
			whiteSpace: 'pre-wrap',
			border: highlighted && `2px solid ${primary}`,
			...styleButton,
		}
	};

	return (
		<GridItem xs={12} md={12} lg={12} style={isMobile ? styles.divisionM : styles.division}>
			<BasicButton
				text={config.text}
				color={config.color}
				disabled={disabled || disabledColor || selected}
				loading={loading}
				loadingColor={primary}
				icon={icon}
				id={id}
				textStyle={config.textStyle}
				buttonStyle={config.buttonStyle}
				onClick={onClick}
				onChange={onChange}
			/>
		</GridItem>
	);
};

const updateAgendaVoting = gql`
    mutation UpdateAgendaVoting($agendaVoting: AgendaVotingInput!){
        updateAgendaVoting(agendaVoting: $agendaVoting){
            success
            message
        }
    }
`;

export default graphql(updateAgendaVoting, {
	name: 'updateAgendaVoting'
})(withApollo(VotingMenu));
