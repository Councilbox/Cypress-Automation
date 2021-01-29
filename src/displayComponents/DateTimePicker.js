import React from "react";
import { DateTimePicker, DatePicker } from "material-ui-pickers";
import { Icon, IconButton, InputAdornment, Typography } from "material-ui";
import withTranslations from "../HOCs/withTranslations";

const DateTimePickerWrapper = ({
	label,
	required,
	onChange,
	onlyDate,
	clearable = true,
	clearText = 'Borrar',
	value,
	format,
	minDate,
	minDateMessage,
	acceptText,
	cancelText,
	errorText,
	idIcon,
	translate
}) => (
		onlyDate ?
			<React.Fragment>
				<div style={{ width: '100%' }}>
					<DatePicker
						label={label ? `${label}${required && "*"}` : ''}
						format={format || 'LL'}
						minDateMessage={minDateMessage}
						okLabel={'Ok'}
						style={{ width: '100%' }}
						clearable={clearable}
						clearLabel={clearText && translate.new_delete }
						cancelLabel={cancelText}
						{...(minDate ? { minDate } : {})}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton style={{ outline: 0 }}>
										<Icon id={idIcon} color="primary">event</Icon>
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
			:

			<React.Fragment>
				<div style={{ width: '100%' }}>
					<DateTimePicker
						label={label ? `${label}${required && "*"}` : ''}
						ampm={false}
						format={format || 'LLL'}
						minDateMessage={minDateMessage}
						okLabel={acceptText}
						style={{ width: '100%' }}
						cancelLabel={cancelText}
						{...(minDate ? { minDate } : {})}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton style={{ outline: 0 }}>
										<Icon id={idIcon} color="primary">event</Icon>
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
	)

export default (withTranslations()(DateTimePickerWrapper));
