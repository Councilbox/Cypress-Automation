import React from 'react';
import Stepper, { Step, StepContent, StepLabel } from 'material-ui/Stepper';

const SignUpStepper = ({ active, translate, windowSize, goToPage }) => {

    if(windowSize !== 'xs'){
        return(
            <Stepper activeStep={active} orientation={"vertical"}>
                <Step onClick={() => goToPage(1)}>
                    <StepLabel>{translate.company_data}</StepLabel>
                    <StepContent></StepContent>
                </Step>
                <Step onClick={() => goToPage(2)}>
                    <StepLabel>{translate.user_data}</StepLabel>
                    <StepContent></StepContent>
                </Step>
                <Step onClick={() => goToPage(3)}>
                    <StepLabel>{translate.billing_information}</StepLabel>
                    <StepContent></StepContent>
                </Step>
            </Stepper>
        );
    }

    return(
        <Stepper activeStep={active} orientation={"horizontal"}>
            <Step>
                <StepLabel>{translate.company_data}</StepLabel>
            </Step>
            <Step>
                <StepLabel>{translate.user_data}</StepLabel>
            </Step>
            <Step>
                <StepLabel>{translate.billing_information}</StepLabel>
            </Step>
        </Stepper>
    )
};

export default SignUpStepper;