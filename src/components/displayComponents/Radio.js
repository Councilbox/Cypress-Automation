import React from 'react';
import { RadioButton } from 'material-ui';

const Radio = ({ value, label, style }) => (
    <RadioButton
        value={value}
        label={label}
        style={style}
    />
)

export default Radio;
