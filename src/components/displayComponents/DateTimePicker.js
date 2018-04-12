import React from 'react';
import { DateTimePicker } from 'material-ui-pickers'
import { IconButton, Icon, InputAdornment, Typography } from 'material-ui';

const DateTimePickerWrapper = ({ label, required, onChange, floatingText, format, value, minDate, minDateMessage, acceptText, cancelText, errorText }) => (
    <React.Fragment>
        <DateTimePicker
            label={`${label}${required && '*'}`}
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
                ),
            }}
            value={new Date(value).toISOString()}
            onChange={onChange}
        />
        {!!errorText &&
            <Typography variant="caption" style={{color: 'red'}}>
                {errorText}
            </Typography>
        }
    </React.Fragment>
)

export default DateTimePickerWrapper;