import React, {Component} from 'react';
import Header from '../components/Header';
import LoginContainer from './LoginContainer';
import HomeContainer from './HomeContainer';
import SignUpContainer from './SignUpContainer';
import Welcome from '../components/Welcome';
import NotFound from "../components/NotFound";
import { Switch, Route, withRouter } from 'react-router-dom';
import {connect} from "react-redux";

class AppRouter extends Component {

    render() {
        return (
            this.props.main.isLogged?
                <Switch>
                    <Route exact path="/" component={HomeContainer}/>
                    <Route path="*" component={NotFound}/>
                </Switch>
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
    company: state.company
});


export default withRouter(connect(mapStateToProps)(AppRouter));
