import React from 'react';
import Spinner from 'react-spinkit';

const LoadingMainApp = () => (
    <div style={{display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center'}}>
        <Spinner name="double-bounce" color='purple' className="spinner" />   
    </div>
);

export default LoadingMainApp;