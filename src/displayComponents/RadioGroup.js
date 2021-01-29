import React from "react";
import { FormControl, RadioGroup } from "material-ui";

const RadioGroupComponent = ({ children, value, onChange, name, style }) => (
	<FormControl component="fieldset">
		<RadioGroup
			name={name}
			value={value.toString()}
			onChange={onChange}
			style={style}
		>
			{children}
		</RadioGroup>
	</FormControl>
);

export default RadioGroupComponent;
