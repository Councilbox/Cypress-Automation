import React from 'react';
import { TextField, FormControl, InputAdornment } from 'material-ui';

const TextInput = ({ floatingText = '', type, adornment, value, onChange, errorText, classes, onKeyUp, placeholder, required, min, max, disabled }) => (
    <FormControl style={{
        width: '100%',
        marginTop: 0
    }}>
        <TextField
            label={`${floatingText}${required ? '*' : ''}`}
            value={value}
            style={{
                marginTop: 0,
                width: '100%'
            }}
            placeholder={placeholder}
            InputLabelProps={{
                shrink: true,
            }}
            InputProps={{
                startAdornment: adornment ? <InputAdornment position="start">{adornment}</InputAdornment> : '',
            }}
            FormHelperTextProps={{
                error: !!errorText
            }}
            color="secondary"
            inputProps={{
                min: min,
                max: max
            }}
            type={type}
            disabled={!!disabled}
            onKeyUp={onKeyUp}
            onChange={onChange}
            margin="normal"
            helperText={errorText}
            error={!!errorText}
        />
    </FormControl>);

export default TextInput;