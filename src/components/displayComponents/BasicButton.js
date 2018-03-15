import React from 'react';
import { Button } from 'material-ui';

const BasicButton = ({ color, text, textStyle, buttonStyle, icon, type, textPosition, onClick, fullWidth }) => (
    <Button
        style={{...buttonStyle, ...textStyle, backgroundColor: color}}
        variant={type}
        onClick={onClick}
        icon={icon}
        fullWidth={fullWidth}
    >
        {text}
        {icon}
    </Button>
);

export default BasicButton;