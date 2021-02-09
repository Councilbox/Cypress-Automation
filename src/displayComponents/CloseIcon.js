import React, { Fragment } from 'react';
//import DeleteForever from 'material-ui/svg-icons/action/delete-forever';
import Close from 'material-ui-icons/Close';
import { IconButton } from 'material-ui';
import { CircularProgress } from 'material-ui/Progress';

const CloseIcon = ({ style, onClick, loading }) => (
	<Fragment>
		{!loading ? (
			<IconButton
				onClick={onClick}
				style={{
					...style,
					height: '32px',
					width: '32px',
					outline: 0
				}}
				className={'closeIcon'}
			>
				<Close />
			</IconButton>
		) : (
			<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<CircularProgress size={15} color="primary" />
			</div>
		)}
	</Fragment>
);

export default CloseIcon;
