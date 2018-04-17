import React from 'react';
import Stepper, { Step, StepContent, StepLabel } from 'material-ui/Stepper';

const SignUpStepper = ({ active, translate, windowSize }) => {

    if(windowSize !== 'xs'){
        return(
            <Stepper activeStep={active} orientation={"vertical"}>
                <Step>
                    <StepLabel>{translate.company_data}</StepLabel>
                    <StepContent></StepContent>
                </Step>
                <Step>
                    <StepLabel>{translate.user_data}</StepLabel>
                    <StepContent></StepContent>
                </Step>
                <Step>
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