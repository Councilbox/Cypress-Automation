import React from 'react';
import { getPrimary, getSecondary } from '../styles/colors';

const AgendaNumber = ({ index, active, activeColor = getPrimary(), secondaryColor = getSecondary(), onClick, open }) => (
    <div
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '2em',
            filter: open && !active? 'opacity(50%)' : '',
            width: '2em',
            fontSize: '1.1em',
            cursor: 'pointer',
            userSelect: 'none',
            margin: 0,
            color: active || open? 'white' : secondaryColor,
            borderRadius: '1em',
            backgroundColor: active || open? activeColor : 'white',
            border: `3px solid ${active || open? activeColor : secondaryColor}`
        }}
        onClick={onClick}
    >
        {index}
    </div>
);

export default AgendaNumber;