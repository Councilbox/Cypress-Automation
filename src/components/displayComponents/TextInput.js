import React from 'react';
import { TextField } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import { getPrimary } from '../../styles/colors';

const TextInput = ({ floatingText, type, value, onChange, errorText, classes }) => (
    <TextField
        label={floatingText}
        value={value}
        onChange={onChange}
        margin="normal"
        error={!!errorText}
    />
);

export default TextInput;