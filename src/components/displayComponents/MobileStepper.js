import React from 'react';
import MobileStepper from 'material-ui/MobileStepper';
import Button from 'material-ui/Button';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';


const MStepper = ( { active, total, handleNext, handlePrevious } ) => (
    <MobileStepper
        variant="dots"
        steps={total}
        position="static"
        activeStep={active}
    />
)

export default MStepper;

