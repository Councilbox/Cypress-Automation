import React from 'react';
import { Stepper, Step, StepLabel } from 'material-ui';
import { getPrimary, getSecondary } from '../../../../styles/colors';


const ClaveJusticiaStepper = ({
	translate, error, color, addClass, success
}) => {
	const primary = getPrimary();
	const secondary = getSecondary();

	const deliveredState = success;

	console.log(deliveredState, error);

	return (
		<Stepper nonLinear alternativeLabel style={{ height: '10em' }} activeStep={1} >
			<Step>
				<StepLabel >
					<span style={{ color: color || primary }}>{'Solicitar clave pin'}</span>
				</StepLabel>
			</Step>
			<Step>
				<StepLabel>
					<span style={{ color: color || primary }}>{'Clave pin enviada'}</span>
				</StepLabel>
			</Step>
			<Step>
				<StepLabel>
					<span style={{ color: color || primary }}>{'Validar clave pin'}</span>
				</StepLabel>
			</Step>
		</Stepper>
	);
};


export default ClaveJusticiaStepper;
