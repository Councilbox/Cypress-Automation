import React from 'react';
import { MenuItem } from 'material-ui';

export default ({ value, onClick, style, children }) => (
    <MenuItem
        value={value}
        onClick={onClick}
        style={style}
    >
        {children}
    </MenuItem>
)
