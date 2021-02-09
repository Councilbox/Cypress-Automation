import React from 'react';
import { Button } from 'material-ui';
import { CircularProgress } from 'material-ui/Progress';
import { ButtonIcon } from './index';

const BasicButton = ({
	color,
	id,
	error,
	text,
	resetDelay = 2700,
	loadingColor = 'white',
	textStyle,
	reset,
	buttonStyle,
	icon,
	type = 'raised',
	disabled,
	onClick,
	fullWidth,
	loading,
	success,
	floatRight,
	claseHover,
	backgroundColor,
	successSoloColor,
	iconInit
}) => {
	React.useEffect(() => {
		let timeout;
		if ((error || success) && !!reset) {
			timeout = setTimeout(reset, resetDelay);
		}
		return () => {
			clearTimeout(timeout);
		};
	}, [error, success, reset, resetDelay]);


	return (
		<Button
			id={id}
			disableRipple={loading}
			style={{
				textTransform: 'none',
				...buttonStyle,
				...textStyle,
				backgroundColor: success ? 'green' : error ? 'red' : color,
				float: floatRight && 'right',
				outline: '0',
				cursor: loading ? 'wait' : 'pointer',
				...backgroundColor,
			}}
			disabled={disabled || loading}
			variant={type}
			{...(!success && !loading ? { onClick } : {})}
			fullWidth={fullWidth}
			className={claseHover}
		>
			{iconInit &&
			iconInit
			}
			{text}
			{success ? (
				successSoloColor ?
					(
						<div></div>
					) :
					(
						<ButtonIcon type="checkIcon" color="white" />
					)

			) : error ? (
				successSoloColor ?
					(
						<div></div>
					) :
					(
						<ButtonIcon type="clear" color="white" />
					)
			) : loading ? (
				successSoloColor ?
					(
						<div></div>
					) :
					(
						<div
							style={{
								color: loadingColor,
								marginLeft: '0.3em'
							}}
						>
							<CircularProgress size={12} color={'inherit'} />
						</div>
					)
			) : (
							icon
						)}
		</Button>
	);
};

export default BasicButton;
