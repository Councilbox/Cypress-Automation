import React from 'react';
import { FontIcon } from 'material-ui';

const Icon = ({ className, children, style, onClick }) => (
    <FontIcon
        className={className}
        style={style}
        onClick={onClick}
    >
        {children}
    </FontIcon>
)

export default Icon;