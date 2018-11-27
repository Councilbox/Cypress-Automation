import React from "react";
import Button from "material-ui/Button";

const FabButton = ({ onClick, color, icon, style, mode }) => (
	<Button
		variant="fab"
		classes={{
			root: mode === 'intermitent'? 'colorToggle' : ''
		}}
		color="primary"
		onClick={onClick}
		style={{ outline: 0, ...(!!color? {backgroundColor: color} : {}), ...style}}
	>
		{icon}
	</Button>
);

export default FabButton;
