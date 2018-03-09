import React from 'react';
import { Checkbox } from 'material-ui';

const CheckBox = ( { value, label, onChange, style }) => (
    <Checkbox
        label={label}
        checked={value}
        onCheck={onChange}
        style={style}
    />
)

export default CheckBox;