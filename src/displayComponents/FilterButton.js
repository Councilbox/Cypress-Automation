import React from "react";
import { getSecondary } from "../styles/colors";
import { Tooltip } from "material-ui";

const FilterButton = ({ onClick, children, active, tooltip }) => (
	<Tooltip title={tooltip}>
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				width: "2em",
				cursor: "pointer",
				height: "2em",
				border: `2px solid ${getSecondary()}`,
				borderRadius: "3px",
				backgroundColor: active ? "gainsboro" : "transparent"
			}}
			onClick={onClick}
		>
			{children}
		</div>
	</Tooltip>
);

export default FilterButton;
