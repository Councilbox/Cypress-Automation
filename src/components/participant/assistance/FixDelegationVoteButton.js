import React from 'react';
import { BasicButton } from '../../../displayComponents';
import { PARTICIPANT_STATES } from '../../../constants';
import EarlyVoteModal from './EarlyVoteModal';
import { getSecondary } from '../../../styles/colors';

const FixDelegationVoteButton = ({
	translate, setState, state, council, participant
}) => {
	const [modal, setModal] = React.useState(false);
	const secondary = getSecondary();

	return (
		<>
			<BasicButton
				text={translate.indicate_vote_sense}
				onClick={() => setModal(true)}
				color='white'
				textStyle={{
					color: secondary
				}}
				type="flat"
				buttonStyle={{
					marginLeft: '1em',
					border: `1px solid ${secondary}`
				}}
			/>
			<EarlyVoteModal
				open={modal}
				setState={setState}
				acceptState={PARTICIPANT_STATES.DELEGATED}
				translate={translate}
				state={state}
				requestClose={() => setModal(false)}
				council={council}
				participant={participant}

			/>
		</>
	);
};

export default FixDelegationVoteButton;
