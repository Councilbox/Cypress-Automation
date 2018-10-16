import React from "react";
import ReactDOM from "react-dom";
import { Card } from "material-ui";
import { getLightGrey } from "../styles/colors";


const SwitchButton = ({
	onClick,
	children,
	active,
}) => {
	let element = null;

	const onKeyUp = event => {
		if (event.nativeEvent.keyCode === 13) {
			onClick();
			ReactDOM.findDOMNode(element).focus();
		}
	};

	return (
		<Card
			style={{
				padding: "0.5em",
				display: "flex",
				alignItems: "center",
				margin: '1px 0.2em',
				justifyContent: "center",
				cursor: "pointer",
				overflow: "hidden",
				outline: 0,
				border: `1px solid gainsboro`,
				borderRadius: "2px",
				backgroundColor: active ? getLightGrey() : "transparent"
			}}
			elevation={active ? 0 : 1}
			tabIndex="0"
			ref={ref => (element = ref)}
			onKeyUp={onKeyUp}
			onClick={onClick}
		>
			{children}
		</Card>
	);
};

export default SwitchButton;
