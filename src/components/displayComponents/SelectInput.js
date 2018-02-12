import React from 'react';
import { SelectField } from 'material-ui';

const TextInput = ({ floatingText, value, onChange, errorText, children }) => (
    <SelectField
        floatingLabelText={floatingText}
        value={value}
        onChange={onChange}
        errorText={errorText}
    >
        {children}
    </SelectField>
);

export default TextInput;