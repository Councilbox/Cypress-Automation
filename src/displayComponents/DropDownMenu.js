import React, { Fragment } from 'react';
import { Popover } from 'material-ui';
import { BasicButton } from './index';

const DropDownMenu = ({
	text,
	Component,
	items,
	id,
	textStyle,
	buttonStyle,
	loading,
	color,
	type,
	open,
	icon,
	loadingColor,
	requestClose,
	anchorOrigin,
	claseHover,
	paperPropsStyles,
	transformOrigin,
	backgroundColor,
	styleComponent,
	...props
}) => {
	const [anchorEl, setAnchorEl] = React.useState(null);

	React.useEffect(() => {
		if (open) {
			setAnchorEl(open);
		} else {
			setAnchorEl(null);
		}
	}, [open]);

	const handleClick = event => {
		event.stopPropagation();
		setAnchorEl(event.currentTarget);
	};

	const handleClose = event => {
		event.stopPropagation();
		if (requestClose) {
			requestClose();
		}
		setAnchorEl(null);
	};

	return (
		<Fragment>
			{Component ? (
				<div onClick={handleClick} id={id} style={{ width: '100%', ...styleComponent }}>
					<Component />
				</div>
			) : (
				<BasicButton
					claseHover={claseHover}
					type={type}
					id={id}
					loading={loading}
					loadingColor={loadingColor}
					onClick={handleClick}
					textStyle={{
						...textStyle,
						textTransform: 'none',
					}}
					color={color}
					icon={icon}
					buttonStyle={buttonStyle}
					text={text}
					backgroundColor={backgroundColor}
				/>
			)}
			<Popover
				PaperProps={{
					style: {
						...paperPropsStyles
					}
				}}
				id={id}
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={anchorOrigin}
				transformOrigin={transformOrigin}
				// anchorOrigin={{
				// 	vertical: 'top',
				// 	horizontal: 'left',
				//   }}
				//   transformOrigin={{
				// 	vertical: 'top',
				// 	horizontal: 'left',
				//   }}
			>
				<div onClick={props.persistent ? () => { } : handleClose}>
					{items}
				</div>
			</Popover>
		</Fragment>
	);
};


export default DropDownMenu;
