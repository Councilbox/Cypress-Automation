import { Card } from 'material-ui';
import React from 'react';
import { ReactComponent as Checked } from '../../../../assets/img/checked.svg';
import { isMobile } from '../../../../utils/screen';
import ParticipantInfo from '../../participant/ParticipantInfo';


const CreationSuccessPage = ({ participant, appointment, translate }) => {
	return (
		<Card style={{
			width: isMobile ? '100%' : '960px',
			padding: isMobile ? '49px 20px' : '49px 94px 115px 115px',
			objectFit: 'contain',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			flexDirection: 'column'
		}}>
			<Checked />
			<div
				style={{
					fontSize: '23px',
					fontWeight: '700',
					color: 'var(--primary)',
					marginTop: '1em'
				}}
			>
				{translate.appointment_confirmed}
			</div>
			<ParticipantInfo
				appointment={appointment}
				participant={participant}
				translate={translate}
			/>
			<p
				style={{
					fontSize: '18px',
					marginTop: '1em'
				}}
			>
				{translate.appointment_confirmed_text}
				{/* En caso de no recibirlo en un plazo de 24h póngase en
				contacto a través de soporte@ovac.es */}
			</p>
		</Card>
	);
};

export default CreationSuccessPage;
