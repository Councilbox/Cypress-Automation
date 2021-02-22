import React from 'react';
import { BasicButton } from '../../displayComponents';
import { secondary } from '../../styles/colors';
import { CONTACT_URL } from '../../config';

const CBXContactButton = props => (
	<a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
		<BasicButton
			text={props.translate.contacting_councilbox}
			color={secondary}
			textStyle={{ fontWeight: '700', color: 'white', fontSize: '18px' }}
		/>
	</a>
);

export default CBXContactButton;
