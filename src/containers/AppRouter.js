import React, {Component} from 'react';
import '../styles/App.scss';
import Header from '../components/Header';
import LoginContainer from './LoginContainer';
import HomeContainer from './HomeContainer';
import NotFound from "../components/NotFound";
import { Switch, Route } from 'react-router-dom';
import {connect} from "react-redux";


class AppRouter extends Component {

    render() {
        return (
            [<Header />,
            this.props.main.isLogged?
                <Switch>
                    <Route exact path="/" component={HomeContainer}/>
                    <Route path="*" component={NotFound}/>
                </Switch>
            :
                <LoginContainer />
            ]
        );
    }
}

const mapStateToProps = (state) => ({
    main: state.main
});


export default connect(mapStateToProps)(AppRouter);
