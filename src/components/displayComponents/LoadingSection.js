import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const LoadingSection = ({ size = 60 }) => (
    <div style={{display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
        <CircularProgress size={size} thickness={7} color={'purple'} />   
    </div>
);

export default LoadingSection;