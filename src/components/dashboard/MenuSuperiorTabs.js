import React from "react";
import { getPrimary } from "../../styles/colors";


const MenuSuperiorTabs = ({ items, setSelect }) => {
	const [toggle, setToggle] = React.useState(items[0]);
	
	const set = (item) => {
		setToggle(item)
		setSelect(item)
	}
	
	return (
		<div style={{ height: "100%", fontWeight: "bold", padding: "0.7em", display: "flex", borderRadius: "5px", boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)", }}>
			{items.map((item, index) => (
				<div key={index} style={{
					cursor: "pointer",
					paddingRight: "0.5em",
					paddingLeft: "0.5em",
					color: toggle === item ? getPrimary() : "#9f9a9d",
					borderRight: index === items.length - 1 ? "" : "1px solid gainsboro"
				}}
					onClick={() => set(item)}
				>
					{item}
				</div>
			))}
		</div>
	)
}


export default MenuSuperiorTabs;
