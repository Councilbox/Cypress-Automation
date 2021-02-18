import React from 'react';
import VotingsTableFiltersContainer from './voting/VotingsTableFiltersContainer';

const Votings = ({
	translate, agenda, council, ...props
}) => {
	const section = () => (
		<div style={{ backgroundColor: 'white', paddingTop: '1em' }}>
			<VotingsTableFiltersContainer
				recount={props.recount}
				translate={translate}
				agenda={agenda}
				council={council}
				refetch={props.refetch}
				changeEditedVotings={props.changeEditedVotings}
				editedVotings={props.editedVotings}
			/>
		</div>
	);

	return (
		<div
			style={{
				width: '100%',
				position: 'relative'
			}}
		>
			{section()}
		</div>
	);
};

export default Votings;
