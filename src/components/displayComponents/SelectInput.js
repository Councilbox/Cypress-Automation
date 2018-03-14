import React from 'react';
import { Select } from 'material-ui';
import { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

const TextInput = ({ floatingText, id, value, onChange, errorText, children }) => (
    <FormControl style={{width: '100%'}}>
        <InputLabel htmlFor={id}>{floatingText}</InputLabel>
        <Select
            inputProps={{
                name: floatingText,
                id: id,
            }}
            value={value}
            onChange={onChange}
            error={!!errorText}
        >
            {children}
        </Select>
    </FormControl>
);

export default TextInput;