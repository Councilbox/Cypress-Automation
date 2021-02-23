import React from 'react';
import { FormControl, TextField } from 'material-ui';

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
	style,
	onFocus
}) => (
	<FormControl
		style={{
			width: '100%',
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
			onFocus={onFocus}
			value={value}
			multiline={multiline}
			style={{
				marginTop: 0,
				width: '100%',
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
