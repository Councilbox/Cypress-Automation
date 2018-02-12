import React from 'react';
import {TextField} from 'material-ui';

const RichTextField = ({floatingText, type, value, onChange, errorText}) => (<TextField
    floatingLabelText={floatingText}
    floatingLabelFixed={true}
    type={type}
    multiLine={true}
    rows={4}
    value={value}
    onChange={onChange}
    errorText={errorText}/>);

export default RichTextField;