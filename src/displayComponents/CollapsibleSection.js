import React from 'react';
import Collapsible from 'react-collapsible';

const CollapsibleSection = ({ trigger, collapse, open }) => (
    <Collapsible trigger={trigger()} open={open}>
        {collapse()}
    </Collapsible>
);

export default CollapsibleSection;