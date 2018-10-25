import React from 'react';
import { isMobile } from 'react-device-detect';
import { darkGrey } from '../styles/colors';


const CBXFooter = () => (
    <div style={{fontSize: '11px', marginTop: isMobile? '1.2em' : '-0.2em', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '1em'}}>
        <div
            dangerouslySetInnerHTML={{ __html: `Copyright &copy 2018`}}
        />
        <span style={{marginLeft: '0.2em', marginRight: '0.2em', color: darkGrey}}>Councilbox Technology S.L.</span>
    </div>
);

export default CBXFooter;