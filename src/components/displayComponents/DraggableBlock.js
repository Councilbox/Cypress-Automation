import React from 'react';
import { SortableElement } from 'react-sortable-hoc';
import { getPrimary } from '../../styles/colors';

const DraggableBlock = SortableElement(({value}) => {
	return(
		<li style={{opacity: 1, width: '100%', color: getPrimary(), display: 'flex', alignItems: 'center', padding: '0.5em',  height: '3em', border: `2px solid ${getPrimary()}`, listStyleType: 'none'}} className="draggable">
			{value}
		</li>
	)
	
});


export default DraggableBlock;