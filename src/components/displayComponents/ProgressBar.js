import React from 'react';
import LinearProgress from 'material-ui/LinearProgress';

const ProgressBar = ({ value, style, color }) => (
    <LinearProgress mode="determinate" value={value} style={{...style, backgroundColor: 'lightgrey'}} color={color} />
)

export default ProgressBar;