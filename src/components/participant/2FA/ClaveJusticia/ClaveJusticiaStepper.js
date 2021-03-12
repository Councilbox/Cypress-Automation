import React from 'react';
import { Stepper, Step, StepLabel } from 'material-ui';
import { getPrimary } from '../../../../styles/colors';


const ClaveJusticiaStepper = ({
	color, success
}) => {
	const primary = getPrimary();

	return (
		<Stepper nonLinear alternativeLabel style={{ height: '10em' }} activeStep={success ? 1 : 0} >
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
