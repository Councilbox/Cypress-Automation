import React, { Fragment } from "react";
import Dialog, {
	DialogActions,
	DialogContent,
	DialogTitle
} from "material-ui/Dialog";
import BasicButton from "./BasicButton";
import { getPrimary, getSecondary } from "../styles/colors";
import FontAwesome from "react-fontawesome";

const AlertConfirm = ({
	title,
	fullWidth,
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
	classNameDialog,
	PaperProps
}) => {
	const primary = getPrimary();
	const buttons = (
		<Fragment>
			{!!buttonCancel && (
				<BasicButton
					text={buttonCancel}
					textStyle={{
						textTransform: "none",
						fontWeight: "700",
					}}
					primary={true}
					color='transparent'
					type="flat"
					onClick={!!cancelAction ? cancelAction : requestClose}
				/>
			)}

			{!hideAccept &&
				!!buttonAccept && (
					<BasicButton
						text={buttonAccept}
						loading={loadingAction}
						success={successAction}
						textStyle={{
							color: "white",
							textTransform: "none",
							fontWeight: "700"
						}}
						buttonStyle={{ marginLeft: "1em" }}
						color={primary}
						onClick={acceptAction}
					/>
				)}
		</Fragment>
	);

	return (
		<Dialog
			className={classNameDialog}
			disableBackdropClick={modal}
			fullWidth={fullWidth}
			fullScreen={fullScreen}
			maxWidth={false}
			PaperProps={PaperProps}
			open={open}
			onClose={requestClose}
		>
			{!!requestClose && (
				< FontAwesome
					name={"close"}
					style={{
						cursor: "pointer",
						fontSize: "1.5em",
						color: getSecondary(),
						position: "absolute",
						right: "12px",
						top: "18px"
					}}
					onClick={() => requestClose()}
				/>
				)}
			{!!title && (
				<DialogTitle
					style={{
						margin: '0px 8px 0.8em',
						padding: "1.1em 2em 1.1em 1em",
						fontSize: "1.2em",
						borderBottom: "1px solid gainsboro",
					}}
				>
					{title}
				</DialogTitle>
			)}
			<DialogContent
				style={{
					minWidth: "40vw",
					maxWidth: "95vw",
					...bodyStyle
				}}
			>
				{bodyText}
			</DialogContent>
			{!!buttonCancel && !hideAccept &&
				!!buttonAccept &&
				<DialogActions
					style={{
						paddingRight: "0.6em",
						borderTop: "1px solid gainsboro",
						paddingTop: '0.5em',
						margin: '8px 8px',
						minHeight: '25px'
					}}
				>
					{buttons}
				</DialogActions>
			}
		</Dialog>
	);
};

export default AlertConfirm;
