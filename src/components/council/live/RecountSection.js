import React from "react";
import AgendaRecount from '../agendas/AgendaRecount';
import { canEditPresentVotings } from '../../../utils/CBX';

const RecountSection = ({ translate, council, agenda, ...props }) => {
	const _section = () => (
			<div style={{ backgroundColor: 'white' }}>
				<AgendaRecount
					agenda={agenda}
					council={council}
					translate={translate}
					editable={canEditPresentVotings(agenda) && false}
					refetch={props.refetch}
					recount={props.recount}
					majorityTypes={props.majorityTypes}
				/>
			</div>
		);

	return (
		<div
			style={{
				width: "100%",
				backgroundColor: 'white',
				position: "relative"
			}}
		>
			{_section()}
		</div>
	);
}


export default RecountSection;
