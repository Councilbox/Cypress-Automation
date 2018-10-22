import React from 'react';
import { Icon } from './';
import { Typography } from 'material-ui';

const SuccessMessage = ({ message }) => (
	<div
		style={{
			width: "100%",
			display: "flex",
			alignItems: "center",
			alignContent: "center",
			flexDirection: "column"
		}}
	>
		<Icon
			className="material-icons"
			style={{
				fontSize: "6em",
				color: "limegreen"
			}}
		>
			check_circle
		</Icon>
		<Typography variant="subheading">{message}</Typography>
	</div>
);

export default SuccessMessage;