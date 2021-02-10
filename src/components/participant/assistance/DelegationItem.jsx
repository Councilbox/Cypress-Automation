import React from 'react';
import { Card } from 'material-ui';
import { getSecondary } from '../../../styles/colors';


const DelegationItem = ({ participant }) => {
	return (
		<Card elevation={4} style={{ marginTop: '5px', borderTop: '1px solid gainsboro', marginBottom: '10px', borderRadius: '5px', color: 'white', background: getSecondary() }}>
			<div style={{}}>
				<div style={{ display: 'flex', }}>
					<div style={{ margin: '0.5em 1em' }}>
						{participant.name} {participant.surname || ''}
					</div>
				</div>
			</div>
		</Card>
	);
};

export default DelegationItem;
