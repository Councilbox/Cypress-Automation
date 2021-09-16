
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
import plantillasIcon from '../../assets/img/plantillasIcon.svg';
import entidadesIcon from '../../assets/img/shape.svg';

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

	buildRoutes = () => [
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
			path: `/company/${this.props.company.id}/companies`,
			name: 'companies',
			sidebarName: this.props.translate.councils_link,
			icon: <img src={entidadesIcon} style={{ width: '100%', height: 'auto' }} />
		},
		{
			path: `/company/${this.props.company.id}/drafts/documentation`,
			name: 'drafts',
			sidebarName: this.props.translate.tooltip_knowledge_base,
			icon: <img src={plantillasIcon} style={{ width: '19px', height: 'auto' }} />
		},
		{
			path: `/company/${this.props.company.id}/censuses`,
			name: 'censuses',
			sidebarName: this.props.translate.censuses,
			icon: 'person'
		},
		{
			path: `/company/${this.props.company.id}/users`,
			name: 'users',
			sidebarName: this.props.translate.users,
			icon: 'supervised_user_circle'
		}
	]

	routes = this.buildRoutes();

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

			this.routes = this.buildRoutes();
		}
	}

	findActiveRoute = pathname => {
		let routeIndex = 0;
		const found = this.routes.findIndex(route => pathname.includes(route.name));

		if (found !== -1) {
			routeIndex = found;
		}

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
							{/* <Tooltip title={`${this.props.translate.edit_company} - ${this.props.company.businessName}`} placement="top-end">
<div>
<Link to={`/company/${this.props.company.id}/settings`}>
{!!this.props.company.logo ? (
<img
src={this.props.company.logo}
alt="logo"
className={this.props.classes.img}
/>
) : (
<FontAwesome
name={"building-o"}
/>
)
}
</Link>
</div>
</Tooltip> */}
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
								className={`${this.props.classes.item} `}
								// className={`${this.props.classes.item} dropdown-wrapper`} //clase para activar el menu flotante lateral
								key={key}
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
											<Icon style={{ display: 'flex', justifyContent: 'center' }}>
												{route.icon}
											</Icon>
										</div>
										<span
											style={{
												color: 'white',
												fontSize: '0.55em',
												textAlign: 'center',
												lineHeight: '13px',
												marginTop: '4px'
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
					{/* <div
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
</div> */}
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
						style={{ color: this.state.companyMenu && this.showVerticalLayout() ? getSecondary() : 'rgba(255, 255, 255, 0.8)', fontSize: '1.em' }}
					>
						apps
					</i>
				</div>
			</div>
		</React.Fragment>
	);

	brandNew = () => (
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
						style={{ color: this.state.companyMenu && this.showVerticalLayout() ? getSecondary() : 'rgba(255, 255, 255, 0.8)', fontSize: '1.em' }}
					>
						apps
					</i>
				</div>
			</div>
			<Tooltip title={`${this.props.translate.edit_company} - ${this.props.company.businessName}`} placement="top-end">

				<div style={{
					borderRadius: '8px',
					border: '1px solid rgb(151, 151, 151)',
					marginTop: '1em',
					width: '100%',
					borderLeftStyle: 'none',
					borderTopLeftRadius: '0',
					borderBottomLeftRadius: '0',
					display: 'flex',
					justifyContent: 'center',
					marginRight: '7px',
					alignItems: 'center'
				}}>
					<div style={{
						padding: '0.5em', minHeight: '3.5em', display: 'flex', alignItems: 'center'
					}}>
						<Link to={`/company/${this.props.company.id}/settings`}>
							{this.props.company.logo ? (
								<img
									src={this.props.company.logo}
									alt="logo"
									className={this.props.classes.img}
									style={{ marginLeft: '7px' }}
								/>
							) : (
								<FontAwesome
									name={'building-o'}
								/>
							)}
						</Link>
					</div>
				</div>
			</Tooltip>
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
						{/* {!this.showVerticalLayout() &&
this.brand()
} */}
						{!this.showVerticalLayout()
							&& this.brandNew()
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
