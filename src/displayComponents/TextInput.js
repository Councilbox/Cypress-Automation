import React from "react";
import {
	FormControl,
	IconButton,
	InputAdornment,
	TextField
} from "material-ui";
import Visibility from "material-ui-icons/Visibility";
import VisibilityOff from "material-ui-icons/VisibilityOff";
import FontAwesome from "react-fontawesome";
import { HelpPopover } from ".";


const TextInput = ({
	floatingText = "",
	type,
	passwordToggler,
	showPassword,
	adornment,
	value,
	onChange,
	errorText,
	classes,
	onKeyUp,
	placeholder,
	required,
	min,
	max,
	disabled,
	onClick,
	onBlur,
	helpPopover,
	helpTitle,
	helpDescription,
	multiline,
	id,
	helpPopoverInLabel,
	styles,
	styleInInput,
	disableUnderline,
	stylesAdornment,
	labelNone,
	autoComplete = true
}) => (
		<FormControl
			style={{
				width: "100%",
				marginTop: '0',
				...styles
			}}
		>
			<TextField
				onSelect={onClick}
				onBlur={onBlur}
				label={
					labelNone? "" :
					helpPopoverInLabel ? floatingText :
					<div style={{ display: 'flex' }}>
						{`${floatingText}${required ? "*" : ""}`}
						{!!errorText &&
							<FontAwesome
								name={"times"}
								style={{
									fontSize: "17px",
									color: 'red',
									marginLeft: '0.2em'
								}}
							/>
						}
						{helpPopover &&
							<HelpPopover
								title={helpTitle}
								content={helpDescription}
							/>
						}
					</div>
				}
				value={value}
				multiline={multiline}
				style={{
					marginTop: 0,
					width: "100%"
				}}
				placeholder={placeholder}
				InputLabelProps={{
					shrink: true
				}}
				InputProps={{
					disableUnderline,
					startAdornment: "",
					inputProps: {
						min: min,
						id: id,
						max: max,
						style: {
							fontSize: '15px',
							...styleInInput
						}
					},
					endAdornment: passwordToggler ? (
						<InputAdornment position="end">
							<IconButton
								aria-label="Toggle password visibility"
								style={{
									outline: 0
								}}
								onClick={event => {
									event.stopPropagation();
									passwordToggler();
								}}
							>
								{showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					) : adornment ? (
						<InputAdornment position="end" style={{...stylesAdornment }}>
							{adornment}
						</InputAdornment>
					) : (
								""
							)
				}}
				FormHelperTextProps={{
					error: !!errorText,
					className: 'error-text'
				}}
				color="secondary"
				type={type}
				autoComplete={autoComplete}
				disabled={!!disabled}
				onKeyUp={onKeyUp}
				onChange={onChange}
				margin="normal"
				helperText={errorText}
				error={!!errorText}
			/>
		</FormControl>
	);

export default TextInput;