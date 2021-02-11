import React, { Fragment } from 'react';
import Dialog, {
	DialogActions,
	DialogContent,
	DialogTitle
} from 'material-ui/Dialog';
import BasicButton from './BasicButton';
import { getPrimary } from '../styles/colors';

const ErrorAlert = ({
	title, buttonAccept, open, requestClose, bodyText
}) => {
	const primary = getPrimary();

	const buttons = (
		<Fragment>
			<BasicButton
				text={buttonAccept}
				textStyle={{
					color: 'white',
					textTransform: 'none',
					fontWeight: '700'
				}}
				buttonStyle={{ marginLeft: '1em' }}
				color={primary}
				onClick={requestClose}
			/>
		</Fragment>
	);

	return (
		<Dialog
			title={title}
			disableBackdropClick={false}
			open={open}
			onClose={requestClose}
		>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>{bodyText}</DialogContent>
			<DialogActions>{buttons}</DialogActions>
		</Dialog>
	);
};

export default ErrorAlert;
