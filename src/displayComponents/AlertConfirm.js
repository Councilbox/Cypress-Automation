import React, { Fragment } from 'react';
import Dialog, {
	DialogActions,
	DialogContent,
	DialogTitle
} from 'material-ui/Dialog';
import FontAwesome from 'react-fontawesome';
import BasicButton from './BasicButton';
import { getPrimary, getSecondary } from '../styles/colors';
import { isMobile } from '../utils/screen';

const AlertConfirm = ({
	title,
	fullWidth,
	id = 'alert-confirm',
	fullScreen,
	buttonAccept,
	buttonCancel,
	modal = true,
	successAction = false,
	open,
	requestClose,
	loadingAction,
	acceptAction,
	cancelAction,
	bodyText,
	bodyStyle = {},
	hideAccept,
	extraActions,
	classNameDialog,
	PaperProps,
	widthModal,
	titleRigth,
	actions
}) => {
	const primary = getPrimary();
	const buttons = (
		<Fragment>
			{!!buttonCancel && (
				<BasicButton
					text={buttonCancel}
					id={`${id}-button-cancel`}
					textStyle={{
						textTransform: 'none',
						fontWeight: '700',
					}}
					primary={true}
					color='transparent'
					type="flat"
					onClick={cancelAction || requestClose}
				/>
			)}

			{extraActions
				&& extraActions
			}

			{(!hideAccept && !!buttonAccept) && (
				<BasicButton
					text={buttonAccept}
					id={`${id}-button-accept`}
					loading={loadingAction}
					success={successAction}
					textStyle={{
						color: 'white',
						textTransform: 'none',
						fontWeight: '700'
					}}
					buttonStyle={{ marginLeft: '1em' }}
					color={primary}
					onClick={acceptAction}
					claseHover={'buttonAceptarDeModalAlert'}
				/>
			)}
		</Fragment>
	);

	return (
		<Dialog
			className={classNameDialog}
			disableBackdropClick={modal}
			fullWidth={isMobile || fullWidth}
			fullScreen={fullScreen}
			maxWidth={false}
			id={id}
			open={open || false}
			onClose={requestClose}
			PaperProps={{
				style: {
					...widthModal,
					...(PaperProps ? PaperProps.style : {}),
					...(isMobile ? {
						margin: 0
					} : {})
				},
			}}
		>
			{!!requestClose && (
				<FontAwesome
					name={'close'}
					style={{
						cursor: 'pointer',
						fontSize: '1.5em',
						color: getSecondary(),
						position: 'absolute',
						right: '12px',
						top: '18px'
					}}
					id="alert-confirm-close"
					onClick={requestClose}
				/>
			)}
			{!!title && (
				<DialogTitle
					id="modal-title"
					style={{
						margin: '0px 8px 0.8em',
						padding: '1.1em 2em 1.1em 1em',
						fontSize: '1.2em',
						borderBottom: '1px solid gainsboro',
						overflow: 'hidden'
					}}
				>
					{titleRigth ?
						(
							<div style={{ display: 'flex', width: '95%', justifyContent: 'space-between' }}>
								<div>{title}</div>
								<div style={{ color: ' rgba(0, 0, 0, 0.37)', fontSize: '17px' }}>{titleRigth}</div>
							</div>
						)
						: (
							title
						)
					}
				</DialogTitle>
			)}

			<DialogContent
				style={{
					minWidth: '40vw',
					maxWidth: isMobile ? '100%' : '95vw',
					...bodyStyle
				}}
			>
				{bodyText}
			</DialogContent>
			{(!!buttonCancel || !!buttonAccept)
				&& <DialogActions
					style={{
						paddingRight: '0.6em',
						borderTop: '1px solid gainsboro',
						paddingTop: '0.5em',
						margin: '8px 8px',
						minHeight: '25px'
					}}
				>
					{buttons}
				</DialogActions>
			}
			{actions
				&& <DialogActions
					style={{
						paddingRight: '0.6em',
						borderTop: '1px solid gainsboro',
						paddingTop: '0.5em',
						margin: '8px 8px',
						minHeight: '25px'
					}}
				>
					{actions}
				</DialogActions>
			}
		</Dialog>
	);
};

export default AlertConfirm;
