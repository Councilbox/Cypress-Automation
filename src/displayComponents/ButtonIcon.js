import React from 'react';
import { Icon } from './index';

const ButtonIcon = ( { type, color }) => (
    <Icon className="material-icons" style={{color: color, fontSize: '1.1em', marginLeft: '0.3em'}}>{type}</Icon>
);

export default ButtonIcon;