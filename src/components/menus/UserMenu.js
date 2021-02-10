import React, { Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { MenuItem, Divider, Tooltip } from 'material-ui';
import FontAwesome from 'react-fontawesome';
import { DropDownMenu, Icon, Link } from '../../displayComponents';
import * as mainActions from '../../actions/mainActions';
import { getSecondary } from '../../styles/colors';
import { isMobile } from '../../utils/screen';
import { isAdmin } from '../../utils/CBX';

const styles = {
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
	overflow: 'hidden'
};

const UserMenu = ({
 user, actions, translate, company
}) => {
	const secondary = getSecondary();

	return company ? (
		<DropDownMenu
			color="transparent"
			id={'user-menu-trigger'}
			text={
				<Tooltip title={company.businessName}>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<div
							style={{
								width: '100px',
								height: '32px',
								marginRight: '10px'
							}}
						>
							{company.logo ?
								<img
									src={!company.logo ? '' : company.logo}
									className={
										!company.logo ? 'imageAfterHeader' : ''
									}
									alt="company-logo"
									style={{
										width: 'auto',
										height: 'auto',
										borderRadius: '6px',
										maxHeight: '33px',
										maxWidth: '100px'
									}}
								/>
							:								<i className="fa fa-building-o" style={{
									fontSize: '2em',
									width: 'auto',
									color: 'grey',
									height: 'auto',
									borderRadius: '6px',
									maxHeight: '33px',
									maxWidth: '100px'
								}}></i>
							}
						</div>
						<Icon
							className="material-icons"
							style={{ color: secondary }}
						>
							account_circle
						</Icon>
					</div>
				</Tooltip>
			}
			textStyle={{
				color: secondary,
				margin: '7px 15px',
				padding: '2px',
				border: '1px solid gainsboro'
			}}
			type="flat"
			icon={
				<Icon className="material-icons" style={{ color: secondary }}>
					keyboard_arrow_down
				</Icon>
			}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left'
			}}
			items={
				<Fragment>
					<div
						style={{
							margin: '1em',
							width: '91%',
							minWidth: isMobile ? '270px' : '300px'
						}}
					>
						<Link to={`/user/${user.id}`} style={{ width: '100%' }}>
							<MenuItem style={{ height: '100%', width: 'auto' }}>
								<div
									style={{
										display: 'flex',
										paddingBottom: '0.5em',
										alignItems: 'center',
										width: '100%',
										justifyContent: 'space-between'
									}}
								>
									<div
										style={{
											minWidth: '50%',
											marginRight: '3%',
											maxWidth: '215px'
										}}
									>
										<b style={{
											...styles,
											display: 'block',
											width: '100%',
										}}>
											{`${user.name} ${user.surname}` || ''}{' '}
										</b>
										<div>{user.phone}</div>
										<div style={styles}>{user.email}</div>
									</div>
									<div
										style={{
											width: '10%',
											alignItems: 'center',
											textAlign: 'right'
										}}
									>
										<FontAwesome
											name={'edit'}
											style={{
												cursor: 'pointer',
												fontSize: '1.2em',
												color: secondary
											}}
										/>
									</div>
								</div>
							</MenuItem>
						</Link>
						<Divider />
						{isAdmin(user)
							&& <Link to={`/company/${company.id}/settings`}>
								<MenuItem style={{ height: '100%', maxWidth: '270px' }}>
									<div
										style={{
											display: 'flex',
											paddingBottom: '1em',
											paddingTop: '0.5em',
											width: '100%',
											justifyContent: 'center',
											alignItems: 'center',
										}}
									>
										<div
											style={{
												minWidth: '75px',
												height: '75px',
												width: '20%',
												position: 'relative',
												borderRadius: '50%',
												overflow: 'hidden',
												marginRight: '1.5em',
											}}
										>
											<ImageCircular
												src={
													!company.logo ?
														''
														: company.logo
												}
												styles={{
													width: '80px',
													height: '80px'
												}}
											/>
										</div>
										<div
											style={{
												width: '65%',
												padding: '0.4em',
												...styles
											}}
										>
											<b>{company.businessName}</b>
											<div style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{company.tin}</div>
										</div>
										<div style={{ width: '10%' }}>
											<Icon
												className="material-icons"
												style={{
													cursor: 'pointer',
													fontSize: '1.6em',
													color: secondary
												}}
											>
												settings
											</Icon>
										</div>
									</div>
								</MenuItem>
							</Link>
						}
						{user.roles === 'devAdmin' && (
							<React.Fragment>
								<Divider />
								<Link to={'/admin'}>
									<MenuItem
										style={{
											height: '100%',
											background: '#2d2d2d'
										}}
									>
										<div
											style={{
												display: 'flex',
												paddingBottom: '0.5em',
												paddingTop: '0.5em',
												justifyContent: 'center',
												alignItems: 'center',
												width: '100%'
											}}
										>
											<div
												style={{
													width: '90%',
													marginRight: '3%',
													color: 'white'
												}}
											>
												Panel devAdmin
											</div>
											<div
												style={{
													width: '10%',
													alignItems: 'center',
													textAlign: 'right'
												}}
											>
												<i
													className="fa fa-user-secret"
													aria-hidden="true"
													style={{
														cursor: 'pointer',
														fontSize: '1.6em',
														color: 'white'
													}}
												/>
											</div>
										</div>
									</MenuItem>
								</Link>
							</React.Fragment>
						)}
						<Divider />
						<MenuItem
							onClick={actions.logout}
							style={{ height: '100%' }}
						>
							<div
								style={{
									display: 'flex',
									paddingTop: '0.5em',
									paddingBottom: '0.5em',
									justifyContent: 'flex-end',
									width: '100%'
								}}
							>
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
									<span style={{ marginRight: '0.8em' }}>
										{translate.logout}
									</span>
									<FontAwesome
										name={'external-link'}
										style={{
											cursor: 'pointer',
											fontSize: '1.2em',
											color: 'red'
										}}
									/>
								</div>
							</div>
						</MenuItem>
					</div>
				</Fragment>
			}
		/>
	) : (
			<DropDownMenu
				color="transparent"
				id={'user-menu-trigger'}
				text={
					<Icon className="material-icons" style={{ color: secondary }}>
						account_circle
					</Icon>
				}
				textStyle={{ color: secondary }}
				type="flat"
				icon={
					<Icon className="material-icons" style={{ color: secondary }}>
						keyboard_arrow_down
					</Icon>
				}
				items={
					<Fragment>
						<MenuItem>
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
											cursor: 'pointer',
											fontSize: '1.2em',
											color: secondary
										}}
									/>
									<span
										style={{
											marginLeft: '2.5em',
											marginRight: '0.8em'
										}}
									>
										{translate.settings}
									</span>
								</div>
							</Link>
						</MenuItem>
						<Divider />
						<MenuItem onClick={actions.logout}>
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
										cursor: 'pointer',
										fontSize: '1.2em',
										color: 'red'
									}}
								/>
								<span
									style={{
										marginLeft: '2.5em',
										marginRight: '0.8em'
									}}
								>
									{translate.logout}
								</span>
							</div>
						</MenuItem>
					</Fragment>
				}
			/>
		);
};

const ImageCircular = ({ src, styles: style, children }) => (
		<div
			className={!src ? 'imageAfter' : ''}
			style={{
				height: '100px',
				width: '100px',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: '50% center',
				backgroundSize: 'cover',
				backgroundImage: `url(${src})`,
				...style
			}}
		>
			{children}
		</div>
	);

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(mainActions, dispatch)
	};
}

export default connect(
	null,
	mapDispatchToProps
)(UserMenu);
