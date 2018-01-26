import React, {Component} from 'react';
import Header from '../components/Header';
import LoginContainer from './LoginContainer';
import CouncilContainer from './CouncilContainer';
import SignUpContainer from './SignUpContainer';
import MeetingsContainer from './MeetingsContainer';
import Welcome from '../components/Welcome';
import NotFound from "../components/NotFound";
import { Switch, Route, withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import CompanySideMenu from '../components/CompanySideMenu';
import DashboardContainer from './DashboardContainer';
import CouncilEditorContainer from './CouncilEditorContainer';
import CreateCouncil from '../components/CreateCouncil';

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
        if(this.props.main.loading){
            return(<p>Spinner spinning... </p>);
        }

        return (
            this.props.main.isLogged?
                <div style={{width: '100%', height: '100vh', display: 'flex', flexDirection: 'row'}}>
                    <CompanySideMenu
                        width={this.state.sideWidth}
                        company={this.props.company}
                        toggleMenu={this.toggleMenu}
                        open={this.state.open}
                    />
                    <div style={{width: `${100 - this.state.sideWidth}%`, height: '100%', display: 'flex', flexDirection: 'column'}}>
                        <Header user={this.props.user.name} />
                        <Switch>
                            <Route exact path="/" component={DashboardContainer} />
                            <Route exact path="/councils/new" component={CreateCouncil} />
                            <Route exact path="/councils/:company/:id" component={CouncilEditorContainer} />
                            <Route path="/councils/:section" component={CouncilContainer} />
                            <Route exact path="/meetings/new" component={() => <div>Nueva conferencia</div>} />                            
                            <Route path="/meetings/:section" component={MeetingsContainer} />
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
    translations: state.translate,
    company: state.company,
    user: state.user
});


export default withRouter(connect(mapStateToProps)(AppRouter));
