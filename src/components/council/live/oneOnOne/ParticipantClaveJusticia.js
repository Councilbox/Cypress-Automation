import React from 'react';
import { BasicButton } from '../../../../displayComponents';
import { getPrimary } from '../../../../styles/colors';
import AccessClaveJusticiaForm from '../../../participant/2FA/ClaveJusticia/AccessClaveJusticiaForm';
import SendClaveJusticiaModal from './SendClaveJusticiaModal';

const ParticipantClaveJusticia = ({ participant, translate }) => {
	const [modal, setModal] = React.useState(null);
	const [error, setError] = React.useState('');
	const [step, setStep] = React.useState(2);
	const primary = getPrimary();

	const disabled = participant.online === 0;

	return (
		<>
			<SendClaveJusticiaModal
				requestClose={() => setModal(false)}
				participantId={participant.id}
				open={modal}
				successCB={() => {
					setModal(false);
					setStep(2);
				}}
			/>
			{step === 1 &&
				<BasicButton
					text="Enviar pin"
					color={disabled ? 'silver' : primary}
					disabled={disabled}
					onClick={() => setModal(true)}
					textStyle={{
						color: 'white',
						fontWeight: '700'
					}}
					buttonStyle={{
						marginRight: '1em'
					}}
				/>
			}
			{step === 2 &&
				<AccessClaveJusticiaForm
					sendKey={key => console.log(key)}
					error={error}
				/>
			}
		</>
	);
};

export default ParticipantClaveJusticia;