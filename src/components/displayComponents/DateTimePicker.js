import React from 'react';
import DateTimePicker from 'material-ui-datetimepicker';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';

const DateTimePickerWrapper = ({ onChange, floatingText, format, value }) => (
    <DateTimePicker 
        onChange={onChange}
        floatingLabelFixed
        floatingLabelText = {floatingText}
        format= {format}
        value= {value}
        DatePicker={DatePickerDialog}
        TimePicker={TimePickerDialog}
    />
)

export default DateTimePickerWrapper;