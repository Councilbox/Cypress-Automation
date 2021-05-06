import { setDate } from 'date-fns';
import React from 'react';
import { TextInput } from '../../../../displayComponents';
import { moment } from '../../../../containers/App';


const ClaveJusticiaPicker = ({ error, onChange }) => {
	return (
		<>
			<input
				type="date"
				onChange={event => onChange(moment(event.target.value))}
				style={{
					width: '100%',
					padding: '5px'
				}}
			/>
			<span style={{ color: 'red' }}>
				{error}
			</span>
		</>
	);
};

export default ClaveJusticiaPicker;
