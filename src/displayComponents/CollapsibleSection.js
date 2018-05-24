import React from 'react';
import Collapsible from 'react-collapsible';

const CollapsibleSection = ({ trigger, collapse, open }) => (
    <Collapsible trigger={<div style={{cursor: 'pointer'}}>{trigger()}</div>} open={open}>
        {collapse()}
    </Collapsible>
);

export default CollapsibleSection;