import React from 'react';
import MobileStepper from 'material-ui/MobileStepper';


const MStepper = ( { active, total, handleNext, handlePrevious } ) => (
    <MobileStepper
        variant="dots"
        steps={total}
        position="static"
        activeStep={active}
    />
)

export default MStepper;

