import React from "react";
import { DateTimePicker } from "material-ui-pickers";
import { Icon, IconButton, InputAdornment, Typography } from "material-ui";

const DateTimePickerWrapper = ({
	label,
	required,
	onChange,
	floatingText,
	clearable = true,
	value,
	format = "LLL",
	minDate,
	minDateMessage,
	acceptText,
	cancelText,
	errorText
}) => (
	<React.Fragment>
		<div style={{width: '100%'}}>
			<DateTimePicker
				label={!!label? `${label}${required && "*"}` : ''}
				ampm={false}
				format={format}
				minDateMessage={minDateMessage}
				okLabel={acceptText}
				style={{width: '100%'}}
				cancelLabel={cancelText}
				{...(minDate? {minDate:minDate} : {})}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton style={{outline: 0}}>
								<Icon color="primary">event</Icon>
							</IconButton>
						</InputAdornment>
					)
				}}
				value={value}
				onChange={onChange}
			/>
		</div>
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
