import React from "react";
import { Checkbox } from './';
import { delegatedVotesLimitReached } from '../utils/CBX';
import { Paper } from 'material-ui';

const ParticipantRow = ({ participant, onClick, checkBox, toDelegate, council, selected, onChange, stylesPaper }) => {

	let limitReached = null;
	if (toDelegate) {
		limitReached = delegatedVotesLimitReached(council.statute, participant.delegatedVotes.length);
	}

	return (
		<Paper style={{ display: 'flex', flexDirection: 'row', width: '100%', marginTop: '0.2em', padding: '0.3em', paddingLeft: '0.5em', cursor: 'pointer', ...stylesPaper }}>
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
					//...(toDelegate? !limitReached? {cursor: "pointer"} : {} : {cursor: "pointer"}),
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
					{`${participant.name} ${participant.surname} - ${participant.dni} ${toDelegate && limitReached ? 'NO SE PUEDEN DELEGAR MÁS VOTOS EN ESTE PARTICIPANTE' : ''}`}
				</div>
				<div style={{ fontSize: "0.8rem" }}>{`${participant.position || '-'} - ${
					participant.email
					} - ${participant.phone}`}</div>
			</div>
		</Paper>
	);
}

export default ParticipantRow;

