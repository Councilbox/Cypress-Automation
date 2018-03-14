import React from 'react';
import withSharedProps from '../../HOCs/withSharedProps';

const Pruebas = ({ company, translate }) => {
    return(
        <div style={{width: '10em', border: '3px solid red'}}>{translate.accept}</div>
    )
}

export default withSharedProps()(Pruebas);