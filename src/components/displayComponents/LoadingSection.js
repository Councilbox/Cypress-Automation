import React from 'react';
import { CircularProgress } from 'material-ui/Progress';
import { getPrimary } from '../../styles/colors';

const LoadingSection = ({ size = 60 }) => (
    <div style={{display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
        <CircularProgress size={size} thickness={7} color={'primary'} />   
    </div>
);

export default LoadingSection;