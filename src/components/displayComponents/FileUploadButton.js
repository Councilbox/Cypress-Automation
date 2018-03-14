import React, { Fragment } from 'react';
import { Button } from 'material-ui';

const FileUploadButton = ( { onChange, text, color, textStyle, textPosition, icon, buttonStyle, flat }) => (
    <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <input
            type="file"
            id={'raised-button-file'}
            onChange={onChange}
            style={{cursor: 'pointer', position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, width: '100%', opacity: 0, }}
        />
        <label htmlFor="raised-button-file">
            <Button
                variant={flat? 'flat' : 'raised'}
                component="span"
                style={{...buttonStyle, ...textStyle, backgroundColor: color}}
            >
                {text}
                {icon}
            </Button>
        </label>
    </div>
);

export default FileUploadButton;
                
