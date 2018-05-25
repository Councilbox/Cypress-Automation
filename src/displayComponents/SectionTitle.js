import React from 'react';
import FontAwesome from 'react-fontawesome';
import { getPrimary } from '../styles/colors';

const SectionTitle = ({ icon, title, subtitle }) => (<div style={{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '0.5em'
}}>
    <FontAwesome
        name={icon}
        color={getPrimary()}
        style={{
            margin: '0.2em 0.4em',
            color: getPrimary(),
            fontSize: '4em'
        }}
    />
    <div style={{
        display: 'flex',
        flexDirection: 'column'
    }}>
        <h3 style={{ fontWeight: '600' }}>{title}</h3>
        <div>{subtitle}</div>
    </div>
</div>);

export default SectionTitle;