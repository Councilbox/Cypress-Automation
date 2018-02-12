import React from 'react';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';

const BasicButton = ({ color, text, textStyle, buttonStyle, icon, textPosition, onClick, fullWidth }) => (
    <RaisedButton
        backgroundColor={color}
        label={text}
        style={buttonStyle}
        labelStyle={textStyle}
        labelPosition={textPosition}
        onClick={onClick}
        icon={icon}
        fullWidth={fullWidth}
    />
);

export default BasicButton;