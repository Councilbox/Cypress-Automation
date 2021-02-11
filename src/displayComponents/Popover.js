import React from 'react';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';

const PopMenu = ({
	anchorTo, open, requestClose, menu
}) => (
	<Popover
		open={open}
		anchorEl={anchorTo}
		anchorOrigin={{
			horizontal: 'left',
			vertical: 'bottom'
		}}
		onClose={requestClose}
		animation={PopoverAnimationVertical}
	>
		{menu}
	</Popover>
);

export default PopMenu;
