import React from 'react';
import { Button } from 'material-ui';

const BasicButton = ({ color, text, textStyle, buttonStyle, icon, textPosition, onClick, fullWidth }) => (
    <Button
        style={{...buttonStyle, ...textStyle, backgroundColor: color}}
        variant="raised"
        onClick={onClick}
        icon={icon}
        fullWidth={fullWidth}
    >
        {text}
    </Button>
);

export default BasicButton;