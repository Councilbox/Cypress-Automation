import React from 'react';
import Collapsible from 'react-collapsible';

const CollapsibleSection = ({ trigger, collapse, open, onTriggerClick, style, controlled = false, onClose }) => (
	<Collapsible
		trigger={<div style={{ cursor: 'pointer', ...style }}>{trigger()}</div>}
		triggerDisabled={controlled}
		{...(onTriggerClick ? { handleTriggerClick: onTriggerClick } : {})}
		open={open}
		onClose={onClose}
	>
		{collapse()}
	</Collapsible>
);

export default CollapsibleSection;
