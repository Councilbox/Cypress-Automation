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

const styles = {whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'}

const UserMenu = ({ user, actions, translate, company }) => {
	console.log(company);
	return (
		<DropDownMenu
			color="transparent"
			id={'user-menu-trigger'}
			text={
				<Tooltip title={company.businessName}>
					<div style={{ display: "flex", alignItems: "center" }}>
						<div style={{ width: "100px", height: "32px", marginRight: "10px" }}>
							<img src={!company.logo ? "" : company.logo} className={!company.logo ? 'imageAfterHeader' : ""} style={{ width: "auto", height: "auto", borderRadius: '6px', maxHeight: "30px", maxWidth: "100px" }} />
						</div>
						<Icon className="material-icons" style={{ color: secondary }}>
							account_circle
				</Icon>
					</div>
				</Tooltip>

			}
			textStyle={{ color: secondary, margin: "7px 15px", padding: "2px", border: "1px solid gainsboro" }}
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
				<Fragment >
					<div style={{ margin: "1em", width: /*"400px"*/"91%" }} >
						<div style={{ display: "flex", paddingBottom: "0.5em", justifyContent: 'center', alignItems: 'center'  }}>
							{/* <div style={{ height: '69px', width: '19%', position: "relative", borderRadius: '50%', overflow: 'hidden', marginRight: "2em" }}>
								<ImageCircular
									styles={{ width: "70px", height: "70px" }}
									src={company.logo}
								>
								</ImageCircular>
							</div> */}
							<div style={{ width: '63%', marginRight: "3%" }}>
								<b style={styles}>{user.name + " " + user.surname} </b>
								<div>{user.phone}</div>
								<div style={styles} >{user.email}</div>
							</div>
							<div style={{ width: '34%', overflow: "hidden"}}>
								<MenuItem style={{ border: "1px solid #ddd", marginRight: "1em", width:"80%", padding: "9px", justifyContent: 'center', alignItems: 'center' }}>
									<Link to={`/user/${user.id}`} >
										<div
											style={{
												width: '100%',
												display: 'flex',
												flexDirection: 'row',
												justifyContent: 'space-between',
												alignItems: 'center',
												lineHeight: "1"
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
											<span style={{ marginLeft: '.4em'}}>
												{translate.settings}
											</span>
										</div>
									</Link>
								</MenuItem>
							</div>
						</div>
						<Divider />
						<div style={{ display: "flex", paddingBottom: "1em", paddingTop: "0.5em" }}>
							<div style={{ minWidth: "75px", height: '75px', width: '20%', position: "relative", borderRadius: '50%', overflow: 'hidden', marginRight: "2em" }}>
								<ImageCircular
									src={!company.logo ? "" : company.logo}
									styles={{ width: "80px", height: "80px" }}
								>
									<a href={`/company/${company.id}/settings`}>
										<span style={{ color: "white", backgroundColor: "#0000007a", position: 'absolute', top: "62%",  width: '75px', textAlign: "center", paddingBottom: '13px', paddingTop: "3px", fontSize: "13px" }}>{translate.change}</span>
									</a>
								</ImageCircular>
							</div>
							<div style={{ width: '65%', padding: '0.2em' }}>
								<b>{company.businessName}</b>
								<div>{company.tin}</div>
								{/* <div>{company.domainmessages}</div> */}
								<div>
									<a
										href={`/company/${company.id}/settings`}
									>
									Info empresa
									</a>
								</div>
							</div>
						</div>
						<Divider />
						<div style={{ display: "flex", paddingTop: "1em", justifyContent: 'flex-end' }}>
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
			className={!src ? 'imageAfter' : ""}
			style={{
				height: '100px',
				width: '100px',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: '0 center',
				// borderRadius: '50%',
				backgroundSize: 'cover',
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
