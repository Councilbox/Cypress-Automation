import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import DraggableBlock from './DraggableBlock';

const SortableList = SortableContainer(({items}) => {
  return (
    <ul>
      {items.map((item, index) => (
        <DraggableBlock disabled={item.point_state > 1} key={`item-${index}`} index={index} value={`${index + 1} - ${item.agenda_subject}`} />
      ))}
    </ul>
  );
});

export default SortableList;