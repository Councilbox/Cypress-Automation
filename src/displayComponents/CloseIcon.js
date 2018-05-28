import React, { Fragment } from "react";
//import DeleteForever from 'material-ui/svg-icons/action/delete-forever';
import { Close } from "material-ui-icons";
import { IconButton } from "material-ui";
import { CircularProgress } from "material-ui/Progress";

const CloseIcon = ({ style, onClick, loading }) => (
	<Fragment>
		{!loading ? (
			<IconButton
				onClick={onClick}
				style={{
					...style,
					height: "28px",
					width: "45px"
				}}
			>
				<Close />
			</IconButton>
		) : (
			<CircularProgress size={10} color="primary" />
		)}
	</Fragment>
);

export default CloseIcon;
