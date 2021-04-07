import React from 'react';
import { TextInput } from '../../../../../displayComponents';
import { getPrimary } from '../../../../../styles/colors';


const OVACTextInput = props => {
	const primary = getPrimary();

	return (
		<TextInput
			{...props}
			styleFloatText={{
				color: primary,
				fontWeight: '700',
				fontSize: '18px'
			}}
		/>
	);
};

export default OVACTextInput;
