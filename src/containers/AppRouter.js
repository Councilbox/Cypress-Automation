import React, {Component} from 'react';
import Header from '../components/Header';
import LoginContainer from './LoginContainer';
import CouncilContainer from './CouncilContainer';
import SignatureContainer from './SignatureContainer';
import SignUpContainer from './SignUpContainer';
import MeetingsContainer from './MeetingsContainer';
import ForgetPwdContainer from './ForgetPwdContainer';
import ChangePwdContainer from './ChangePwdContainer';
import Welcome from '../components/Welcome';
import NotFound from "../components/NotFound";
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import {connect} from "react-redux";
import Sidebar from '../components/sideMenu/SideBar';
import DashboardContainer from './DashboardContainer';
import CouncilEditorContainer from './CouncilEditorContainer';
import CouncilPrepareContainer from './CouncilPrepareContainer';
import MeetingEditorContainer from './MeetingEditorContainer';
import CompanySettingsContainer from './CompanySettingsContainer';
import CompanyCensusContainer from './CompanyCensusContainer';
import UserSettingsContainer from './UserSettingsContainer';
import CreateCouncil from '../components/CreateCouncil';
import ParticipantPage from '../components/participantScreen/ParticipantPage';
import CreateMeeting from '../components/CreateMeeting';
import StatutesPage from '../components/company/statutes/StatutesPage';
import PlatformDrafts from '../components/corporation/drafts/PlatformDrafts';
import CensusEditorPage from '../components/company/census/censusEditor/CensusEditorPage';
import { LoadingMainApp } from '../displayComponents';
import CompanyDraftList from '../components/company/drafts/CompanyDraftList';
import appStyle from "../styles/appStyle.jsx";
import image from "../assets/img/sidebar-2.jpg";
import { withStyles } from 'material-ui';
import CompanyDraftEditor from '../components/company/drafts/CompanyDraftEditor'

class AppRouter extends Component {
    constructor(props){
        super(props);
        this.state = {
            sideWidth: 5,
            mobileOpen: false
        }    
    }

    handleDrawerToggle = () => {
        this.setState({ mobileOpen: !this.state.mobileOpen });
    };


    render() {
        const { translate } = this.props;
        if(this.props.main.loading || !this.props.translate){
            return(<LoadingMainApp />);
        }

        if(this.props.main.isLogged && !this.props.companies.list){
            return(<LoadingMainApp />);
        }

        return (
            this.props.main.isLogged?
                <div style={{width: '100%', height: '100vh', position: 'relative'}}>                                                      
                    <Sidebar
                        company={this.props.companies.list[this.props.companies.selected]}
                        open={this.state.mobileOpen}
                        handleDrawerToggle={this.handleDrawerToggle}
                        image={image}
                        translate={translate}
                        color="blue"
                    />

                    <div className={this.props.classes.mainPanel}>
                        <Header user={this.props.user} drawerIcon={this.state.mobileOpen} translate={this.props.translate} backButton={this.props.location.pathname !== `/company/${this.props.companies.list[this.props.companies.selected].id}`} />
                        <div style={{
                            height: 'calc(100vh - 3em)',
                            display: 'flex',
                            width: '100%',
                        }}>
                            <Switch>
                                <Route exact path="/" component={() => {return <Redirect to={`/company/${this.props.companies.list[this.props.companies.selected].id}`} />}} />
                                <Route exact path="/company/:company" component={DashboardContainer} />
                                <Route exact path="/company/:company/settings" component={CompanySettingsContainer} />                            
                                <Route exact path="/company/:company/council/new" component={CreateCouncil} />
                                <Route exact path="/company/:company/council/:id/prepare" component={CouncilPrepareContainer} />                                                           
                                <Route exact path="/company/:company/council/:id" component={CouncilEditorContainer} />                           
                                <Route path="/company/:company/councils/:section" component={CouncilContainer} />
                                <Route path="/company/:company/signatures/:section" component={SignatureContainer} />
                                <Route exact path="/company/:company/meetings/new" component={() => <div>Nueva conferencia</div>} />                            
                                <Route path="/company/:company/meetings/:section" component={MeetingsContainer} />
                                <Route exact path="/company/:company/meeting/new" component={CreateMeeting} />
                                <Route exact path="/company/:company/meeting/:id/:step" component={MeetingEditorContainer} />
                                <Route exact path="/company/:company/drafts/:id?" component={CompanyDraftList} />
                                <Route exact path="/company/:company/draft/:id?" component={CompanyDraftEditor} />
                                <Route exact path="/company/:company/platform/drafts" component={PlatformDrafts} />                            
                                <Route exact path="/company/:company/censuses" component={CompanyCensusContainer} />
                                <Route exact path="/company/:company/census/:id" component={CensusEditorPage} />  
                                <Route exact path="/company/:company/statutes" component={StatutesPage} />                                                        
                                <Route exact path="/user/:id" component={UserSettingsContainer} />                        
                                <Route path="*" component={NotFound}/>
                            </Switch>
                        </div>
                    </div>
                </div>
            : (
                <Switch>
                    <Route exact path="/" component={LoginContainer}/>
                    <Route path="/signup" component={SignUpContainer}/>
                    <Route path="/forgetPwd" component={ForgetPwdContainer}/>
                    <Route exact path="/changePwd/:language/:token" component={ChangePwdContainer} />
                    <Route path="/welcome" component={Welcome} />
                    <Route path="/participant/:id" component={ParticipantPage} />
                    <Route path="*" component={NotFound}/>            
                </Switch>
            )
        );
    }
}

const mapStateToProps = (state) => ({
    main: state.main,
    translate: state.translate,
    companies: state.companies,
    user: state.user
});

export default withRouter(connect(mapStateToProps)(withStyles(appStyle)(AppRouter)));
