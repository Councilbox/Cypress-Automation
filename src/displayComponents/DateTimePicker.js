import React from 'react';
import { DateTimePicker, DatePicker } from 'material-ui-pickers';
import {
	Icon, IconButton, InputAdornment, Typography
} from 'material-ui';
import withTranslations from '../HOCs/withTranslations';

const DateTimePickerWrapper = ({
	label,
	required = true,
	onChange,
	onlyDate,
	clearable = true,
	clearText = 'Borrar',
	value,
	format,
	minDate,
	id,
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
					label={label ? `${label}${required ? '*' : ''}` : ''}
					format={format || 'LL'}
					minDateMessage={minDateMessage}
					okLabel={ acceptText ? <span id="calendar-accept-button">{acceptText}</span> : null}
					cancelLabel={ cancelText ? <span id="calendar-cancel-button">{cancelText}</span> : null}
					id={id}
					style={{ width: '100%' }}
					clearable={clearable}
					clearLabel={clearText && <span id="calendar-clear-button">{translate.new_delete}</span> }
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
						color: 'red',
						marginTop: '8px'
					}}
				>
					{errorText}
				</Typography>
			)}
		</React.Fragment>
		: <React.Fragment>
			<div style={{ width: '100%' }}>
				<DateTimePicker
					label={label ? `${label}${required && '*'}` : ''}
					ampm={false}
					format={format || 'LLL'}
					minDateMessage={minDateMessage}
					clearLabel={clearText && <span id="calendar-clear-button">{translate.new_delete}</span> }
					okLabel={ acceptText ? <span id="calendar-accept-button">{acceptText}</span> : null}
					style={{ width: '100%' }}
					cancelLabel={ cancelText ? <span id="calendar-cancel-button">{cancelText}</span> : null}
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
						color: 'red',
						marginTop: '8px'
					}}
				>
					{errorText}
				</Typography>
			)}
		</React.Fragment>
);

export default (withTranslations()(DateTimePickerWrapper));
