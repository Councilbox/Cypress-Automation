import React from 'react';
import Spinner from 'react-spinkit';
import { getPrimary } from '../../styles/colors';

const LoadingMainApp = () => (
    <div style={{display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center'}}>
        <Spinner name="double-bounce" color={'primary'} className="spinner" />   
    </div>
);

export default LoadingMainApp;