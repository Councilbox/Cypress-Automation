import React from 'react';
import Stepper, { Step, StepLabel, StepContent } from 'material-ui/Stepper';

const SignUpStepper = ({ active, translate, windowSize }) => {

    if(windowSize !== 'xs'){
        return(
            <Stepper activeStep={active} orientation={"vertical"}>
                <Step>
                    <StepLabel>{'1'}</StepLabel>
                    <StepContent>{translate.company_data}</StepContent>
                </Step>
                <Step>
                    <StepLabel>{'2'}</StepLabel>
                    <StepContent>{translate.user_data}</StepContent>
                </Step>
                <Step>
                    <StepLabel>{'3'}</StepLabel>
                    <StepContent>{translate.billing_information}</StepContent>
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
}

export default SignUpStepper;