import React from 'react';
import Loadable from 'react-loadable';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from '../components/notLogged/Login';
import ParticipantPanel from '../components/ovac/participant/ParticipantPanel';
import { LoadingMainApp } from '../displayComponents';
import AssistanceTokenContainer from './AssistanceTokenContainer';
import ParticipantContainer from './ParticipantContainer';
import ParticipantTokenContainer from './ParticipantTokenContainer';


const LoadLandingPage = Loadable({
	loader: () => import('../components/ovac/notLogged/LandingPage'),
	loading: LoadingMainApp
});

const LoadCreateAppointment = Loadable({
	loader: () => import('../components/ovac/notLogged/create/CreateAppointmentPage'),
	loading: LoadingMainApp
});

const OvacRouter = () => {
	const redirectToLanding = () => <Redirect to="/" />;

	return (
		<Switch>
			<Route exact path="/" component={LoadLandingPage} />
			<Route exact path="/admin" component={Login} />
			<Route exact path="/newAppointment/:language?" component={LoadCreateAppointment} />
			<Route
				exact
				path="/attendance/token/:token/"
				component={AssistanceTokenContainer}
			/>
			<Route
				exact
				path={'/attendance/participant/:participantId/council/:councilId/:section?'}
				component={ParticipantPanel}
			/>
			<Route
				exact
				path="/participant/token/:token"
				component={ParticipantTokenContainer}
			/>
			<Route
				exact
				path="/participant/:id/council/:councilId/:segment?"
				component={ParticipantContainer}
			/>
			<Route
				path="*"
				component={redirectToLanding}
			/>
		</Switch>
	);
};

export default OvacRouter;
