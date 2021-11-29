import React from 'react';
import { Paper } from 'material-ui';
import { Checkbox } from '.';
import { delegatedVotesLimitReached } from '../utils/CBX';
import withTranslations from '../HOCs/withTranslations';

const ParticipantRow = ({
	participant, onClick, checkBox, toDelegate, council, selected, onChange, stylesPaper, translate, clases, id = '', order
}) => {
	let limitReached = null;
	if (toDelegate) {
		limitReached = delegatedVotesLimitReached(council.statute, participant.delegatedVotes.filter(p => p.type !== 3).length);
	}
	return (
		<Paper
			style={{
				display: 'flex',
				cursor: 'pointer',
				...stylesPaper,
				marginBottom: '1em',
				padding: '0.5em 1em',
				marginRight: '2em',

			}}
		>
			{checkBox
				&& <Checkbox
					value={selected}
					onChange={onChange}
				/>
			}
			<div
				onClick={toDelegate ? !limitReached ? onClick : () => { } : onClick}
				style={{
					width: '100%',
					backgroundColor: `${toDelegate ? !limitReached ? 'transparent' : 'gainsboro' : 'transparent'}`
				}}
				id={id}
			>
				<div
					style={{
						fontSize: '0.9rem',
						color: 'black'
					}}
					className={clases}
				>
					{order === 'surname' ?
						`${participant.surname ? `${participant.surname},` : ''} ${participant.name} ${toDelegate && limitReached ? ` - ${translate.cant_delegate_more}` : ''}`
						:
						`${participant.name} ${participant.surname || ''} ${toDelegate && limitReached ? ` - ${translate.cant_delegate_more}` : ''}`
					}
				</div>
				{toDelegate && participant.assistanceIntention === 6
					&& <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>{translate.participant_wont_attend}</div>
				}
			</div>
		</Paper>
	);
};

export default withTranslations()(ParticipantRow);

