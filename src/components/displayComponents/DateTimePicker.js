import React from 'react';
import { DateTimePicker } from 'material-ui-pickers'
import { IconButton, Icon, InputAdornment } from 'material-ui';

const DateTimePickerWrapper = ({ label, required, onChange, floatingText, format, value, minDateMessage, acceptText, cancelText }) => (
    <DateTimePicker
        label={`${label}${required && '*'}`}
        minDateMessage={minDateMessage}
        okLabel={acceptText}
        cancelLabel={cancelText}
        minDate={Date.now()}
        InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <Icon color="primary">event</Icon>
                  </IconButton>
                </InputAdornment>
            ),
        }}
        value={value}
        onChange={onChange}
    />
)

export default DateTimePickerWrapper;