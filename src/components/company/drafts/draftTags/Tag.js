import React from 'react';
import { Collapse } from 'material-ui';

const Tag = ({
	text, color, childs, width, action
}) => {
	const [open, setOpen] = React.useState(false);
	const [openTimeOut, setOpenTimeOut] = React.useState(false);

	const toggle = () => {
		const time = open ? 200 : 0;
		setTimeout(() => setOpenTimeOut(!open), time);
		setOpen(!open);
	};

	const styles = {
		borderRadius: '14px',
		border: 'solid 1px',
		borderColor: color,
		color,
		padding: '4px 0.8em',
		cursor: 'pointer',
		display: openTimeOut ? width ? 'inline-block' : 'block' : 'inline-block',
		marginRight: '0.5em',
		marginTop: '0.25em',
		marginBottom: '0.25em',
		width: open && width
	};

	if (childs) {
		return (
			<div style={{ ...styles }} >
				<div style={{}}>
					<div style={{ display: 'flex', justifyContent: open && 'space-between', cursor: 'pointer' }} onClick={toggle} >
						<div>{text}</div>
						<div style={{ marginTop: '-5px', height: '5px' }}>
							{open ?
								<i className="material-icons" style={{ fontSize: '27px' }} >
									arrow_drop_up
								</i>
								: <i className="material-icons" style={{ fontSize: '27px' }}>
									arrow_drop_down
								</i>
							}
						</div>
					</div>
					{childs
						&& <Collapse in={open} timeout="auto" unmountOnExit >
							<div>
								{childs}
							</div>
						</Collapse>
					}
				</div>
			</div>
		);
	}
	return (
		<div style={{ ...styles }} onClick={action}>
			{text}
		</div>
	);
};

export default Tag;
