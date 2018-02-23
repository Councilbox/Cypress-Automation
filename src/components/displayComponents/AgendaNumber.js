import React from 'react';
import { primary, secondary } from '../../styles/colors';

const AgendaNumber = ({ index, active, activeColor = primary, secondaryColor = secondary, onClick }) => (
    <div
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '2em',
            width: '2em',
            fontSize: '1.1em',
            margin: 0,
            color: active? 'white' : secondaryColor,
            borderRadius: '1em',
            backgroundColor: active? activeColor : 'white',
            border: `2px solid ${active? activeColor : secondaryColor}`
        }}
        onClick={onClick}
    >
        {index}
    </div>
);

export default AgendaNumber;