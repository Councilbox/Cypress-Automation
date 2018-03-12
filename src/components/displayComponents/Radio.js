import React from 'react';
import { Radio } from 'material-ui';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';

export default ({ value, label, style, name, onChange }) => (
    <FormControlLabel
        control={
            <Radio
                checked={value}
                onChange={onChange}
                value="1"
                name={name}
            />
        }
        label={label}
    />
)

