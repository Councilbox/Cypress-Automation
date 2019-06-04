import React from "react";
import {
	FormControl,
	IconButton,
	InputAdornment,
	TextField
} from "material-ui";
import Visibility from "material-ui-icons/Visibility";
import VisibilityOff from "material-ui-icons/VisibilityOff";
import FontAwesome from 'react-fontawesome';
import HelpPopover from './HelpPopover';

const TextInputChat = ({
	type,
	value,
	onChange,
	errorText,
	onKeyUp,
	multiline = false,
	onBlur,
	disabled,
	onClick,
	style
}) => (
		<FormControl
			style={{
				width: "100%",
				marginTop: 0
			}}
		>
			<TextField
				InputProps={{
					disableUnderline: true,
				}}
				// defaultValue="Bare"
				variant="outlined"
				onSelect={onClick}
				onBlur={onBlur}
				value={value}
				multiline={multiline}
				style={{
					marginTop: 0,
					width: "100%",
					...style,
				}}
				FormHelperTextProps={{
					error: !!errorText,
					className: 'error-text'
				}}
				color="secondary"
				type={type}
				disabled={!!disabled}
				onKeyUp={onKeyUp}
				onChange={onChange}
				margin="normal"
				helperText={errorText}
				error={!!errorText}
				rows={1}
				rowsMax={6}
			/>
		</FormControl>
	);

export default TextInputChat;
