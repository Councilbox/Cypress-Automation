import { Button } from 'material-ui';
import React from 'react';
import { getPrimary } from '../../../styles/colors';
import { isConfirmationRequest } from '../../../utils/CBX';
import { moment } from '../../../containers/App';


const VoteSuccessMessage = ({ vote, translate, agenda, color = getPrimary() }) => {
	const voteValue = vote?.vote;
	const [transition, setTransition] = React.useState(false);
	const oldVote = React.useRef(voteValue);

	React.useEffect(() => {
		if (voteValue !== oldVote.current) {
			oldVote.current = voteValue;
			setTransition(voteValue);
		}
	}, [voteValue]);

	return (
		(vote && vote.vote !== -1) ?
			<Button
				disableRipple
				disabled
				disableFocusRipple
				style={{
					textTransform: 'none',
					fontStyle: 'italic',
					fontSize: '12px',
					color,
					fontWeight: '700'
				}}
			>
				<GrowingIcon
					transition={transition !== false}
					key={transition}
				/>
				{isConfirmationRequest(agenda.subjectType) ?
					`${translate.answer_registered} (${moment(vote.date).format('LLL')})`
					:
					`${translate.vote_registered} (${moment(vote.date).format('LLL')})`
				}
			</Button>
			:
			null
	);
};

const GrowingIcon = ({ transition }) => {
	const [mounted, setMounted] = React.useState(!transition);

	React.useLayoutEffect(() => {
		const timeout = setTimeout(() => {
			setMounted(true);
		}, 100);
		return () => clearTimeout(timeout);
	}, []);

	return (
		<span
			className="material-icons"
			style={{
				fontSize: mounted ? '24px' : 0,
				webkitTransition: 'font-size 2s',
				mozTransition: 'font-size 2s',
				oTransition: 'font-size 2s',
				transition: 'font-size 2s'
			}}>
			how_to_vote
		</span>
	);
};

export default VoteSuccessMessage;
