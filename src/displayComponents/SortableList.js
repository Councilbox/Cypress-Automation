import React from "react";
import { SortableContainer } from "react-sortable-hoc";
import DraggableBlock from "./DraggableBlock";
import { getActPointSubjectType } from '../utils/CBX';

const SortableList = SortableContainer(({ items, offset = 0 }) => (
		<div>
			{items.map((item, index) => (
				item.pointState > 1 || item.subjectType === getActPointSubjectType() ?
					<li
						style={{
							opacity: 1,
							width: "100%",
							color: 'grey',
							display: "flex",
							alignItems: "center",
							padding: "0.5em",
							height: "3em",
							border: `2px solid grey`,
							listStyleType: "none",
							borderRadius: "3px",
							marginTop: "0.5em"
						}}
						className="draggable"
					>
						{item.agendaSubject}
					</li>
				:
					<DraggableBlock
						key={`item-${index}`}
						index={offset + index}
						value={item.agendaSubject}
					/>
			))}
		</div>
	));

export default SortableList;
