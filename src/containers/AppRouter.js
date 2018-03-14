import React, {Component} from 'react';
import Header from '../components/Header';
import LoginContainer from './LoginContainer';
import CouncilContainer from './CouncilContainer';
import SignUpContainer from './SignUpContainer';
import MeetingsContainer from './MeetingsContainer';
import Welcome from '../components/Welcome';
import NotFound from "../components/NotFound";
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import {connect} from "react-redux";
import SideMenu from '../components/sideMenu/SideMenu';
import DashboardContainer from './DashboardContainer';
import CouncilEditorContainer from './CouncilEditorContainer';
import CouncilPrepareContainer from './CouncilPrepareContainer';
import MeetingEditorContainer from './MeetingEditorContainer';
import CreateCouncil from '../components/CreateCouncil';
import CreateMeeting from '../components/CreateMeeting';
import { LoadingMainApp } from '../components/displayComponents';


class AppRouter extends Component {

    constructor(props){
        super(props);
        this.state = {
            sideWidth: 5,
            open: false
        }    
    }

    toggleMenu = () => {
        if(this.state.sideWidth === 20){
            this.setState({
                sideWidth: 5,
                open: false
            });
        }else{
            this.setState({
                sideWidth: 20,
                open: true
            });
        }
    }

    render() {
        if(this.props.main.loading || !this.props.translate){
            return(<LoadingMainApp />);
        }

        if(this.props.main.isLogged && !this.props.companies.list){
            return(<LoadingMainApp />);
        }

        return (
            this.props.main.isLogged?
                <div style={{width: '100%', height: '100vh', display: 'flex', flexDirection: 'row'}}>                                                      
                    <SideMenu
                        width={this.state.sideWidth}
                        companies={this.props.companies.list}
                        company={this.props.companies.list[this.props.companies.selected]}
                        toggleMenu={this.toggleMenu}
                        open={this.state.open}
                        translate={this.props.translate}
                    />
                    <div style={{width: `${100 - this.state.sideWidth}%`, height: '100%', display: 'flex', flexDirection: 'column'}}>
                        <Header user={this.props.user.name} />
                        <Switch>
                            <Route exact path="/" component={() => {return <Redirect to={`/company/${this.props.companies.list[this.props.companies.selected].id}`} />}} />
                            <Route exact path="/company/:company" component={DashboardContainer} />
                            <Route exact path="/company/:company/council/new" component={CreateCouncil} />
                            <Route exact path="/company/:company/council/:id/prepare" component={CouncilPrepareContainer} />                                                           
                            <Route exact path="/company/:company/council/:id/:step" component={CouncilEditorContainer} />                           
                            <Route path="/company/:company/councils/:section" component={CouncilContainer} />
                            <Route exact path="/company/:company/meetings/new" component={() => <div>Nueva conferencia</div>} />                            
                            <Route path="/company/:company/meetings/:section" component={MeetingsContainer} />
                            <Route exact path="/company/:company/meeting/new" component={CreateMeeting} />
                            <Route exact path="/company/:company/meeting/:id" component={MeetingEditorContainer} />
                            <Route exact path="/company/:company/censuses" component={CompanyDraftsContainer} />
                            <Route exact path="/company/:company/drafts" component={MeetingEditorContainer} />
                            
                            <Route path="*" component={NotFound}/>
                        </Switch>
                    </div>
                </div>
            :
                <Switch>
                    <Route exact path="/" component={LoginContainer}/>
                    <Route path="/signup" component={SignUpContainer}/>
                    <Route path="/welcome" component={Welcome} />
                    <Route path="*" component={NotFound}/>            
                </Switch>
        );
    }
}

const mapStateToProps = (state) => ({
    main: state.main,
    translate: state.translate,
    companies: state.companies,
    user: state.user
});

export default withRouter(connect(mapStateToProps)(AppRouter));
