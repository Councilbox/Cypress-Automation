import React from 'react';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

const FileUploadButton = ( { onChange, text, color, textStyle, textPosition, icon, buttonStyle, flat }) => (
    flat? 
        <FlatButton 
            label={text}
            backgroundColor={color}
            labelStyle={textStyle}
            style={buttonStyle}
            icon={icon}
            labelPosition="after"
            containerElement="label"
        >
            <input
                type="file"
                multiple
                onChange={onChange}
                style={{cursor: 'pointer', position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, width: '100%', opacity: 0, }}
            />
        </FlatButton>
    :
        <RaisedButton 
            label={text}
            backgroundColor={color}
            labelStyle={textStyle}
            icon={icon}
            buttonStyle={buttonStyle}
            labelPosition="after"
            containerElement="label"
        >
            <input
                type="file"
                multiple
                onChange={onChange}
                style={{cursor: 'pointer', position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, width: '100%', opacity: 0, }}
            />
        </RaisedButton>
)

export default FileUploadButton;
                
