import React from "react";
import FontAwesome from "react-fontawesome";
import { getPrimary } from "../styles/colors";

const MainTitle = ({ icon, title, subtitle }) => (
	<div
		style={{
			display: "flex",
			flexDirection: "row",
			height: '8em',
			paddingLeft: '2em',
			borderBottom: '1px solid gainsboro',
			alignItems: "center",
		}}
	>
		<FontAwesome
			name={icon}
			color={getPrimary()}
			style={{
				margin: "0.2em 0.4em",
				color: getPrimary(),
				fontSize: "4em"
			}}
		/>
		<div
			style={{
				display: "flex",
				flexDirection: "column"
			}}
		>
			<h3 style={{ fontWeight: "600" }}>{title}</h3>
			<div>{subtitle}</div>
		</div>
	</div>
);

export default MainTitle;
