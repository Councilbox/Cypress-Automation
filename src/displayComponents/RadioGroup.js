import React from 'react';
import { RadioGroup, FormControl } from 'material-ui';

export default ( { children, value, onChange, name, style }) => (
    <FormControl component="fieldset">
        <RadioGroup 
            name={name}
            value={value.toString()}
            onChange={onChange}
            style={style}
        >
            {children}
        </RadioGroup>
    </FormControl>
)
