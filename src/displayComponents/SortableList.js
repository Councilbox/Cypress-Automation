import React from "react";
import { SortableContainer } from "react-sortable-hoc";
import DraggableBlock from "./DraggableBlock";

const SortableList = SortableContainer(({ items, offset = 0 }) => {
	return (
		<div>
			{items.map((item, index) => (
				<DraggableBlock
					disabled={item.pointState > 1}
					key={`item-${index}`}
					index={offset + index}
					value={`${item.orderIndex || index} - ${item.agendaSubject}`}
				/>
			))}
		</div>
	);
});

export default SortableList;
