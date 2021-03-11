import React from 'react';
import { Stepper, Step, StepLabel } from 'material-ui';
import { getPrimary, getSecondary } from '../../../../styles/colors';

const ClaveJusticiaStepper = ({
	translate, responseSMS, error, color, addClass
}) => {
	const primary = getPrimary();
	const secondary = getSecondary();

	const deliveredState = responseSMS === 22 || responseSMS === 25;

	return (
		<Stepper nonLinear alternativeLabel style={{ height: '10em' }} >
			<Step className={`stepperAcceso${addClass}`}>
				<StepLabel >
					<span style={{ color: color || primary }}>{'Solicitar clave pin'}</span>
				</StepLabel>
			</Step>
			<Step className={error ? `stepperAcceso${addClass}` : (responseSMS === 20 || deliveredState) ? `stepperAcceso${addClass}` : `stepperAccesoNoActived${addClass}`}>
				<StepLabel>
					<span style={{ color: color || primary }}>{'Clave pin enviada'}</span>
				</StepLabel>
			</Step>
			<Step className={`stepperAccesoNoActived${addClass}`}>
				<StepLabel>
					<span style={{ color: color || primary }}>{'Validar clave pin'}</span>
				</StepLabel>
			</Step>
		</Stepper>
	);
};


export default ClaveJusticiaStepper;
