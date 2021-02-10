import React from 'react';
import { graphql } from 'react-apollo';
import { MenuItem, Tooltip } from 'material-ui';
import { CircularProgress } from 'material-ui/Progress';
import { VOTE_VALUES } from '../../../../constants';
import { agendaVotingsOpened, getActiveVote } from '../../../../utils/CBX';
import VotingValueIcon from './VotingValueIcon';
import { updateAgendaVoting as updateAgendaVotingMutation } from '../../../../queries/agenda';
import withTranslations from '../../../../HOCs/withTranslations';

const PresentVoteMenu = ({ agenda, agendaVoting, ...props }) => {
	const [loading, setLoading] = React.useState(false);
	const [fixedAlert, setFixedAlert] = React.useState(false);

	const vote = getActiveVote(agendaVoting);

	const checkFixed = () => agendaVoting.fixed && agendaVoting.delegatedVotes.filter(item => !item.fixed).length === 0;

	const fixed = checkFixed();

	const active = vote ? vote.vote : null;

	const updateAgendaVoting = async value => {
		setLoading(value);

		await props.updateAgendaVoting({
			variables: {
				agendaVoting: {
					id: agendaVoting.id,
					vote: value
				}
			}
		});

		setLoading(false);
		props.refetch();
	};

	const block = (value, enabled) => {
		if (!agendaVotingsOpened(agenda)) {
			if (!enabled) {
				return <span />;
			}
		}

		return (
			<div
				style={{
					height: '1.75em',
					width: '1.75em',
					marginRight: '0.2em',
					border: `2px solid ${'grey'}`,
					borderRadius: '3px',
					display: 'flex',
					cursor: 'pointer',
					alignItems: 'center',
					justifyContent: 'center'
				}}
				onClick={() => (fixed ? setFixedAlert(!fixedAlert) : updateAgendaVoting(value))}
			>
				<MenuItem
					selected={active}
					disabled={fixed}
					style={{
						display: 'flex',
						fontSize: '0.9em',
						alignItems: 'center',
						justifyContent: 'center',
						height: '100%',
						width: '100%',
						padding: 0,
						margin: 0
					}}
				>
					{loading === value ?
						<CircularProgress size={12} thickness={7} color={'primary'} style={{ marginBottom: '0.35em' }} />
						:						<VotingValueIcon
							vote={value}
							color={active ? undefined : 'grey'}
						/>
					}
				</MenuItem>
			</div>
		);
	};

	return (
		<Tooltip title={agendaVoting.numParticipations === 0 ? props.translate.cant_vote_this_point : props.translate.participant_vote_fixed} open={fixedAlert}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					marginRight: '0.7em'
				}}
			>
				{agendaVoting.author.voteDenied ? // TRADUCCION
					<React.Fragment>
						<Tooltip title={agendaVoting.author.voteDeniedReason}>
							<div>Derecho a voto denegado</div>
						</Tooltip>
					</React.Fragment>

					:					<React.Fragment>
						{block(VOTE_VALUES.POSITIVE, active === VOTE_VALUES.POSITIVE)}
						{block(VOTE_VALUES.NEGATIVE, active === VOTE_VALUES.NEGATIVE)}
						{block(VOTE_VALUES.ABSTENTION, active === VOTE_VALUES.ABSTENTION)}
					</React.Fragment>
				}
			</div>
		</Tooltip>
	);
};


export default graphql(updateAgendaVotingMutation, {
	name: 'updateAgendaVoting'
})(withTranslations()(PresentVoteMenu));
