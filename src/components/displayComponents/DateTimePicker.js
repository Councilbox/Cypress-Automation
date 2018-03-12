import React from 'react';
import TextField from 'material-ui/TextField';
import { DateTimePicker } from 'material-ui-pickers'
import { IconButton, Typography, Icon, InputAdornment } from 'material-ui';

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