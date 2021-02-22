import React, { Fragment } from 'react';
// import DeleteForever from 'material-ui/svg-icons/action/delete-forever';
import DeleteForever from 'material-ui-icons/DeleteForever';
import { IconButton } from 'material-ui';
import { CircularProgress } from 'material-ui/Progress';

const DeleteIcon = ({ style, onClick, loading }) => (
	<Fragment>
		{!loading ? (
			<IconButton onClick={onClick} style={style}>
				<DeleteForever />
			</IconButton>
		) : (
			<CircularProgress size={20} color="primary" />
		)}
	</Fragment>
);

export default DeleteIcon;
