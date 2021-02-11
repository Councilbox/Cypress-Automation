import React from 'react';
import { QuorumDetails } from '../../live/quorum/QuorumDisplay';


const CouncilActResults = ({
	council, agendas, recount, translate
}) => (
	<div style={{ width: '95%', margin: 'auto', paddingBottom: '5em' }}>
		<QuorumDetails
			council={council}
			recount={recount}
			agendas={agendas}
			renderVotingsTable
			translate={translate}
			socialCapital={recount.socialCapitalTotal}
			totalVotes={recount.partRightVoting}
		/>
	</div>

);

export default CouncilActResults;
