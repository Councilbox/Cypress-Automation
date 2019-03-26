import React from "react";
import { Checkbox } from './';
import { delegatedVotesLimitReached } from '../utils/CBX';
import { Paper } from 'material-ui';

const ParticipantRow = ({ participant, onClick, checkBox, toDelegate, council, selected, onChange, stylesPaper }) => {
	/*TRADUCCION*/
	let limitReached = null;
	if (toDelegate) {
		limitReached = delegatedVotesLimitReached(council.statute, participant.delegatedVotes.length);
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
				>
					{`${participant.name} ${participant.surname} ${toDelegate && limitReached ? ' - NO SE PUEDEN DELEGAR MÁS VOTOS EN ESTE PARTICIPANTE' : ''}`}
				</div>
				{toDelegate && participant.assistanceIntention === 6 &&
					<div style={{ fontSize: "0.9rem", fontWeight: '700' }}>Ha marcado que posiblemente no asista</div>
				}
			</div>
		</Paper>
	);
}

export default ParticipantRow;

