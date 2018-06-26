import React from "react";
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
import sidebarStyleLite from "../../styles/sidebarStyleLite";
import BorderColor from 'material-ui-icons/BorderColor';
import ContentPaste from 'material-ui-icons/ContentPaste';
import Dashboard from 'material-ui-icons/Dashboard';
import ImportContacts from 'material-ui-icons/ImportContacts';
import { getPrimary, darkGrey } from "../../styles/colors";
import { bHistory, store } from "../../containers/App";
import { changeCompany } from "../../actions/companyActions";
import { DropDownMenu, Icon } from "../../displayComponents";
import FontAwesome from "react-fontawesome";

class Sidebar extends React.Component {

	state = {
		selectedRoute: 0
	};

	routes = [
		{
			path: `/company/${this.props.company.id}`,
			sidebarName: this.props.translate.dashboard,
			icon: Dashboard
		},
		{
			path: `/company/${this.props.company.id}/councils/drafts`,
			name: "council",
			sidebarName: this.props.translate.councils,
			icon: ImportContacts
		},
		{
			path: `/company/${this.props.company.id}/meeting/new`,
			name: "meeting",
			sidebarName: this.props.translate.dashboard_new_meeting,
			icon: ContentPaste
		},
		{
			path: `/company/${this.props.company.id}/signatures/drafts`,
			name: "signature",
			sidebarName: this.props.translate.signatures,
			icon: BorderColor
		}
	];

	componentDidMount() {
		const index = this.findActiveRoute(this.props.location.pathname);
		this.setState({
			selectedRoute: index
		});
	}


	componentDidUpdate(prevProps){
		if (this.props.location.pathname !== prevProps.location.pathname) {
			this.setState({
				location: this.props.location.pathname,
				selectedRoute: this.findActiveRoute(this.props.location.pathname)
			});
		}
	}

	findActiveRoute = (pathname, routes) => {
		let routeIndex = 0;
		this.routes.forEach((route, index) => {
			if (pathname.includes(route.name)) {
				routeIndex = index;
			}
		});
		return routeIndex;
	};

	changeCompany = index => {
		const { companies } = this.props;
		store.dispatch(changeCompany(index));
		bHistory.push(`/company/${companies[index].id}`);
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
						</ListItem>
					</NavLink>
				);
			})}
		</List>
	);

	brand = () => (
		<DropDownMenu
			color="transparent"
            persistent={true}
			buttonStyle={{
				boxSizing: "border-box",
				padding: "0",
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
				<div
                    style={{
                        width: '320px',
                        height: '95vh'
                    }}
                >
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
				</div>
			}
		/>
	);

	activeRoute(index) {
		return index === this.state.selectedRoute;
	}

	render() {
		const { classes, image } = this.props;
		return (
			<div style={{backgroundColor: darkGrey, width: '5em', height: '100vh'}}>
				{this.brand()}
                <div className={classes.sidebarWrapper}>
                    {this.links()}
                </div>
			</div>
		);
	}
}


export default withStyles(sidebarStyleLite)(withRouter(Sidebar));
