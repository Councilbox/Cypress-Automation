import React from "react";
import { Button } from "material-ui";
import { ButtonIcon } from "./index";
import { CircularProgress } from "material-ui/Progress";

const BasicButton = ({
	color,
	error,
	text,
	resetDelay = 2700,
	loadingColor = "white",
	textStyle,
	reset,
	buttonStyle,
	icon,
	type,
	disabled,
	textPosition,
	onClick,
	fullWidth,
	loading,
	success,
	floatRight
}) => {
	if ((error || success) && !!reset) {
		let timeout = setTimeout(() => {
			reset();
			clearTimeout(timeout);
		}, resetDelay);
	}

	return (
		<Button
			style={{
				...buttonStyle,
				...textStyle,
				backgroundColor: success ? "green" : error ? "red" : color,
				float: floatRight && "right",
				outline: "0"
			}}
			disabled={disabled}
			variant={type}
			{...(!success? {onClick: onClick} : {})}
			fullWidth={fullWidth}
		>
			{text}
			{success ? (
				<ButtonIcon type="checkIcon" color="white" />
			) : error ? (
				<ButtonIcon type="clear" color="white" />
			) : loading ? (
				<div
					style={{
						color: loadingColor,
						marginLeft: "0.3em"
					}}
				>
					<CircularProgress size={12} color={"inherit"} />
				</div>
			) : (
				icon
			)}
		</Button>
	);
};

export default BasicButton;
