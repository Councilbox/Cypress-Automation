import React from "react";
import { Radio } from "material-ui";
import { FormControlLabel } from "material-ui/Form";

export default ({ value, checked, label, disabled, style, name, onChange, styleLabel }) => (
	<FormControlLabel
		control={
			<Radio
				disabled={disabled}
				checked={checked}
				onChange={onChange}
				value={''+value}
				name={name}
			/>
		}
		style={{ ...styleLabel, }}
		label={label}
	/>
);
