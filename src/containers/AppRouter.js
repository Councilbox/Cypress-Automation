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
import CompanySideMenu from '../components/CompanySideMenu';
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
            sideWidth: 10,
            open: false
        }    
    }

    toggleMenu = () => {
        if(this.state.sideWidth === 25){
            this.setState({
                sideWidth: 10,
                open: false
            });
        }else{
            this.setState({
                sideWidth: 25,
                open: true
            });
        }
    }

    render() {
        if(this.props.main.loading || !this.props.translate){
            return(<LoadingMainApp />);
        }

        if(this.props.main.isLogged && !this.props.company.id){
            return(<LoadingMainApp />);
        }

        return (
            this.props.main.isLogged?
                <div style={{width: '100%', height: '100vh', display: 'flex', flexDirection: 'row'}}>                                                      
                    <CompanySideMenu
                        width={this.state.sideWidth}
                        company={this.props.company}
                        toggleMenu={this.toggleMenu}
                        open={this.state.open}
                        translate={this.props.translate}
                    />
                    <div style={{width: `${100 - this.state.sideWidth}%`, height: '100%', display: 'flex', flexDirection: 'column'}}>
                        <Header user={this.props.user.name} />
                        <Switch>
                            <Route exact path="/" component={() => {return <Redirect to={`/company/${this.props.company.id}`} />}} />
                            <Route exact path="/company/:company" component={DashboardContainer} />
                            <Route exact path="/company/:company/council/new" component={CreateCouncil} />
                            <Route exact path="/company/:company/council/:id/prepare" component={CouncilPrepareContainer} />                                                           
                            <Route exact path="/company/:company/council/:id/:step" component={CouncilEditorContainer} />                           
                            <Route path="/company/:company/councils/:section" component={CouncilContainer} />
                            <Route exact path="/company/:company/meetings/new" component={() => <div>Nueva conferencia</div>} />                            
                            <Route path="/company/:company/meetings/:section" component={MeetingsContainer} />
                            <Route exact path="/company/:company/meeting/new" component={CreateMeeting} />
                            <Route exact path="/company/:company/meeting/:id" component={MeetingEditorContainer} />
                            
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
    company: state.company,
    user: state.user
});


export default withRouter(connect(mapStateToProps)(AppRouter));
