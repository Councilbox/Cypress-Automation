import React from "react";
import { SortableElement } from "react-sortable-hoc";
import { getPrimary } from "../styles/colors";
import { Card, MenuItem } from 'material-ui';

const DraggableBlock = SortableElement((props) => {
	return (
		<Card
			style={{
				opacity: 1,
				width: "100%",
				color: getPrimary(),
				display: "flex",
				alignItems: "center",
				padding: "0.5em",
				height: "3em",
				border: `2px solid ${getPrimary()}`,
				listStyleType: "none",
				borderRadius: "3px",
				cursor: "pointer",
				marginTop: "0.5em"
			}}
			className="draggable"
		>
			{props.value}
		</Card>
	);
});

export default DraggableBlock;
