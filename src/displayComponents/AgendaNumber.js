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
	open,
	style,
	small,
	moreStyles,
	onlyShowCalendar
}) => (
	<div
		style={{
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			height: small ? "24px" : "2em",
			filter: open && !active ? "opacity(50%)" : "",
			width: small ? "24px" : "2em",
			fontSize: small ? "15px" : "1.1em",
			cursor: onlyShowCalendar ? "" : "pointer",
			userSelect: "none",
			position: 'relative',
			margin: 0,
			color: active || open ? "white" : secondaryColor,
			borderRadius: small ? "12px" : "1em",
			backgroundColor: active || open ? activeColor : "white",
			border: `3px solid ${active || open ? activeColor : secondaryColor}`,
			...moreStyles
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
		<div>
			{index}
		</div>
	);

export default AgendaNumber;
