import React from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { LoadingMainApp } from "../displayComponents";
import withWindowSize from '../HOCs/withWindowSize';
import appStyle from "../styles/appStyle.jsx";
import image from "../assets/img/sidebar-2.jpg";
import withStyles from 'material-ui/styles/withStyles';
import Loadable from 'react-loadable';

const LoadRecommendations = Loadable({
	loader: () => import('../components/noCompany/Recommendations'),
	loading: LoadingMainApp
});

const LoadCorporationTree = Loadable({
	loader: () => import('../components/corporation/Router'),
	loading: LoadingMainApp
});

const LoadNoConnectionModal = Loadable({
	loader: () => import('../components/NoConnectionModal'),
	loading: LoadingMainApp
})

const Header = Loadable({
	loader: () => import('../components/Header'),
	loading: LoadingMainApp
});

const LoadMainTree = Loadable({
	loader: () => import('./MainRouter'),
	loading: LoadingMainApp
});

const LoadNoCompanyTree = Loadable({
	loader: () => import('../components/noCompany/NoCompanyRouter'),
	loading: LoadingMainApp
});

const Login = Loadable({
	loader: () => import('../components/notLogged/Login'),
	loading: LoadingMainApp
});

const SignUpPage = Loadable({
	loader: () => import('../components/notLogged/signUp/SignUpPage'),
	loading: LoadingMainApp
});

const ChangePwd = Loadable({
	loader: () => import('../components/notLogged/ChangePwd'),
	loading: LoadingMainApp
});

const ForgetPwd = Loadable({
	loader: () => import('../components/notLogged/ForgetPwd'),
	loading: LoadingMainApp
});

const Welcome = Loadable({
	loader: () => import('../components/Welcome'),
	loading: LoadingMainApp
});

const NotFound = Loadable({
	loader: () => import('../components/NotFound'),
	loading: LoadingMainApp
});

const SidebarLite = Loadable({
	loader: () => import('../components/sideMenu/SideBarLite'),
	loading: LoadingMainApp
});

const Test = Loadable({
	loader: () => import('../components/participant/test/Test'),
	loading: LoadingMainApp
});

const ParticipantTokenContainer = Loadable({
	loader: () => import('./ParticipantTokenContainer'),
	loading: LoadingMainApp
});

const ActiveUserPage = Loadable({
	loader: () => import('../components/notLogged/ActiveUserPage'),
	loading: LoadingMainApp
});

const SetUserPasswordPage = Loadable({
	loader: () => import('../components/notLogged/SetUserPasswordPage'),
	loading: LoadingMainApp
});


const ParticipantContainer = Loadable({
	loader: () => import('./ParticipantContainer'),
	loading: LoadingMainApp
});

const AssistanceTokenContainer = Loadable({
	loader: () => import('./AssistanceTokenContainer'),
	loading: LoadingMainApp
});

const AssistanceContainer = Loadable({
	loader: () => import('./AssistanceContainer'),
	loading: LoadingMainApp
});


class AppRouter extends React.Component {
	handleDrawerToggle = () => {
		this.setState({ mobileOpen: !this.state.mobileOpen });
	};

	state = {
		sideWidth: 5,
		mobileOpen: false
	};

	redirectToRoot = () => {
		return <Redirect to="/" />
	}

	render() {
		const { translate } = this.props;

/* 		if(!this.props.main.serverStatus){
			return <LoadingMainApp message="NO SE HA PODIDO ESTABLECER CONEXION CON EL SERVIDOR..." />
		} */

		if (this.props.main.loading || !this.props.translate || !this.props.translate.back) {
			return <LoadingMainApp />;
		}

		if(this.props.main.isLogged && this.props.main.noCompanies){
			return (
				<LoadNoCompanyTree
					translate={this.props.translate}
					user={this.props.user}
					location={this.props.location}
				/>
			)
		};

		if (this.props.main.isLogged && !(this.props.companies.list.length > 0) && !this.props.companies.selected) {
			return <LoadingMainApp />
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
				id={"mainContainer"}
				style={{
					width: "100%",
					height: "100vh",
					position: "relative",
					overflow: 'hidden'
				}}
			>
				<LoadNoConnectionModal open={!this.props.main.serverStatus} />
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
						companyMenu={true}
						company={this.props.companies.list[this.props.companies.selected]}
						companies={this.props.companies.list}
						user={this.props.user}
						main={this.props.main}
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
							height: `calc(100vh - 3em)`,
							display: "flex",
							width: "100%",
							overflow: 'hidden',
							...(this.props.windowSize === 'xs'? {
								paddingBottom: '3.5em'
							}: {})
						}}
					>
						<LoadMainTree company={this.props.companies.list[this.props.companies.selected]} user={this.props.user} />
					</div>
				</div>
			</div>
		) : (
				<Switch>
					<Route exact path="/" component={Login} />
					<Route path="/signup" component={SignUpPage} />
					<Route path="/forgetPwd" component={ForgetPwd} />
					<Route path="/activeUser/token/:token" component={ActiveUserPage} />
					<Route path="/activeUserAndSetPwd/token/:token" component={SetUserPasswordPage} />
					<Route path="/recommendations/:language" component={LoadRecommendations} />

					<Route
						exact
						path="/changePwd/:language/:token"
						component={ChangePwd}
					/>
					<Route path="/welcome" component={Welcome} />

					<Route exact path="/test/:language" component={Test} />
					<Route exact path="/test/:language/:token" component={Test} />
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
						path="/attendance/token/:token/"
						component={AssistanceTokenContainer}
					/>

					<Route
						exact
						path="/participant/:id/council/:councilId/:segment?"
						component={ParticipantContainer}
					/>
					<Route
						exact
						path="/attendance/participant/:participantId/council/:councilId"
						component={AssistanceContainer}
					/>

					<Route path="*" component={this.redirectToRoot} />
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
	connect(mapStateToProps)(withStyles(appStyle)(withWindowSize(AppRouter)))
);
