import React from 'react';
import { getSecondary } from '../styles/colors';


const ParticipantRow = ({ participant, onClick }) => (
    <div onClick={onClick} style={{width: '100%', padding: '0.4em', cursor: 'pointer', paddingLeft: '0.8em', border: `1px solid ${getSecondary()}`, display: 'flex', flexDirection: 'column'}}>
        <div style={{fontWeight: '700', fontSize: '0.9rem'}}>{`${participant.name} ${participant.surname} - ${participant.dni}`}</div>
        <div style={{fontSize: '0.8rem'}}>{`${participant.position} - ${participant.email} - ${participant.phone}`}</div>
    </div>
)

export default ParticipantRow;