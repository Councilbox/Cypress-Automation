import React from 'react';
import { Stepper, Step, StepLabel } from 'material-ui';
import { getPrimary } from '../../../../styles/colors';


const ClaveJusticiaStepper = ({
	color,
	success,
	translate
}) => {
	const primary = getPrimary();

	return (
		<Stepper nonLinear alternativeLabel style={{ height: '10em' }} activeStep={success ? 1 : 0} >
			<Step>
				<StepLabel >
					<span style={{ color: color || primary }}>{translate.request_clave_pin}</span>
				</StepLabel>
			</Step>
			<Step>
				<StepLabel>
					<span style={{ color: color || primary }}>{translate.clave_pin_sent}</span>
				</StepLabel>
			</Step>
			<Step>
				<StepLabel>
					<span style={{ color: color || primary }}>{translate.validate_clave_pin}</span>
				</StepLabel>
			</Step>
		</Stepper>
	);
};


export default ClaveJusticiaStepper;
