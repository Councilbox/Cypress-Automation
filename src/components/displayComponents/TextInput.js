import React from 'react';
import { TextField } from 'material-ui';

const TextInput = ({ floatingText, type, value, onChange, errorText }) => (
    <TextField
        floatingLabelText={floatingText}
        floatingLabelFixed={true}
        type={type}
        value={value}
        onChange={onChange}
        errorText={errorText}
    />
);

export default TextInput;