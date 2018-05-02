import React from 'react';
import { Radio } from 'material-ui';
import { FormControlLabel } from 'material-ui/Form';

export default ({ value, checked, label, style, name, onChange }) => (
    <FormControlLabel
        control={
            <Radio
                checked={checked}
                onChange={onChange}
                value={value}
                name={name}
            />
        }
        label={label}
    />
)

