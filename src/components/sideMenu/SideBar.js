import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import cx from "classnames";
import {
	Drawer,
	Hidden,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	MenuItem,
	withStyles
} from "material-ui";
import sidebarStyle from "../../styles/sidebarStyle";
import {
	BorderColor,
	ContentPaste,
	Dashboard,
	ImportContacts
} from "material-ui-icons";
import { getPrimary } from "../../styles/colors";
import { bHistory, store } from "../../containers/App";
import { changeCompany } from "../../actions/companyActions";
import { DropDownMenu, Icon } from "../../displayComponents";
import FontAwesome from "react-fontawesome";

class Sidebar extends Component {
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
		<List className={this.props.classes.list}>
			{this.routes.map((route, key) => {
				if (route.redirect) {
					return null;
				}
				const listItemClasses = cx({
					[" " +
					this.props.classes[this.props.color]]: this.activeRoute(key)
				});
				const whiteFontClasses = cx({
					[" " + this.props.classes.whiteFont]: this.activeRoute(key)
				});
				return (
					<NavLink
						to={route.path}
						className={this.props.classes.item}
						activeClassName="active"
						key={key}
						style={{
							":hover": {
								textDecoration: "none",
								color: "red"
							}
						}}
						onClick={() => this.setState({ selectedRoute: key })}
					>
						<ListItem
							button
							className={
								this.props.classes.itemLink + listItemClasses
							}
							style={{
								display: "flex",
								flexDirection: "row"
							}}
						>
							<ListItemIcon
								className={
									this.props.classes.itemIcon +
									whiteFontClasses
								}
							>
								<route.icon />
							</ListItemIcon>
							<ListItemText
								primary={route.sidebarName}
								className={
									this.props.classes.itemText +
									whiteFontClasses
								}
								disableTypography={true}
							/>
						</ListItem>
					</NavLink>
				);
			})}
		</List>
	);
	brand = () => (
		<DropDownMenu
			color="transparent"
			buttonStyle={{
				boxSizing: "border-box",
				padding: "0",
				border: `1px solid ${getPrimary()}`,
				marginLeft: "0.3em"
			}}
			text={
				<div className={this.props.classes.logo}>
					<div
						className={this.props.classes.logoLink}
						style={{
							display: "flex",
							flexDirection: "row"
						}}
					>
						<div className={this.props.classes.logoImage}>
							{!!this.props.company.logo ? (
								<img
									src={this.props.company.logo}
									alt="logo"
									className={this.props.classes.img}
								/>
							) : (
								<FontAwesome
									name={"building-o"}
									className={this.props.classes.img}
								/>
							)}
						</div>

						<div
							style={{
								fontSize: "0.85em",
								fontWeight: "700"
							}}
						>
							{this.props.company.businessName}
						</div>
					</div>
				</div>
			}
			textStyle={{ color: getPrimary() }}
			type="flat"
			icon={
				<Icon
					className="material-icons"
					style={{ color: getPrimary() }}
				>
					keyboard_arrow_down
				</Icon>
			}
			items={
				<React.Fragment>
					{this.props.companies.map((company, index) => {
						if (company.id !== this.props.company.id) {
							return (
								<MenuItem
									key={`company_${company.id}`}
									onClick={() => this.changeCompany(index)}
								>
									{!!company.logo ? (
										<img
											src={company.logo}
											alt="logo"
											className={this.props.classes.img}
										/>
									) : (
										<FontAwesome
											name={"building-o"}
											className={this.props.classes.img}
										/>
									)}

									<div
										style={{
											fontSize: "0.85em",
											fontWeight: "700",
											marginLeft: "0.3em"
										}}
									>
										{company.businessName}
									</div>
								</MenuItem>
							);
						}
					})}
				</React.Fragment>
			}
		/>
	);

	constructor(props) {
		super(props);
		this.state = {
			selectedRoute: 0
		};

		this.routes = [
			{
				path: `/company/${props.company.id}`,
				sidebarName: props.translate.dashboard,
				icon: Dashboard
			},
			{
				path: `/company/${props.company.id}/councils/drafts`,
				name: "council",
				sidebarName: props.translate.councils,
				icon: ImportContacts
			},
			{
				path: `/company/${props.company.id}/meetings/drafts`,
				name: "meeting",
				sidebarName: props.translate.meetings,
				icon: ContentPaste
			},
			{
				path: `/company/${props.company.id}/signatures/drafts`,
				name: "signature",
				sidebarName: props.translate.signatures,
				icon: BorderColor
			}
		];
	}

	componentDidMount() {
		const index = this.findActiveRoute(this.props.location.pathname);
		console.log(index);
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

	activeRoute(index) {
		return index === this.state.selectedRoute;
	}

	/*brand = () => (
     <div className={this.props.classes.logo}>
     <CompanySelector
     companies={this.props.companies}
     company={this.props.company}
     />
     </div>
     )*/

	render() {
		const { classes, image } = this.props;
		return (
			<div>
				<Hidden mdUp>
					<Drawer
						variant="temporary"
						anchor="right"
						open={this.props.open}
						classes={{
							paper: classes.drawerPaper
						}}
						onClose={this.props.handleDrawerToggle}
						ModalProps={{
							keepMounted: true // Better open performance on mobile.
						}}
					>
						{this.brand()}
						<div className={classes.sidebarWrapper}>
							{/*<HeaderLinks />*/}
							{this.links()}
						</div>
						{image !== undefined ? (
							<div
								className={classes.background}
								style={{
									backgroundImage: "url(" + image + ")"
								}}
							/>
						) : null}
					</Drawer>
				</Hidden>
				<Hidden smDown>
					<Drawer
						anchor="left"
						variant="permanent"
						open
						classes={{
							paper: classes.drawerPaper
						}}
					>
						{this.brand()}
						<div className={classes.sidebarWrapper}>
							{this.links()}
						</div>
						{image !== undefined ? (
							<div
								className={classes.background}
								style={{
									backgroundImage: "url(" + image + ")"
								}}
							/>
						) : null}
					</Drawer>
				</Hidden>
			</div>
		);
	}
}

export default withStyles(sidebarStyle)(withRouter(Sidebar));
