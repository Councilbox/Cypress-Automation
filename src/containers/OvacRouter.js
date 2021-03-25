import React from 'react';
import Loadable from 'react-loadable';
import { Switch, Route, Redirect } from 'react-router-dom';
import { LoadingMainApp } from '../displayComponents';

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
			<Route exact path="/newAppointment/:language?" component={LoadCreateAppointment} />
			<Route
				path="*"
				component={redirectToLanding}
			/>
		</Switch>
	);
};

export default OvacRouter;
