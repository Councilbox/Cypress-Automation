import React from 'react';
import { Card } from 'material-ui';
import { darkGrey } from '../styles/styles';

const BlockButton = ({ text, icon, onClick, color = darkGrey }) => (
		<Card
			onClick={onClick}
			style={{
				backgroundColor: color,
				color: 'white',
				cursor: 'pointer',
				display: 'flex',
				flexDirection: 'column',
				padding: '0.6em',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			{icon && icon}
			{text}
		</Card>
	);

export default BlockButton;
