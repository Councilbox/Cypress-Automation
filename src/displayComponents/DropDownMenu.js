import React, { Fragment } from "react";
import { Popover } from 'material-ui'; 
import { BasicButton } from "./index";

class DropDownMenu extends React.Component {
	state = {
		anchorEl: null
	};

	close = () => {
		this.handleClose();
	};

	handleClick = event => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleClose = () => {
		this.setState({ anchorEl: null });
	};

	render() {
		const { anchorEl } = this.state;
		const {
			text,
			Component,
			items,
			id,
			textStyle,
			buttonStyle,
			color,
			type,
			icon,
		} = this.props;

		return (
			<Fragment>
				{!!Component ? (
					<div onClick={this.handleClick} style={{width: '100%'}}>
						<Component />
					</div>
				) : (
					<BasicButton
						type={type}
						onClick={this.handleClick}
						textStyle={{
							...textStyle,
							textTransform: "none"
						}}
						color={color}
						icon={icon}
						buttonStyle={buttonStyle}
						text={text}
					/>
				)}

				<Popover
					id={id}
					open={Boolean(anchorEl)}
					anchorEl={anchorEl}
					onClose={this.handleClose}
				>
					<div onClick={this.handleClose}>
						{items}
					</div>
				</Popover>
			</Fragment>
		);
	}
}

export default DropDownMenu;
