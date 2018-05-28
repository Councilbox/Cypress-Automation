import React from 'react';
import { getSecondary } from '../styles/colors';
import { Tooltip, MenuItem } from 'material-ui';

const FilterButton = ({ onClick, children, active, tooltip }) => (<Tooltip title={tooltip}>
    <div
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2em',
            cursor: 'pointer',
            height: '2em',
            border: `2px solid ${getSecondary()}`,
            borderRadius: '3px',
            overflow: 'hidden',
            backgroundColor: 'transparent'
        }}
        onClick={onClick}
    >
        <MenuItem selected={active} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {children}
        </MenuItem>
    </div>
</Tooltip>)

export default FilterButton