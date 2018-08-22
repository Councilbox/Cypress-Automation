import React from "react";
import ReactDOM from "react-dom";
import { getSecondary } from "../styles/colors";
import { Tooltip, MenuItem, Card } from "material-ui";
import { LoadingSection } from "./";

const FilterButton = ({
	onClick,
	children,
	active,
	tooltip,
	size = "2em",
	loading
}) => {
	let element = null;

	const onKeyUp = event => {
		if (event.nativeEvent.keyCode === 13) {
			onClick();
			ReactDOM.findDOMNode(element).focus();
		}
	};

	return (
		<Tooltip title={tooltip}>
			<Card
				style={{
					display: "flex",
					alignItems: "center",
					margin: '1px',
					width: size,
					justifyContent: "center",
					cursor: "pointer",
					overflow: "hidden",
					height: size,
					outline: 0,
					border: `2px solid gainsboro`,
					borderRadius: "3px",
					backgroundColor: active ? 'gainsboro' : "transparent"
				}}
				elevation={active? 0 : 1}
				tabIndex="0"
				ref={ref => (element = ref)}
				onKeyUp={onKeyUp}
				onClick={onClick}
			>
				<MenuItem
					selected={active}
					style={{
						display: "flex",
						flexGrow: 1,
						alignItems: "center",
						justifyContent: "center"
					}}
				>
					{loading ? (
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center"
							}}
						>
							<LoadingSection size={20} />
						</div>
					) : (
						children
					)}
				</MenuItem>
			</Card>
		</Tooltip>
	);
};

export default FilterButton;
