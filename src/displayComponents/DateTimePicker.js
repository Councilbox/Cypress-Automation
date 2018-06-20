import React from "react";
import { DateTimePicker } from "material-ui-pickers";
import { Icon, IconButton, InputAdornment, Typography } from "material-ui";

const DateTimePickerWrapper = ({
	label,
	required,
	onChange,
	floatingText,
	format,
	value,
	minDate = new Date(),
	minDateMessage,
	acceptText,
	cancelText,
	errorText
}) => (
	<React.Fragment>
		<DateTimePicker
			label={!!label? `${label}${required && "*"}` : ''}
			ampm={false}
			format="LLL"
			minDateMessage={minDateMessage}
			okLabel={acceptText}
			cancelLabel={cancelText}
			minDate={minDate}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						<IconButton>
							<Icon color="primary">event</Icon>
						</IconButton>
					</InputAdornment>
				)
			}}
			value={!!value ? new Date(value).toISOString() : new Date()}
			onChange={onChange}
		/>
		{!!errorText && (
			<Typography
				variant="caption"
				style={{
					color: "red",
					marginTop: "8px"
				}}
			>
				{errorText}
			</Typography>
		)}
	</React.Fragment>
);

export default DateTimePickerWrapper;
