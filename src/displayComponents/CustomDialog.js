import React from 'react';
import Dialog, {
	DialogActions,
	DialogContent,
	DialogTitle
} from 'material-ui/Dialog';
import FontAwesome from 'react-fontawesome';
import { getSecondary } from '../styles/colors';

const CustomDialog = ({
	title,
	fullWidth = false,
	fullScreen = false,
	requestClose,
	disableBackdropClick = false,
	open,
	actions,
	children,
	onEntered,
	dialogActionsStyles
}) => (
	<Dialog
		disableBackdropClick={disableBackdropClick}
		fullWidth={fullWidth}
		fullScreen={fullScreen}
		maxWidth={false}
		open={open}
		onClose={requestClose}
		onEntered={onEntered}
	>
		<FontAwesome
			name={'close'}
			style={{
				cursor: 'pointer',
				fontSize: '1.5em',
				color: getSecondary(),
				position: 'absolute',
				right: '12px',
				top: '9px'
			}}
			onClick={() => requestClose()}
		/>
		{!!title && (
			<DialogTitle
				style={{
					padding: '0.6em 2em 0.8em 1.2em',
					fontSize: '1.2em'
				}}
			>
				{title}
			</DialogTitle>
		)}
		<DialogContent
			style={{
				minWidth: '40vw',
				maxWidth: '95vw'
			}}
		>
			{children}
		</DialogContent>
		<DialogActions
			style={{
				paddingRight: '0.6em',
				textAlign: 'right',
				...dialogActionsStyles
			}}
		>
			{actions}
		</DialogActions>
	</Dialog>
);

export default CustomDialog;
