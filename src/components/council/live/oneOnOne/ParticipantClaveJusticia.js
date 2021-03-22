import React from 'react';
import { withApollo } from 'react-apollo';
import { BasicButton } from '../../../../displayComponents';
import { getPrimary } from '../../../../styles/colors';
import SendClaveJusticiaModal from './SendClaveJusticiaModal';
import CheckClaveJusticiaForm from './CheckClaveJusticiaForm';
import useClaveJusticia from '../../../../hooks/claveJusticia';


const ParticipantClaveJusticia = ({ participant, client, translate }) => {
	const [modal, setModal] = React.useState(null);
	const [loading, setLoading] = React.useState(false);
	const [step, setStep] = React.useState(participant.claveJusticiaPending ? 2 : 1);
	const primary = getPrimary();

	const {
		checkClaveJusticia,
		status
	} = useClaveJusticia({ client, participantId: participant.id });

	const disabled = participant.online === 0;

	React.useEffect(() => {
		let timeout;
		if (step === 3) {
			timeout = setTimeout(() => {
				setStep(1);
			}, 2500);
		}
		return () => clearTimeout(timeout);
	}, [step]);

	React.useEffect(() => {
		if (status === 'VALIDATION_SUCCESS' && step !== 3) {
			setStep(3);
		}
	}, [status]);

	const checkClave = async pin => {
		setLoading(true);
		await checkClaveJusticia(pin);
		setLoading(false);
	};

	return (
		<>
			<SendClaveJusticiaModal
				requestClose={() => setModal(false)}
				participantId={participant.id}
				translate={translate}
				open={modal}
				successCB={() => {
					setModal(false);
					setStep(2);
				}}
			/>
			{step === 1 &&
				<BasicButton
					text={translate.send_clave_pin}
					color={disabled ? 'silver' : primary}
					disabled={disabled}
					type="flat"
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
				<CheckClaveJusticiaForm
					sendKey={key => checkClave(key)}
					error={status === 'VALIDATION_FAILED'}
					loading={loading}
				/>
			}
			{step === 3 &&
				<div style={{ height: '100%', display: 'flex', alignItems: 'center', margin: 'auto', marginRight: '1em' }}>
					<i className="fa fa-check" style={{ color: 'limegreen', marginRight: '0.4em', width: '15px' }} aria-hidden="true"></i>
					Clave justicia validada con éxito
				</div>
			}
		</>
	);
};

export default withApollo(ParticipantClaveJusticia);
