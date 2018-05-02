import React from 'react';
import MobileStepper from 'material-ui/MobileStepper';


const MStepper = ({ active, total, handleNext, handlePrevious }) => (

    <MobileStepper
        variant="dots"
        position="static"
        steps={total}
        activeStep={active}
        classes={{margin: '0 auto'}}
    />

);

export default MStepper;

