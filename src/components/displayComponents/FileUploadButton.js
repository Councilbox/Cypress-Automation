import React, { Fragment } from 'react';
//import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
//import FlatButton from 'material-ui/FlatButton';
import { Button } from 'material-ui';

/*const FileUploadButton = ( { onChange, text, color, textStyle, textPosition, icon, buttonStyle, flat }) => (
    flat? 
        <FlatButton 
            label={text}
            backgroundColor={color}
            labelStyle={textStyle}
            style={buttonStyle}
            icon={icon}
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
            containerElement="label"
        >
            <input
                type="file"
                multiple
                onChange={onChange}
                style={{cursor: 'pointer', position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, width: '100%', opacity: 0, }}
            />
        </RaisedButton>
)*/

const FileUploadButton = () => (
    <Fragment>
        <input
            accept="image/*"
            id="raised-button-file"
            multiple
            type="file"
        />
        <label htmlFor="raised-button-file">
            <Button variant="raised" component="span">
                Upload
            </Button>
        </label>
    </Fragment>
);

export default FileUploadButton;
                
