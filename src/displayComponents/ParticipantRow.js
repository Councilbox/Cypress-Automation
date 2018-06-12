import React from "react";
import { getSecondary } from "../styles/colors";
import { Checkbox } from './';
import { delegatedVotesLimitReached } from '../utils/CBX';

const ParticipantRow = ({ participant, onClick, key, checkBox, toDelegate, council, selected, onChange }) => {

	const limitReached = delegatedVotesLimitReached(council.statute, participant.delegatedVotes.length );
 
	return (
		<div style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
			{checkBox &&
				<Checkbox
					value={selected}
					onChange={onChange}
				/>
			}
			<div
				onClick={toDelegate? !limitReached? onClick : () => {} : onClick}
				style={{
					width: "100%",
					padding: "0.4em",
					...(toDelegate? !limitReached? {cursor: "pointer"} : {} : {cursor: "pointer"}), 
					paddingLeft: "0.8em",
					border: `1px solid ${toDelegate? !limitReached? getSecondary() : 'gainsboro' : getSecondary()}`,
					display: "flex",
					flexDirection: "column"
				}}
				key={key}
			>
				<div
					style={{
						fontWeight: "700",
						fontSize: "0.9rem"
					}}
				>
					{`${participant.name} ${participant.surname} - ${participant.dni} ${toDelegate && limitReached? 'NO SE PUEDEN DELEGAR MÁS VOTOS EN ESTE PARTICIPANTE' : ''}`}
				</div>
				<div style={{ fontSize: "0.8rem" }}>{`${participant.position} - ${
					participant.email
				} - ${participant.phone}`}</div>
			</div>
		</div>
	);
}

export default ParticipantRow;

