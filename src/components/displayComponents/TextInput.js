import React from 'react';
import { TextField, FormControl, InputLabel, InputAdornment } from 'material-ui';

const TextInput = ({ floatingText = '', type, adornment, value, onChange, errorText, classes, onKeyUp, placeholder, required }) => (
    <FormControl style={{width: '100%'}}>
        <InputLabel></InputLabel>
        <TextField
            label={`${floatingText} ${required? '*' : ''}`}
            value={value}
            placeholder={placeholder}
            InputLabelProps={{
                shrink: true,
            }}
            InputProps={{
                startAdornment: adornment? <InputAdornment position="start">{adornment}</InputAdornment> : '',
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