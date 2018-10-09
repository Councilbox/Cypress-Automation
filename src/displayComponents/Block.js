import React from 'react';
import { Link, Icon } from './';
import { getSecondary, darkGrey } from '../styles/colors';
import { Card, MenuItem } from 'material-ui';

class Block extends React.Component {

	state = {
		hover: false
	}

	handleMouseEnter = () => {
		this.setState({
			hover: true
		});
	}

	handleMouseLeave = () => {
		this.setState({
			hover: false
		})
	}


	render(){
		const { button, link, icon, text, id, customIcon, disabled, disabledOnClick } = this.props;

		const card = <Card
			id={id}
			elevation={6}
			onMouseEnter={this.handleMouseEnter}
			onMouseLeave={this.handleMouseLeave}
			style={{
				height: "10em",
				borderRadius: '5px',
				backgroundColor: darkGrey,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			<MenuItem
				style={{
					width: '100%',
					height: '10em',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						width: "100%",
						color: 'white',
						fontWeight: "700",
						fontSize: "0.9em",
						...(!disabled? {} : {filter: 'grayscale(100%)'})
					}}
				>
					{customIcon?
						customIcon
					:
						<Icon
							className="material-icons"
							style={{
								fontSize: "7em",
								color: getSecondary()
							}}
						>
							{icon}
						</Icon>
					}

					<span style={{fontSize: '13px'}}>{text}</span>
				</div>
			</MenuItem>
		</Card>;

		return (
			<React.Fragment>
				{disabled?
					<div onClick={disabledOnClick}>
						{card}
					</div>
				:
					<Link to={link}>
						{card}
					</Link>
				}

				{button && (
					<div
						style={{
							display: "flex",
							alignItems: "center",
							fontWeight: "700",
							marginTop: '0.8em'
						}}
					>
						{button}
					</div>
				)}
			</React.Fragment>
		);
	}

}

export default Block;