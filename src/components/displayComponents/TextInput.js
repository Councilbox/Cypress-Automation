import React from 'react';
import { TextField, FormControl } from 'material-ui';

const TextInput = ({ floatingText, type, value, onChange, errorText, classes, onKeyUp, placeholder, required }) => (
    <FormControl style={{width: '100%'}}>
        <TextField
            label={`${floatingText} ${required? '*' : ''}`}
            value={value}
            placeholder={placeholder}
            InputLabelProps={{
                shrink: true,
            }}
            FormHelperTextProps={{
                error: !!errorText
            }}
            color="secondary"
            type={type}
            onKeyUp={onKeyUp}
            onChange={onChange}
            margin="normal"
            helperText={errorText}
            error={!!errorText}
        />
    </FormControl>
);

export default TextInput;