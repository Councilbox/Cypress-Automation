import React from 'react';
import { moment } from '../../../containers/App';
import { isMobile } from '../../../utils/screen';

const ParticipantInfo = ({ appointment, translate, participant }) => {
	const Participant = (
		<>
			<div style={{ fontWeight: '700' }}>{participant.name} {participant.surname}</div>
			<div><b>{translate.dni}:</b> {participant.dni}</div>
		</>
	);

	const AppointMent = (
		<>
			<div><b>{translate.appointment_place}:</b> {appointment.company?.businessName}</div>
			<div><b>{translate.appointment_type}:</b> {translate[appointment.statute?.title] || appointment.statute?.title}</div>
			<div><b>{translate.date}:</b> {`${moment(appointment.dateStart).format('DD / MMMM / yyyy HH:mm')}h`}</div>
		</>
	);

	return (
		<div
			style={{
				marginTop: '1.3em',
				objectFit: 'contain',
				width: '100%',
				fontSize: '16px',
				display: 'flex',
				justifyContent: 'space-evenly',
				flexDirection: isMobile ? 'column' : 'row',
				alignItems: 'center',
				color: 'var(--primary)',
				borderRadius: '2px',
				padding: '1em 2em',
				backgroundColor: 'rgba(187, 210, 241, 0.34)'
			}}
		>
			<div>
				{Participant}
			</div>
			<div>
				{AppointMent}
			</div>
		</div>
	);
};

export default ParticipantInfo;
