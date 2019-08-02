import React from "react";
import { Select } from "material-ui";
import { InputLabel } from "material-ui/Input";
import { FormControl } from "material-ui/Form";
import { withStyles } from "material-ui";
import PropTypes from "prop-types";




const styles = {
	select: {
		color: '#0000005c'
	}
};

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
	autoWidth,
	...props
}) => {
	
	return (
		<FormControl
			style={{
				width: "100%",
				marginTop: "0",
				marginBottom: "8px"
			}}
		>
			{!noLabel && (
				<InputLabel htmlFor={id}>{`${!!floatingText ? floatingText : ""}${
					required ? "*" : ""
					}`}</InputLabel>
			)}
			<Select
				inputProps={{
					name: floatingText,
					id: id,
					style: {
						fontSize: '12px !important'
					}
				}}
				// classes={{ select: props.classes.select }}
				autoWidth={autoWidth}
				disabled={!!disabled}
				value={value}
				onChange={onChange}
				error={!!errorText}
				// color={'red'}
			>
				{children}
			</Select>
		</FormControl>
	);
}


SelectInput.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectInput);
