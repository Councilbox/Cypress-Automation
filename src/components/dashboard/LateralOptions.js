import React from "react";
import withSharedProps from '../../HOCs/withSharedProps';
import { Icon } from '../../displayComponents';
import { getPrimary, getSecondary, darkGrey } from "../../styles/colors";
import { NavLink } from "react-router-dom";
import { ListItem } from "material-ui";



class LateralOptions extends React.Component {

	render() {
		const { icon, text, first, link, customIcon } = this.props;

		return (
			<NavLink
				to={link}
				className={"links"}
				activeClassName="active"
				href={link}
				active={window.location.pathname === link}
				style={{
					padding: "0px",
					display: 'flex',
					width: '90%',
					borderRadius: "3px",
					alignItems: 'center',
					justifyContent: 'center',
					// background: "#00acc1"
				}}
			// onClick={() => this.setState({ selectedRoute: num })}
			>
				<ListItem
					button
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: 'center',
						justifyContent: 'center',
						padding: "0px",
					}}
				>
					<div
						style={{
							width: '100%',
							height: '60px',
							textAlign: "center",
							marginTop: "0.5em",
							padding: "0px",
							// background: this.state.hover ? "#00acc1" : "",
							borderRadius: "3px"
						}}
					>
						<div style={{ textAlign: "center",alignItems: 'center',justifyContent: 'center',display: 'flex', }}>
							{!customIcon ? (
								<Icon
									className="material-icons"
									style={{
										color: '#ffffffcc',
									}}
								>
									{icon}
								</Icon>
							) : (
									<div
										style={{
											alignItems: 'center',
											justifyContent: 'center',
											display: 'flex',
											width: '1em',
											height: '1em',
											overflow: 'hidden',
											fontSize: '24px',
											userSelect: 'none',
										}}
									>
										{customIcon}
									</div>
								)}
						</div>
						<div style={{
							marginTop: "10px",
							fontSize: '0.55em',
							color: '#ffffffcc'
						}}>
							{text}
						</div>
					</div>
				</ListItem>
			</NavLink>
		);
	}
}


export default withSharedProps()(LateralOptions);
