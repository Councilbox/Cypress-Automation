import React from "react";
import { Checkbox } from './';
import { delegatedVotesLimitReached } from '../utils/CBX';
import { Paper } from 'material-ui';
import withTranslations from "../HOCs/withTranslations";

const ParticipantRow = ({ participant, onClick, checkBox, toDelegate, council, selected, onChange, stylesPaper, translate, clases }) => {
	let limitReached = null;
	if (toDelegate) {
		limitReached = delegatedVotesLimitReached(council.statute, participant.delegatedVotes.filter(p => p.type !== 3).length);
	}
	return (
		<Paper style={{margin: "0 auto", display: 'flex', flexDirection: 'row', width: '99%', marginTop: '0.2em', padding: '0.3em', paddingLeft: '0.5em', cursor: 'pointer', ...stylesPaper, marginBottom: "1em" }}>
			{checkBox &&
				<Checkbox
					value={selected}
					onChange={onChange}
				/>
			}
			<div
				onClick={toDelegate ? !limitReached ? onClick : () => { } : onClick}
				style={{
					width: "100%",
					padding: "0.4em",
					paddingLeft: "0.8em",
					backgroundColor: `${toDelegate ? !limitReached ? 'transparent' : 'gainsboro' : 'transparent'}`,
					display: "flex",
					flexDirection: "column"
				}}
			>
				<div
					style={{
						fontWeight: "700",
						fontSize: "0.9rem"
					}}
					className={clases}
				>
					{`${participant.name} ${participant.surname} ${toDelegate && limitReached ? ` - ${translate.cant_delegate_more}` : ''}`}
				</div>
				{toDelegate && participant.assistanceIntention === 6 &&
					<div style={{ fontSize: "0.9rem", fontWeight: '700' }}>{translate.participant_wont_attend}</div>
				}
			</div>
		</Paper>
	);
}

export default withTranslations()(ParticipantRow);

