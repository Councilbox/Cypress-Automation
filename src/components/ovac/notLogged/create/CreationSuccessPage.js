import { Card } from 'material-ui';
import React from 'react';
import { ReactComponent as Checked } from '../../../../assets/img/checked.svg';
import ParticipantInfo from '../../participant/ParticipantInfo';


const CreationSuccessPage = ({ participant, appointment, translate }) => {
	return (
		<Card style={{
			width: '960px',
			padding: '49px 94px 115px 84px',
			objectFit: 'contain',
			display: 'flex',
			alignItems: 'center',
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
				Cita previa confirmada
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
				Ya puede cerrar esta pestaña del navegador. En pocos minutos recibirá un email de confirmación
				con acceso a modificar la cita o preparar la documentación necesaria. Por favor revise su
				bandeja de correo no deseado o spam.
				{/* En caso de no recibirlo en un plazo de 24h póngase en
				contacto a través de soporte@ovac.es */}
			</p>
		</Card>
	);
};

export default CreationSuccessPage;
