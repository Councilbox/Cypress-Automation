import React, { Fragment } from "react";
import { getSecondary } from "../../styles/colors";
import * as mainActions from "../../actions/mainActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { MenuItem, Divider } from "material-ui";
import { DropDownMenu, Icon, Link, BasicButton } from "../../displayComponents";
import FontAwesome from 'react-fontawesome';
import { Tooltip } from "material-ui";

const secondary = getSecondary();

const UserMenu = ({ user, actions, translate }) => {
	return (
		<DropDownMenu
			color="transparent"
			id={'user-menu-trigger'}
			text={
				<Tooltip title={"Empresa!"}>
					<div style={{ display: "flex", alignItems: "center" }}>
						<div style={{ width: "100px", height: "32px", marginRight: "10px" }}>
							<img src={'https://www.uwosh.edu/couns_center/internal_images/text-line/image'} style={{ width: "100%", height: "100%", borderRadius: '6px' }} />
						</div>
						<Icon className="material-icons" style={{ color: secondary }}>
							account_circle
				</Icon>
					</div>
				</Tooltip>

			}
			textStyle={{ color: secondary }}
			type="flat"
			icon={

				<Icon className="material-icons" style={{ color: secondary }}>
					keyboard_arrow_down
					</Icon>

			}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
			items={
				<Fragment>
					{/* <MenuItem>
						<Link to={`/user/${user.id}`}>
							<div
								style={{
									width: '100%',
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'space-between'
								}}
								id={'user-menu-settings'}
							>
								<FontAwesome
									name={'edit'}
									style={{
										cursor: "pointer",
										fontSize: "1.2em",
										color: secondary
									}}
								/>
								<span style={{marginLeft: '2.5em', marginRight: '0.8em'}}>
									{translate.settings}
								</span>
							</div>
						</Link>
					</MenuItem>
					<Divider />
					<MenuItem onClick={() => actions.logout()}>
						<div
								style={{
									width: '100%',
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'space-between'
								}}
								id={'user-menu-logout'}
							>
								<FontAwesome
									name={'external-link'}
									style={{
										cursor: "pointer",
										fontSize: "1.2em",
										color: 'red'
									}}
								/>
								<span style={{marginLeft: '2.5em', marginRight: '0.8em'}}>
									{translate.logout}
								</span>
							</div>
					</MenuItem> */}
					<div style={{ margin: "1em" }}>
						<div style={{ display: "flex", paddingBottom: "1em" }}>
							<div style={{ width: '35%', position:"relative" }}>
								<ImageCircular
									src={'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Information_icon_with_gradient_background.svg/62px-Information_icon_with_gradient_background.svg.png'}
								>
									<span style={{ position: 'absolute', top: "50%", left: "22px" }}>change</span>
								</ImageCircular>
							</div>
							<div style={{ width: '65%' }}>
								<b>Nombre</b>
								<div>Correo</div>
								<div>mas cosas</div>
								<div>
									<BasicButton
										text="cuentaloksea"
										buttonStyle={{ padding: "5px 25px", marginTop: "15px" }}
									>
									</BasicButton>
								</div>
							</div>
						</div>
						<Divider />
						<div style={{ display: "flex", paddingBottom: "0.5em", paddingTop: "0.5em" }}>
							<div style={{ width: '25%' }}>
								<ImageCircular
									styles={{ width: "70px", height: "70px" }}
									src={'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Information_icon_with_gradient_background.svg/62px-Information_icon_with_gradient_background.svg.png'}
								>
								</ImageCircular>
							</div>
							<div style={{ width: '75%', padding: '0.8em' }}>
								<b>Nombre</b>
								<div>Correo</div>
							</div>
						</div>
						<Divider />
						<div style={{ display: "flex", paddingTop: "1em" }}>
							<MenuItem style={{ border: "1px solid #ddd", marginRight: "1em" }}>
								<Link to={`/user/${user.id}`} >
									<div
										style={{
											width: '100%',
											display: 'flex',
											flexDirection: 'row',
											justifyContent: 'space-between',
											alignItems: 'center'
										}}
										id={'user-menu-settings'}
									>
										<FontAwesome
											name={'edit'}
											style={{
												cursor: "pointer",
												fontSize: "1.2em",
												color: secondary
											}}
										/>
										<span style={{ marginLeft: '2.5em', marginRight: '0.8em' }}>
											{translate.settings}
										</span>
									</div>
								</Link>
							</MenuItem>
							<MenuItem onClick={() => actions.logout()} style={{ border: "1px solid #ddd" }}>
								<div
									style={{
										width: '100%',
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'space-between',
										alignItems: 'center'
									}}
									id={'user-menu-logout'}
								>
									<FontAwesome
										name={'external-link'}
										style={{
											cursor: "pointer",
											fontSize: "1.2em",
											color: 'red'
										}}
									/>
									<span style={{ marginLeft: '2.5em', marginRight: '0.8em' }}>
										{translate.logout}
									</span>
								</div>
							</MenuItem>
						</div>
					</div>
				</Fragment >
			}
		/>
	);
};

const ImageCircular = ({ src, styles, children }) => {
	return (
		<div
			style={{
				height: '100px',
				width: '100px',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: '50%',
				borderRadius: '50%',
				backgroundSize: '100% auto',
				backgroundImage: `url(${src})`,
				...styles
			}}
		>
		{children}
		</div>
	)
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(mainActions, dispatch)
	};
}

export default connect(
	null,
	mapDispatchToProps
)(UserMenu);
