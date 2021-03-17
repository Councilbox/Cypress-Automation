import React from 'react';
import { Select } from 'material-ui';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';

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
			width: '100%',
			marginTop: '0',
			marginBottom: '8px'
		}}
	>
		{!noLabel && (
			<InputLabel style={{ ...styleLabel }} htmlFor={id}>{`${floatingText || ''}${required ? '*' : ''
			}`}</InputLabel>
		)}
		<Select
			disableUnderline={disableUnderline}
			inputProps={{
				name: floatingText,
				style: {
					fontSize: '12px !important',
					...labelStyle
				}
			}}
			SelectDisplayProps={{
				id
			}}
			input={
				<Input
					// classes={{
					// underline: props.classes[colorText],
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
);


// SelectInput.propTypes = {
// classes: PropTypes.object.isRequired,
// };

export default SelectInput;
// export default withStyles(styles)(SelectInput);
