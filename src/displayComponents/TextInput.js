import React from 'react';
import { TextField, FormControl, InputAdornment, IconButton } from 'material-ui';
import { VisibilityOff, Visibility } from 'material-ui-icons';

const TextInput = ({ floatingText = '', type, passwordToggler, showPassword, adornment, value, onChange, errorText, classes, onKeyUp, placeholder, required, min, max, disabled }) => (
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
                inputProps: { min: min, max: max },
                endAdornment: passwordToggler? 
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="Toggle password visibility"
                            style={{
                                outline: 0
                            }}
                            onClick={(event) => {
                                event.stopPropagation();
                                passwordToggler()
                            }}
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                : ''
            }}
            FormHelperTextProps={{
                error: !!errorText
            }}
            color="secondary"
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