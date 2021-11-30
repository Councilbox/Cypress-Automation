import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Header from '../Header';
import { lightGrey } from '../../styles/colors';
import NoCompanyDashboard from './NoCompanyDashboard';
import UserSettingsPage from '../userSettings/UserSettingsPage';
import NewCompanyPage from '../company/new/NewCompanyPage';
import LinkCompanyPage from '../company/link/LinkCompanyPage';
import { HEADER_HEIGHT } from '../../styles/constants';


class NoCompanyRouter extends React.Component {
	render() {
		return (
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
					backButton={this.props.location.pathname !== '/'}
				/>
				<div
					style={{
						height: `calc(100vh - ${HEADER_HEIGHT})`,
						width: '100%',
						backgroundColor: lightGrey,
						overflow: 'hidden',
						display: 'flex',
						justifyContent: 'center'
					}}
				>
					<Switch>
						<Route exact path="/" component={NoCompanyDashboard} />
						<Route exact path="/company/create" component={NewCompanyPage} />
						<Route exact path="/company/link" component={LinkCompanyPage}/>
						<Route exact path="/user/:id" component={UserSettingsPage} />
						<Route path="*" component={() => <Redirect to="/" />} />
					</Switch>
				</div>
			</div>
		);
	}
}

export default NoCompanyRouter;
