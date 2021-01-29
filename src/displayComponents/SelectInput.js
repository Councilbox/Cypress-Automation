import React from "react";
import { Select } from "material-ui";
import Input, { InputLabel } from "material-ui/Input";
import { FormControl } from "material-ui/Form";

// const styles = {
// 	'#b47fb6': {
// 		color: '#b47fb6',
// 		'&:after': {
// 			borderBottom: `2px solid #b47fb6`,
// 		},
// 		'&$focused:after': {
// 			borderBottomColor: `#b47fb6`,
// 		},
// 		'&$error:after': {
// 			borderBottomColor: `#b47fb6`,
// 		},
// 		'&:before': {
// 			borderBottom: `1px solid #b47fb6`,
// 		},
// 		'&:hover:not($disabled):not($focused):not($error):before': {
// 			borderBottom: `2px solid #b47fb6`,
// 		},
// 		'&$disabled:before': {
// 			borderBottom: `1px dotted #b47fb6`,
// 		},
// 	},
// 	'#7fa5b6': {
// 		color: '#7fa5b6',
// 		'&:after': {
// 			borderBottom: `2px solid #7fa5b6`,
// 		},
// 		'&$focused:after': {
// 			borderBottomColor: `#7fa5b6`,
// 		},
// 		'&$error:after': {
// 			borderBottomColor: `#7fa5b6`,
// 		},
// 		'&:before': {
// 			borderBottom: `1px solid #7fa5b6`,
// 		},
// 		'&:hover:not($disabled):not($focused):not($error):before': {
// 			borderBottom: `2px solid #7fa5b6`,
// 		},
// 		'&$disabled:before': {
// 			borderBottom: `1px dotted #7fa5b6`,
// 		},
// 	},

// };

const SelectInput = ({
	floatingText,
	id,
	value = 0,
	onChange,
	errorText,
	children,
	required,
	disabled,
	noLabel,
	labelStyle = {},
	autoWidth,
	styles,
	disableUnderline = false,
	styleLabel
}) => (
		<FormControl
			error={!!errorText}
			style={{
				width: "100%",
				marginTop: "0",
				marginBottom: "8px"
			}}
		>
			{!noLabel && (
				<InputLabel style={{ ...styleLabel }} htmlFor={id}>{`${floatingText || ""}${required ? "*" : ""
					}`}</InputLabel>
			)}
			<Select
				disableUnderline={disableUnderline}
				inputProps={{
					name: floatingText,
					id,
					style: {
						fontSize: '12px !important',
						...labelStyle
					}
				}}
				input={
					<Input
					// classes={{
					// 	underline: props.classes[colorText],
					// }}
					/>
				}
				// classes={{ select: props.classes[colorText], icon: props.classes[colorText] }}
				autoWidth={autoWidth}
				disabled={!!disabled}
				value={value}
				onChange={onChange}
				error={!!errorText}
				style={{ ...styles }}
			// color={'red'}
			>
				{children}
			</Select>
			{errorText && <span style={{ color: 'red', fontSize: '12px' }}>{errorText}</span>}
		</FormControl>
	)


// SelectInput.propTypes = {
// 	classes: PropTypes.object.isRequired,
// };

export default SelectInput;
// export default withStyles(styles)(SelectInput);
