import React from 'react';
import Tooltip from 'material-ui/Tooltip';

const ToolTip = ({ children, text, position }) => (
    <Tooltip title={text} placement={position} children={children}>
    </Tooltip>
)

export default ToolTip;