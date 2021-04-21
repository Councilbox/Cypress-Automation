import React from 'react';
import Grid from 'material-ui/Grid';

const GridWrapper = ({
	children,
	alignItems,
	alignContent,
	style,
	spacing = 8,
	className,
	onClick,
	justify,
	id,
	onKeyUp
}) => (
	<Grid
		id={id}
		classes={{
			container: className
		}}
		container
		justify={justify}
		alignItems={alignItems}
		alignContent={alignContent}
		onKeyUp={onKeyUp}
		onClick={onClick}
		style={style}
		spacing={spacing}
	>
		{children}
	</Grid>
);

export default GridWrapper;
