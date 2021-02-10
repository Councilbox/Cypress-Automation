import React from 'react';
import { Link } from 'react-router-dom';

const LinkWithoutStyle = ({
 to, children, id, styles
}) => (
	<Link
		to={to}
		id={id}
		style={{
			textDecoration: 'none',
			color: 'inherit',
			...styles
		}}
	>
		{children}
	</Link>
);

export default LinkWithoutStyle;
