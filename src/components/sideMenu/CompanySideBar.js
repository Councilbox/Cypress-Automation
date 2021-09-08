import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import cx from 'classnames';
import {
	Icon,
	ListItem,
	withStyles,
	Tooltip
} from 'material-ui';
import FontAwesome from 'react-fontawesome';
import sidebarStyleLite from '../../styles/sidebarStyleLite';
import { Link } from '../../displayComponents';
import withWindowSize from '../../HOCs/withWindowSize';
import { getSecondary, darkGrey } from '../../styles/colors';
import { isLandscape, isMobile } from '../../utils/screen';
import CompanyMenu from './CompanyMenu';
import LateralMenuOptions from '../dashboard/LateralMenuOptions';
import { isAdmin } from '../../utils/CBX';


class Sidebar extends React.Component {
	state = {
		selectedRoute: 0,
		companyMenu: false,
		openMenu: false,
		hovered: false
	};

	enter = () => {
		this.setState({
			hovered: true
		});
	}

	leave = () => {
		this.setState({
			hovered: false
		});
	}

	routes = [
		{
			path: `/company/${this.props.company.id}`,
			sidebarName: 'Dashboard',
			name: 'dashboard',
			icon: 'dashboard'
		},
		{
			path: `/company/${this.props.company.id}/councils/drafts`,
			name: 'council',
			sidebarName: this.props.translate.councils_link,
			icon: 'import_contacts'
		},
		{
			path: `/company/${this.props.company.id}/signatures/drafts`,
			name: 'signature',
			sidebarName: this.props.translate.signatures_link,
			icon: 'border_color'
		}
	];

	componentDidMount() {
		const index = this.findActiveRoute(this.props.location.pathname);
		this.setState({
			selectedRoute: index
		});
	}


	componentDidUpdate(prevProps) {
		if (this.props.location.pathname !== prevProps.location.pathname) {
			this.setState({
				location: this.props.location.pathname,
				companyMenu: false,
				selectedRoute: this.findActiveRoute(this.props.location.pathname)
			});

			this.routes = [
				{
					path: `/company/${this.props.company.id}`,
					sidebarName: 'Dashboard',
					name: 'dashboard',
					icon: 'dashboard'
				},
				{
					path: `/company/${this.props.company.id}/councils/drafts`,
					name: 'council',
					sidebarName: this.props.translate.councils_sidebar,
					icon: 'import_contacts'
				},
				{
					path: `/company/${this.props.company.id}/signatures/drafts`,
					name: 'signature',
					sidebarName: this.props.translate.signatures_sidebar,
					icon: 'border_color'
				}
			];
		}
	}

	findActiveRoute = pathname => {
		let routeIndex = 0;
		this.routes.forEach((route, index) => {
			if (pathname.includes(route.name)) {
				routeIndex = index;
			}
		});
		return routeIndex;
	};

	showVerticalLayout = () => this.props.windowSize === 'xs' && !isLandscape()

