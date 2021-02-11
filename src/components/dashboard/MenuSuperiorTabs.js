import React from 'react';
import { MenuItem } from 'material-ui';
import { getPrimary } from '../../styles/colors';
import { SelectInput } from '../../displayComponents';
import { isMobile } from '../../utils/screen';

const MenuSuperiorTabs = ({
	items, setSelect, selected, goToPadre
}) => {
	const set = item => {
		setSelect(item);
		if (goToPadre) {
			goToPadre(item);
		}
	};

	if (isMobile) {
		return (
			<SelectInput
				value={selected}
				onChange={event => set(event.target.value)}
				styles={{ marginTop: '0px', color: getPrimary() }}
			>
				{items.map((item, index) => (
					<MenuItem key={item + index} value={item}>{item}</MenuItem>
				))}
			</SelectInput>
		);
	}
	return (
		<div style={{
			height: '100%',
			fontWeight: 'bold',
			padding: '0.7em',
			display: 'flex',
			borderRadius: '5px',
			boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
			color: getPrimary()
		}}>
			{items.map((item, index) => (
				<div key={index} style={{
					cursor: 'pointer',
					paddingRight: '0.5em',
					paddingLeft: '0.5em',
					color: selected === item ? getPrimary() : '#9f9a9d',
					borderRight: index === items.length - 1 ? '' : '1px solid gainsboro'
				}}
				onClick={() => set(item)}
				>
					{item}
				</div>
			))}
		</div>
	);
};


export default MenuSuperiorTabs;
