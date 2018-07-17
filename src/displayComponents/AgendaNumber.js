import React from "react";
import { getPrimary, getSecondary } from "../styles/colors";
import FontAwesome from 'react-fontawesome';
import { Tooltip } from 'material-ui';

const AgendaNumber = ({
	index,
	active,
	activeColor = getPrimary(),
	secondaryColor = getSecondary(),
	onClick,
	translate,
	voting,
	open
}) => (
	<div
		style={{
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			height: "2em",
			filter: open && !active ? "opacity(50%)" : "",
			width: "2em",
			position: 'relative',
			fontSize: "1.1em",
			cursor: "pointer",
			userSelect: "none",
			margin: 0,
			color: active || open ? "white" : secondaryColor,
			borderRadius: "1em",
			backgroundColor: active || open ? activeColor : "white",
			border: `3px solid ${active || open ? activeColor : secondaryColor}`
		}}
		onClick={onClick}
	>
		{voting &&
			<Tooltip title={translate.opened_votings}>
				<FontAwesome
					name={"envelope"}
					style={{
						position: 'absolute',
						fontSize: '0.7em',
						height: '0.8em',
						backgroundColor: 'white',
						color: secondaryColor,
						top: -5,
						right: -5
					}}
				/>
			</Tooltip>
		}
		{index}
	</div>
);

export default AgendaNumber;
