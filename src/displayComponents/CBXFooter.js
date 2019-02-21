import React from 'react';
import { isMobile } from 'react-device-detect';
import { darkGrey } from '../styles/colors';
import { CLIENT_VERSION } from '../config';
const date = new Date()

const year = date.getFullYear();

const CBXFooter = () => (
    <div style={{fontSize: '11px', marginTop: isMobile? '1.2em' : '-0.2em', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '1em'}}>
        <div
            dangerouslySetInnerHTML={{ __html: `Copyright &copy ${year}`}}
        />
        <span style={{marginLeft: '0.2em', marginRight: '0.2em', color: darkGrey}}>{`v${CLIENT_VERSION} - Councilbox Technology S.L.`}</span>
    </div>
);

export default CBXFooter;