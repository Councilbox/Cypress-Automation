import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import cx from 'classnames';
import {
	ListItem,
	ListItemIcon,
	withStyles
} from 'material-ui';
import BorderColor from 'material-ui-icons/BorderColor';
import ContentPaste from 'material-ui-icons/ContentPaste';
import Dashboard from 'material-ui-icons/Dashboard';
import History from 'material-ui-icons/History';
import Language from 'material-ui-icons/Language';
import ImportContacts from 'material-ui-icons/ImportContacts';
import icono from '../../../assets/img/logo-icono.png';
import sidebarStyle from '../../../styles/sidebarStyle';
import { bHistory, store } from '../../../containers/App';
import { changeCompany } from '../../../actions/companyActions';
import { darkGrey } from '../../../styles/colors';


class Sidebar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedRoute: 0
		};

		this.routes = [
			{
				path: '/councils',
				name: 'councils',
				sidebarName: props.translate.councils_link,
				icon: Dashboard
			},
			{
				path: '/finished',
				name: 'finished',
				sidebarName: 'Histórico',
				icon: History
			},
			{
				path: '/companies',
				name: 'companies',
				sidebarName: 'Entidades',
				icon: ImportContacts
			},
			{
				path: '/drafts',
				name: 'drafts',
				sidebarName: 'Borradores',
				icon: ContentPaste
			},
			{
				path: '/users',
				name: 'users',
				sidebarName: props.translate.users,
				icon: BorderColor
			},
			{
				path: '/translations',
				name: 'translations',
				sidebarName: 'Traducciones',
				icon: Language
			}
		];
	}

	componentDidMount() {
		const index = this.findActiveRoute(this.props.location.pathname);
		this.setState({
			selectedRoute: index
		});
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.location.pathname !== nextProps.location.pathname) {
			this.setState({
				selectedRoute: this.findActiveRoute(nextProps.location.pathname)
			});
		}
	}


changeCompany = index => {
	const { companies } = this.props;
	store.dispatch(changeCompany(index));
	bHistory.push(`/company/${companies[index].id}`);
};

findActiveRoute = pathname => {
	let routeIndex = 0;
	this.routes.forEach((route, index) => {
		if (pathname.includes(route.name)) {
			routeIndex = index;
		}
	});
	return routeIndex;
};

links = () => (
	<div className={this.props.classes.list}
		style={{
			position: 'absolute',
			top: '0',
			display: 'flex',
			flexDirection: 'column',
			width: '100%',
			overflow: 'hidden'
		}}
	>
		<React.Fragment>
			<div
				className={this.props.classes.logoLink}
				style={{
					display: 'flex',
					flexDirection: 'row',
					width: '100%',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>

			</div>
			{this.routes.map((route, key) => {
				if (route.redirect) {
					return null;
				}
				const listItemClasses = cx({
					[` ${
						this.props.classes[this.props.color]}`]: this.activeRoute(key)
				});
				const whiteFontClasses = cx({
					[` ${this.props.classes.whiteFont}`]: this.activeRoute(key)
				});
				return (
					<NavLink
						to={route.path}
						className={this.props.classes.item}
						activeClassName="active"
						key={key}
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
								justifyContent: 'center',
								margin: '7px 7px 0',
								padding: '10px 10px',
								width: '100%',
								maxWidth: '61px'
							}}
						>
							<div
								style={{
									width: '24px',
									height: '30px',
									display: 'flex',
									alignItems: 'center',
									color: 'rgba(255, 255, 255, 0.8)'
								}}
							>
								<ListItemIcon
									className={
										this.props.classes.itemIcon
+ whiteFontClasses
									}
								>
									<route.icon />
								</ListItemIcon>
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
		</React.Fragment>
	</div>
)

brand = () => (
	<div className={this.props.classes.logo}>
		<div
			className={this.props.classes.logoLink}
			style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			<img
				src={icono}
				alt="logo"
				style={{ height: '3em', width: 'auto' }}
			/>
		</div>
	</div>
);


activeRoute(index) {
	return index === this.state.selectedRoute;
}

render() {
	const { classes } = this.props;
	return (
		<div style={{ float: 'left', zIndex: '0' }}>
			<div style={{
				backgroundColor: darkGrey,
				height: '100vh',
				zIndex: '1000',
				position: 'absolute',
				display: 'flex',
				flexDirection: 'column',
				top: 0,
				left: 0,
				width: '5em',
				alignItems: 'center',
			}}>
				<div
					className={classes.sidebarWrapper}
					style={{
						position: 'relative',
						width: '100%',
						alignItems: 'center',
						height: 'calc(100vh - 75px)'
					}}
				>
					{this.links()}
				</div>
			</div>

		</div>

	);
}
}

export default withStyles(sidebarStyle)(withRouter(Sidebar));
