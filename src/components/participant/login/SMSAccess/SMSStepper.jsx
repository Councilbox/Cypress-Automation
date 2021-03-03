import React from 'react';
import { Stepper, Step, StepLabel } from 'material-ui';
import { getPrimary, getSecondary } from '../../../../styles/colors';

const SteperAcceso = ({
	resendKey, translate, responseSMS, error, color, addClass
}) => {
	const primary = getPrimary();
	const secondary = getSecondary();

	const deliveredState = responseSMS === 22 || responseSMS === 25;

	return (
		<Stepper nonLinear alternativeLabel style={{ height: '10em' }} >
			<Step className={'stepperAcceso' + addClass}>
				<StepLabel >
					<span style={{ color: color ? color : primary }}>{translate.room_access}</span>
				</StepLabel>
			</Step>
			<Step className={error ? 'stepperAcceso' + addClass : (responseSMS === 20 || deliveredState) ? 'stepperAcceso' + addClass : 'stepperAccesoNoActived' + addClass}>
				<StepLabel>
					<span style={{ color: color ? color : primary }}>{translate.sms_sent}</span>
				</StepLabel>
			</Step>
			<Step className={error ? 'stepperAccesoFail' + addClass : deliveredState ? 'stepperAcceso' + addClass : 'stepperAccesoNoActived' + addClass}>
				<StepLabel>
					<span style={{ color: color ? color : primary }}>{translate.sms_delivered}</span>
					<br></br>
					<span style={{ color: secondary, cursor: 'pointer' }} onClick={resendKey}>{translate.resend}</span>
				</StepLabel>
			</Step>
			<Step className={'stepperAccesoNoActived' + addClass}>
				<StepLabel>
					<span style={{ color: color ? color : primary }}>{translate.validate_key}</span>
				</StepLabel>
			</Step>
		</Stepper>
	);
};


export default SteperAcceso;
