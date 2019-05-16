import React from "react";
import {
	FormControl,
	IconButton,
	InputAdornment,
	TextField
} from "material-ui";
import { Visibility, VisibilityOff } from "material-ui-icons";
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
	helpPopoverInLabel,
	onClick,
	onBlur,
	helpPopover,
	helpTitle,
	helpDescription,
	multiline,
	id
}) => (
		<FormControl
			style={{
				width: "100%",
				marginTop: 0
			}}
		>
			<TextField
				label={helpPopoverInLabel ? floatingText : `${floatingText}${required ? "*" : ""}`}
				// label={`${floatingText}${required ? "*" : ""}`}
				value={value}
				style={{
					width: "100%",
					marginTop: 0
				}}
			>
				<TextField
					onSelect={onClick}
					onBlur={onBlur}
					label={
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
						startAdornment: "",
						inputProps: {
							min: min,
							id: id,
							max: max,
							style: {
								fontSize: '15px'
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
							<InputAdornment position="end">
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
					disabled={!!disabled}
					onKeyUp={onKeyUp}
					onChange={onChange}
					margin="normal"
					helperText={errorText}
					error={!!errorText}
				/>
			</TextField>
		</FormControl>
	);

export default TextInput;
