import React from 'react';
import FontAwesome from 'react-fontawesome';
import { getPrimary } from '../../styles/colors';

const SectionTitle = ({icon, title, subtitle}) => (
    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '1em'}}>
        <FontAwesome
            name={icon}
            color={getPrimary()}
            style={{margin: '0.5em', color: getPrimary(), fontSize: '5em'}}
        />
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <h3 style={{fontWeight: '700'}}>{title}</h3>
            <div>{subtitle}</div>
        </div>
    </div>  
);

export default SectionTitle;