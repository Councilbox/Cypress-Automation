import React from 'react';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';

const FileUploadButton = ( { onChange, text, color, textStyle, textPosition, icon, buttonStyle }) => (
    <RaisedButton 
        label={text}
        backgroundColor={color}
        labelStyle={textStyle}
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
    </RaisedButton>
)

export default FileUploadButton;
                
