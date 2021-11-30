import React from 'react';
import ReactDOM from 'react-dom';
import { Tooltip, MenuItem, Card } from 'material-ui';
import { LoadingSection } from '.';
import { getLightGrey } from '../styles/colors';


const FilterButton = ({
	onClick,
	children,
	active,
	elevation,
	buttonStyle,
	tooltip,
	id = '',
	size = '2em',
	loading,
	styles
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
					display: 'flex',
					alignItems: 'center',
					margin: '1px 0.2em',
					// width: size,
					justifyContent: 'center',
					cursor: 'pointer',
					overflow: 'hidden',
					height: size,
					outline: 0,
					border: '1px solid gainsboro',
					borderRadius: '2px',
					backgroundColor: active ? getLightGrey() : 'transparent',
					...buttonStyle,
					...styles
				}}
				id={id}
				elevation={elevation || (active ? 0 : 1)}
				ref={ref => { element = ref; }}
				onKeyUp={onKeyUp}
				onClick={onClick}
			>
				<MenuItem
					selected={active}
					style={{
						display: 'flex',
						flexGrow: 1,
						alignItems: 'center',
						justifyContent: 'center',
						width: size,
					}}
				>
					{loading ? (
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center'
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
