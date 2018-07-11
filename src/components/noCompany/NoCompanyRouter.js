import React from 'react';
import Header from '../Header';
import { lightGrey } from '../../styles/colors';
import NoCompanyDashboard from './NoCompanyDashboard';
import { Route, Redirect, Switch } from 'react-router-dom';
import UserSettingsPage from '../userSettings/UserSettingsPage';
import NewCompanyPage from '../company/new/NewCompanyPage';
import LinkCompanyPage from '../company/link/LinkCompanyPage';

class NoCompanyRouter extends React.Component {

    render(){
        return(
            <div
                style={{
                    width: '100vw',
                    height: '100vh',
                    overflow: 'hidden',
                }}
            >
                <Header
                    translate={this.props.translate}
                    user={this.props.user}
                    backButton={this.props.location.pathname !== `/`}
                />
                <div
                    style={{
                        height: 'calc(100vh - 3em)',
                        width: '100%',
                        backgroundColor: lightGrey,
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <Switch>
                        <Route exact path="/" component={() => <NoCompanyDashboard translate={this.props.translate}user={this.props.user} />} />
                        <Route exact path="/company/create" component={NewCompanyPage} />
                        <Route exact path="/company/link" component={() => (
                            <div style={{maxWidth: '650px', minWidth: '550px', height: '400px'}}>
                                <LinkCompanyPage />
                            </div>
                        )} />
                        <Route exact path="/user/:id" component={UserSettingsPage} />
                        <Route path="*" component={() => <Redirect to="/" />} />
                    </Switch>
                </div>
            </div>
        )
    }
}

export default NoCompanyRouter;