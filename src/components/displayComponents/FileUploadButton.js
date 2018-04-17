import React, { Fragment } from 'react';
import { Button } from 'material-ui';

const FileUploadButton = ( { onChange, image, text, color, textStyle, textPosition, icon, buttonStyle, flat }) => (
    <Fragment>
        <input
            type="file"
            accept={image? 'image/*' : ''}
            id={'raised-button-file'}
            onChange={onChange}
            style={{cursor: 'pointer', position: 'absolute', top: 0, width: 0, bottom: 0, right: 0, left: 0, opacity: 0, }}
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
    </Fragment>
);

export default FileUploadButton;
                
