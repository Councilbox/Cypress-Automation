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
	open,
	requestClose,
	loadingAction,
	acceptAction,
	cancelAction,
	bodyText,
	bodyStyle = {},
	hideAccept
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
					onClick={!!cancelAction? cancelAction : requestClose}
				/>
			)}

			{!hideAccept &&
				!!buttonAccept && (
					<BasicButton
						text={buttonAccept}
						loading={loadingAction}
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
			disableBackdropClick={modal}
			fullWidth={fullWidth}
			fullScreen={fullScreen}
			maxWidth={false}
			open={open}
			onClose={requestClose}
		>
			<FontAwesome
				name={"close"}
				style={{
					cursor: "pointer",
					fontSize: "1.5em",
					color: getSecondary(),
					position: "absolute",
					right: "12px",
					top: "9px"
				}}
				onClick={() => requestClose()}
			/>
			{!!title && (
				<DialogTitle
					style={{
						padding: "0.6em 2em 0.8em 1.2em",
						fontSize: "1.2em"
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
			<DialogActions
				style={{
					paddingRight: "0.6em"
				}}
			>
				{buttons}
			</DialogActions>
		</Dialog>
	);
};

export default AlertConfirm;
