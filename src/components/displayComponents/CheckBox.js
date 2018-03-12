import React from 'react';
import { Checkbox } from 'material-ui';
import { FormGroup, FormControlLabel } from 'material-ui/Form';

const CheckBox = ( { value, label, onChange, style }) => (
    <FormControlLabel
        control={
            <Checkbox
              checked={value}
              onChange={onChange}
            />
        }
        label={label}
    />
)

export default CheckBox;