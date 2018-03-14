import React from 'react';
import { TextField } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import { getPrimary } from '../../styles/colors';

const TextInput = ({ floatingText, type, value, onChange, errorText, classes, onKeyUp }) => (
    <TextField
        label={floatingText}
        value={value}
        type={type}
        onKeyUp={onKeyUp}
        onChange={onChange}
        margin="normal"
        error={!!errorText}
    />
);

export default TextInput;