import React from 'react';
import { Icon } from 'material-ui';

const CBXIcon = ({
	className, children, style, onClick, id
}) => (
	<Icon className={className} style={style} onClick={onClick} id={id}>
		{children}
	</Icon>
);

export default CBXIcon;
