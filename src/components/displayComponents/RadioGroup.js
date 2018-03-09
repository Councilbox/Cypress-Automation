import React from 'react';
import { RadioButtonGroup } from 'material-ui';

const RadioGroup = ( { children, value, onChange, name, style }) => (
    <RadioButtonGroup 
        name={name}
        valueSelected={value}
        onChange={onChange}
        style={style}
    >
        {children}
    </RadioButtonGroup>
)

export default RadioGroup;