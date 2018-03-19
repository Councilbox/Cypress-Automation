import React from 'react';
import { DateTimePicker } from 'material-ui-pickers'
import { IconButton, Icon, InputAdornment } from 'material-ui';

const DateTimePickerWrapper = ({ label, onChange, floatingText, format, value }) => (
    <DateTimePicker
        label={label}
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