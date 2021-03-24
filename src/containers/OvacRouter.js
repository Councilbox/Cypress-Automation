import React from 'react';
import Loadable from 'react-loadable';
import { Switch, Route, Redirect } from 'react-router-dom';
import { LoadingMainApp } from '../displayComponents';

const LoadLandingPage = Loadable({
	loader: () => import('../components/ovac/notLogged/LandingPage'),
	loading: LoadingMainApp
});

const OvacRouter = () => {
	const redirectToLanding = () => <Redirect to="/" />;

	return (
		<Switch>
			<Route exact path="/" component={LoadLandingPage} />
			<Route
				path="*"
				component={redirectToLanding}
			/>
		</Switch>
	);
};

export default OvacRouter;