	links = () => (
		<div className={this.props.classes.list}
			style={{
				zIndex: '99999',
				display: 'flex',
				flexDirection: 'column',
				position: isMobile ? '' : 'absolute',
				top: '0px',
				width: '100%',
				...(this.showVerticalLayout() ? { margin: 0 } : {}),
			}}
		>
			{!this.showVerticalLayout() ?
				<React.Fragment>
					<div
						className={this.props.classes.logoLink}
						style={{
							zIndex: '99999',
							display: 'flex',
							flexDirection: 'row',
							width: '100%',
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<div
							style={{
								zIndex: '99999',
								width: '100%',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								padding: '0.5em'
							}}
						>
							<Tooltip title={`${this.props.translate.edit_company} - ${this.props.company.businessName}`} placement="top-end">
								<div>
									{isAdmin(this.props.user) ?
										<Link to={`/company/${this.props.company.id}/settings`}>
											{this.props.company.logo ? (
												<img
													src={this.props.company.logo}
													alt="logo"
													className={this.props.classes.img}
												/>
											) : (
												<FontAwesome
													name={'building-o'}
												/>
											)}
										</Link>
										: this.props.company.logo ? (
											<img
												src={this.props.company.logo}
												alt="logo"
												className={this.props.classes.img}
											/>
										) : (
											<FontAwesome
												name={'building-o'}
											/>
										)
									}

								</div>
							</Tooltip>
						</div>
					</div>
					{this.routes.map((route, key) => {
						if (route.redirect) {
							return null;
						}
						const listItemClasses = cx({
							[` ${this.props.classes[this.props.color]}`]: this.activeRoute(key)
						});
						return (
							<div
								className={`${this.props.classes.item} dropdown-wrapper`}
								key={key}
								id={`side-menu-hover-wrapper-${key}`}
							>
								<NavLink
									to={route.path}
									activeClassName="active"
									style={{
										display: 'flex',
										width: '100%',
										alignItems: 'center',
										justifyContent: 'center'
									}}
									id={`side-menu-trigger-${key}`}
									onClick={() => this.setState({ selectedRoute: key })}
								>
									<ListItem
										button
										className={
											this.props.classes.itemLink + listItemClasses
										}
										style={{
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
											justifyContent: 'center'
										}}
									>
										<div
											style={{
												width: '24px',
												height: '30px',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												color: 'rgba(255, 255, 255, 0.8)'
											}}
										>
											<Icon>
												{route.icon}
											</Icon>
										</div>
										<span
											style={{
												color: 'white',
												fontSize: '0.55em'
											}}
										>
											{route.sidebarName}
										</span>
									</ListItem>
								</NavLink>
								{route.name === 'dashboard' && (
									<LateralMenuOptions company={this.props.company} clase={'dropdown-container'} menuType={'dashboard'} />
								)}
								{route.name === 'council' && (
									<LateralMenuOptions company={this.props.company} clase={'dropdown-container-reunion'} menuType={'council'} />
								)}
							</div>
						);
					})}
				</React.Fragment>
				: <div
					style={{
						display: 'flex',
						flexDirection: 'row',
						width: '100vw',
						height: '100%'
					}}
				>
					<div
						style={{
							width: '25%',
							height: '100%',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							overflow: 'hidden'
						}}
					>
						{this.brand()}
					</div>
					{this.routes.map((route, key) => {
						if (route.redirect) {
							return null;
						}
						const listItemClasses = cx({
							[` ${this.props.classes[this.props.color]}`]: this.activeRoute(key)
						});
						return (
							<NavLink
								to={route.path}
								className={this.props.classes.item}
								activeClassName="active"
								key={key}
								style={{
									':hover': {
										textDecoration: 'none',
										color: 'red'
									},
									width: '25%',
									height: '100%',
									marginTop: 0,
									padding: '0px'
								}}
								onClick={() => this.setState({ selectedRoute: key })}
							>
								<ListItem
									button
									className={
										this.props.classes.itemLink + listItemClasses
									}
									style={{
										borderRadius: '0',
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										margin: 0,
										width: '100%',
										height: '100%',
										justifyContent: 'center',
										padding: '0px'
									}}
								>
									<div
										style={{
											paddingTop: '0.35rem',
											width: '24px',
											// height: "30px",
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											color: 'rgba(255, 255, 255, 0.8)'
										}}
									>
										<Icon>
											{route.icon}
										</Icon>
									</div>
									<span
										style={{
											color: 'white',
											fontSize: '0.55em'
										}}
									>
										{route.sidebarName}
									</span>
								</ListItem>
							</NavLink>
						);
					})}
				</div>

			}

		</div>
	);

	toggleCompanyMenu = () => {
		this.setState({
			companyMenu: !this.state.companyMenu
		});
	}

	brand = () => (
		<React.Fragment>
			<div onClick={this.toggleCompanyMenu}>
				<div
					className={`${this.props.classes.logo} intento`}
					style={{
						borderRadius: '0',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						right: '0px',
						cursor: 'pointer'
					}}
				>
					<i
						className="material-icons"
						id={'entidadesSideBar'}
						style={{ color: this.state.companyMenu && this.showVerticalLayout() ? getSecondary() : 'rgba(255, 255, 255, 0.8)', fontSize: '1.em' }}
					>
						apps
					</i>
				</div>
			</div>
		</React.Fragment>
	);

	activeRoute(index) {
		return index === this.state.selectedRoute;
	}

	render() {
		const { classes } = this.props;
		return (
			<React.Fragment>
				<CompanyMenu
					open={this.state.companyMenu}
					company={this.props.company}
					companies={this.props.companies}
					translate={this.props.translate}
					requestClose={this.toggleCompanyMenu}
				/>
				<div style={{
					float: 'left', zIndex: '0', height: '100vh', position: isMobile && isLandscape() && 'fixed'
				}}>

					<div style={{
						backgroundColor: darkGrey,
						height: '100vh',
						zIndex: '1000',
						position: 'absolute',
						display: 'flex',
						...(this.showVerticalLayout() ?
							{
								flexDirection: 'row',
								bottom: 0,
								overflow: 'hidden',
								left: 0,
								width: '100%',
								alignItems: 'center',
								height: '3.5em'
							}
							: {
								flexDirection: 'column',
								top: 0,
								left: 0,
								width: '5em',
							}
						),
						alignItems: 'center',
					}}>
						{!this.showVerticalLayout()
							&& this.brand()
						}
						<div
							className={classes.sidebarWrapper}
							style={{
								position: 'relative',
								...(this.showVerticalLayout() ? {
									height: '3.5em',
									display: 'flex',
									width: '100%',
									flexDirection: 'row',
									alignItems: 'center'
								} : { height: 'calc(100vh - 75px)' })
							}}
						>
							{this.links()}
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}


export default withStyles(sidebarStyleLite)(withRouter(withWindowSize(Sidebar)));
