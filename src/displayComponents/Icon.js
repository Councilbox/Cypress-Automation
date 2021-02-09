import React from 'react';
import { Icon } from 'material-ui';

const CBXIcon = ({ className, children, style, onClick }) => (
	<Icon className={className} style={style} onClick={onClick}>
		{children}
	</Icon>
);

export default CBXIcon;
