import React, { Component } from "react";
import Header from "../components/Header";
import LoginContainer from "./LoginContainer";
import CouncilContainer from "./CouncilContainer";
import SignatureContainer from "./SignatureContainer";
import SignUpContainer from "./SignUpContainer";
import MeetingsContainer from "./MeetingsContainer";
import ForgetPwdContainer from "./ForgetPwdContainer";
import ChangePwdContainer from "./ChangePwdContainer";
import Welcome from "../components/Welcome";
import NotFound from "../components/NotFound";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Sidebar from "../components/sideMenu/SideBar";
import DashboardContainer from "./DashboardContainer";
import CouncilEditorContainer from "./CouncilEditorContainer";
import CouncilPrepareContainer from "./CouncilPrepareContainer";
import MeetingEditorContainer from "./MeetingEditorContainer";
import CompanySettingsContainer from "./CompanySettingsContainer";
import CompanyCensusContainer from "./CompanyCensusContainer";
import UserSettingsContainer from "./UserSettingsContainer";
import CreateCouncil from "../components/CreateCouncil";
import CreateMeeting from "../components/CreateMeeting";
import StatutesPage from "../components/company/statutes/StatutesPage";
import CouncilCertificatesPage from "../components/council/certificates/CouncilCertificatesPage";
import NewCompanyPage from "../components/company/new/NewCompanyPage";
import LinkCompanyPage from "../components/company/link/LinkCompanyPage";
import PlatformDrafts from "../components/corporation/drafts/PlatformDrafts";
import CensusEditorPage from "../components/company/census/censusEditor/CensusEditorPage";
import { LoadingMainApp } from "../displayComponents";
import CompanyDraftList from "../components/company/drafts/CompanyDraftList";
import Test from "../components/participant/test/Test";
import ParticipantTokenContainer from "./ParticipantTokenContainer";
import ParticipantPage from '../components/participantScreen/ParticipantPage';
import ParticipantContainer from "./ParticipantContainer";
import appStyle from "../styles/appStyle.jsx";
import image from "../assets/img/sidebar-2.jpg";
import { withStyles } from "material-ui";
import CompanyDraftEditor from "../components/company/drafts/CompanyDraftEditor";
import CouncilWritingContainer from "./CouncilWritingContainer";
import AssistanceTokenContainer from "./AssistanceTokenContainer";
import AssistanceContainer from "./AssistanceContainer";


class AppRouter extends Component {
	handleDrawerToggle = () => {
		this.setState({ mobileOpen: !this.state.mobileOpen });
	};

	constructor(props) {
		super(props);
		this.state = {
			sideWidth: 5,
			mobileOpen: false
		};
	}

	render() {
		const { translate } = this.props;

		if(!this.props.main.serverStatus){
			return <LoadingMainApp message="NO SE HA PODIDO ESTABLECER CONEXION CON EL SERVIDOR. REINTENTANDO..." />
		}

		if (this.props.main.loading || !this.props.translate) {
			return <LoadingMainApp />;
		}

		if (this.props.main.isLogged && !this.props.companies.list) {
			return <LoadingMainApp />;
		}

		return this.props.main.isLogged ? (
			<div
				style={{
					width: "100%",
					height: "100vh",
					position: "relative"
				}}
			>
				<Sidebar
					companies={this.props.companies.list}
					company={
						this.props.companies.list[this.props.companies.selected]
					}
					open={this.state.mobileOpen}
					handleDrawerToggle={this.handleDrawerToggle}
					image={image}
					translate={translate}
					color="blue"
				/>

				<div className={this.props.classes.mainPanel}>
					<Header
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
						<Switch>
							<Route
								exact
								path="/"
								component={() => {
									return (
										<Redirect
											to={`/company/${
												this.props.companies.list[
													this.props.companies
														.selected
												].id
												}`}
										/>
									);
								}}
							/>
							<Route
								exact
								path="/company/:company"
								component={DashboardContainer}
							/>
							<Route
								exact
								path="/company/:company/settings"
								component={CompanySettingsContainer}
							/>
							<Route
								exact
								path="/company/:company/create"
								component={NewCompanyPage}
							/>
							<Route
								exact
								path="/company/:company/link"
								component={LinkCompanyPage}
							/>
							<Route
								exact
								path="/company/:company/council/new"
								component={CreateCouncil}
							/>
							<Route
								exact
								path="/company/:company/council/:id/prepare"
								component={CouncilPrepareContainer}
							/>
							<Route
								exact
								path="/company/:company/council/:id"
								component={CouncilEditorContainer}
							/>
							<Route
								path="/company/:company/councils/:section"
								component={CouncilContainer}
							/>
							<Route
								exact
								path="/company/:company/council/:council/finished"
								component={CouncilWritingContainer}
							/>
							<Route
								exact
								path="/company/:company/council/:council/certificates"
								component={CouncilCertificatesPage}
							/>
							<Route
								path="/company/:company/signatures/:section"
								component={SignatureContainer}
							/>
							<Route
								exact
								path="/company/:company/meeting/new"
								component={CreateMeeting}
							/>
							<Route
								exact
								path="/company/:company/meeting/:id/"
								component={MeetingEditorContainer}
							/>
							<Route
								path="/company/:company/meetings/:section"
								component={MeetingsContainer}
							/>
							<Route
								exact
								path="/company/:company/drafts/:id?"
								component={CompanyDraftList}
							/>
							<Route
								exact
								path="/company/:company/draft/:id?"
								component={CompanyDraftEditor}
							/>
							<Route
								exact
								path="/company/:company/platform/drafts"
								component={PlatformDrafts}
							/>
							<Route
								exact
								path="/company/:company/censuses"
								component={CompanyCensusContainer}
							/>
							<Route
								exact
								path="/company/:company/census/:id"
								component={CensusEditorPage}
							/>
							<Route
								exact
								path="/company/:company/statutes"
								component={StatutesPage}
							/>
							<Route
								exact
								path="/user/:id"
								component={UserSettingsContainer}
							/>
							<Route path="*" component={NotFound} />
						</Switch>
					</div>
				</div>
			</div>
		) : (
				<Switch>
					<Route exact path="/" component={LoginContainer} />
					<Route path="/signup" component={SignUpContainer} />
					<Route path="/forgetPwd" component={ForgetPwdContainer} />
					<Route
						exact
						path="/changePwd/:language/:token"
						component={ChangePwdContainer}
					/>
					<Route path="/welcome" component={Welcome} />
					<Route
						exact
						path="/jibiri/:id"
						component={ParticipantPage}
					/>

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
