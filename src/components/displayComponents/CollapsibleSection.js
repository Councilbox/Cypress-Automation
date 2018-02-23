import React from 'react';
import Collapsible from 'react-collapsible';

const CollapsibleSection = ({ trigger, collapse }) => (
    <Collapsible trigger={trigger()}>
        {collapse()}
    </Collapsible>
)

export default CollapsibleSection;