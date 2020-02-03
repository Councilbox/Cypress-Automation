import React from "react";
import { getPrimary } from "../../styles/colors";
import { isMobile } from "react-device-detect";
import { MenuItem } from "material-ui";
import { SelectInput } from "../../displayComponents";


const MenuSuperiorTabs = ({ items, setSelect, selected }) => {
	const set = item => {
		setSelect(item);
	}
	console.log(selected)
	
	if (isMobile) {
		return (
			<SelectInput
				value={selected}
				onChange={event => set(event.target.value)}
				styles={{ marginTop: "0px", color: getPrimary() }}
			>
				{items.map((item, index) => (
					<MenuItem key={item + index} value={item}>{item}</MenuItem>
				))}
			</SelectInput>
		)
	} else {
		return (
			<div style={{
				height: "100%",
				fontWeight: "bold",
				padding: "0.7em",
				display: "flex",
				borderRadius: "5px",
				boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
				color: getPrimary()
			}}>
				{items.map((item, index) => (
					<div key={index} style={{
						cursor: "pointer",
						paddingRight: "0.5em",
						paddingLeft: "0.5em",
						color: selected === item ? getPrimary() : "#9f9a9d",
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
}


export default MenuSuperiorTabs;
