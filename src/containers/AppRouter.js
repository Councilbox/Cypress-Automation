import React from "react";
import Header from "../components/Header";
import Login from '../components/notLogged/Login';
import SignUpPage from "../components/notLogged/signUp/SignUpPage";
import ForgetPwdContainer from "./ForgetPwdContainer";
import ChangePwdContainer from "./ChangePwdContainer";
import Welcome from "../components/Welcome";
import NotFound from "../components/NotFound";
import { Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Sidebar from "../components/sideMenu/SideBar";
import SidebarLite from "../components/sideMenu/SideBarLite";
import { LoadingMainApp } from "../displayComponents";
import Test from "../components/participant/test/Test";
import ParticipantTokenContainer from "./ParticipantTokenContainer";
import ParticipantPage from '../components/participantScreen/ParticipantPage';
import ActiveUserPage from '../components/notLogged/ActiveUserPage';
import ParticipantContainer from "./ParticipantContainer";
import appStyle from "../styles/appStyle.jsx";
import image from "../assets/img/sidebar-2.jpg";
import { withStyles } from "material-ui";
import AssistanceTokenContainer from "./AssistanceTokenContainer";
import AssistanceContainer from "./AssistanceContainer";
import Loadable from 'react-loadable';

const LoadCorporationTree = Loadable({
	loader: () => import('../components/corporation/Router'),
	loading: LoadingMainApp
});

const LoadMainTree = Loadable({
	loader: () => import('./MainRouter'),
	loading: LoadingMainApp
})


class AppRouter extends React.Component {
	handleDrawerToggle = () => {
		this.setState({ mobileOpen: !this.state.mobileOpen });
	};

	state = {
		sideWidth: 5,
		mobileOpen: false
	};

	render() {
		const { translate } = this.props;

		if(!this.props.main.serverStatus){
			return <LoadingMainApp message="NO SE HA PODIDO ESTABLECER CONEXION CON EL SERVIDOR. REINTENTANDO..." />
		}

		if (this.props.main.loading || !this.props.translate) {
			return <LoadingMainApp />;
		}

		if (this.props.main.isLogged && !this.props.companies.list.length > 0 && !this.props.companies.selected) {
			return <LoadingMainApp />;
		}

		if(this.props.user.type === 'corporation'){
			return (
				<LoadCorporationTree
					translate={this.props.translate}
					user={this.props.user}
					location={this.props.location}
				/>
			);
		}

		return this.props.main.isLogged && this.props.user.type === 'company'? (
			<div
				style={{
					width: "100%",
					height: "100vh",
					display: 'flex',
					flexDirection: 'row',
					position: "relative",
					overflow: 'hidden'
				}}
			>
				<SidebarLite
					companies={this.props.companies.list}
					company={this.props.companies.list[this.props.companies.selected]}
					open={this.state.mobileOpen}
					handleDrawerToggle={this.handleDrawerToggle}
					image={image}
					translate={translate}
					color="blue"
				/>

				<div className={this.props.classes.mainPanelLite}>
					<Header
						commandLine={true}
						user={this.props.user}
						drawerIcon={this.state.mobileOpen}
						translate={this.props.translate}
						backButton={
							this.props.location.pathname !==
							`/company/${
							this.props.companies.list[
								this.props.companies.selected
							].id
							}`
						}
					/>
					<div
						style={{
							height: "calc(100vh - 3em)",
							display: "flex",
							width: "100%"
						}}
					>
						<LoadMainTree company={this.props.companies.list[this.props.companies.selected]} />
					</div>
				</div>
			</div>
		) : (
				<Switch>
					<Route exact path="/" component={Login} />
					<Route path="/signup" component={SignUpPage} />
					<Route path="/forgetPwd" component={ForgetPwdContainer} />
					<Route path="/activeUser/token/:token" component={ActiveUserPage} />
					<Route
						exact
						path="/changePwd/:language/:token"
						component={ChangePwdContainer}
					/>
					<Route path="/welcome" component={Welcome} />

					<Route exact path="/test/:language" component={Test} />
					{this.props.main.isParticipantLogged &&
						[<Route
							key='route_participant_meet'
							exact
							path="/participant/:id/council/:councilId/meet"
							component={ParticipantContainer}
						/>,
						<Route
							key='route_participant_council'
							exact
							path="/participant/:id/council/:councilId/council"
							component={ParticipantContainer}
						/>]
					}
					<Route
						exact
						path="/participant/token/:token"
						component={ParticipantTokenContainer}
					/>
					<Route
						exact
						path="/assistance/token/:token/"
						component={AssistanceTokenContainer}
					/>

					<Route
						exact
						path="/participant/:id/council/:councilId/:segment?"
						component={ParticipantContainer}
					/>
					<Route
						exact
						path="/assistance/participant/:participantId/council/:councilId"
						component={AssistanceContainer}
					/>


					<Route path="*" component={NotFound} />
				</Switch>
			);
	}
}

const mapStateToProps = state => ({
	main: state.main,
	translate: state.translate,
	companies: state.companies,
	user: state.user
});

export default withRouter(
	connect(mapStateToProps)(withStyles(appStyle)(AppRouter))
);
