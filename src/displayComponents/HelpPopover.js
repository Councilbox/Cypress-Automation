import React from 'react';
import Popover from 'antd/lib/popover';
import 'antd/lib/popover/style/index.css';
import { getPrimary } from '../styles/colors';

const DefaultTrigger = ({ onClick, color }) => {
	const primary = getPrimary();

	return (
		<span onClick={onClick}>
			<i className="material-icons" style={{
				color: color || primary,
				fontSize: '14px',
				paddingRight: '0.3em',
				cursor: 'pointer',
				marginLeft: '5px'
			}} >
				help
			</i>
		</span>

	);
};

const HelpPopover = ({ ...props }) => {
	const [state, setState] = React.useState({
		visible: false
	});

	const onVisibleChange = visible => {
		setState({
			...state,
			visible
		});
	};

	const toggleVisible = event => {
		event.stopPropagation();
		setState({
			...state,
			visible: !state.visible
		});
	};


	const {
		title = 'title',
		content = 'content',
		TriggerComponent = DefaultTrigger,
		errorText,
		colorHelp,
		placement
	} = props;

	return (
		<Popover
			title={<span style={{ userSelect: 'none' }}>{title}</span>}
			content={<span style={{ userSelect: 'none' }}>{content}</span>}
			visible={state.visible}
			onVisibleChange={onVisibleChange}
			trigger={'hover'}
			placement={placement}
		>
			<TriggerComponent
				onClick={toggleVisible}
				colorFail={errorText}
				color={colorHelp}
			/>
		</Popover>
	);
};

export default HelpPopover;
