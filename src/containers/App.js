/* eslint-disable no-use-before-define */
import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { createBrowserHistory as createHistory } from 'history';
import Loadable from 'react-loadable';
import { Provider } from 'react-redux';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { RetryLink } from 'apollo-link-retry';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink, Observable, split } from 'apollo-link';
import { ApolloProvider } from 'react-apollo';
import { WebSocketLink } from 'apollo-link-ws';
import { setContext } from 'apollo-link-context';
import { getMainDefinition } from 'apollo-utilities';
import { onError } from 'apollo-link-error';
import moment from 'moment/min/moment-with-locales.min';
import '../styles/antd.css';
import { API_URL, CLIENT_VERSION, WS_URL } from '../config';
import AppRouter from './AppRouter';
import { graphQLErrorHandler, refreshToken, networkErrorHandler } from '../utils';
import AppControl from './AppControl';
import {
	initUserData, loadingFinished, loadSubdomainConfig, setLanguage, noServerResponse, serverRestored
} from '../actions/mainActions';
import ErrorHandler from '../components/ErrorHandler';
import ThemeProvider from '../displayComponents/ThemeProvider';
import configureStore from '../store/store';
import LoadingMainApp from '../displayComponents/LoadingMainApp';
import ValidatorPage from '../components/notLogged/validator/ValidatorPage';
import ConveneDisplay from '../components/council/convene/ConveneDisplay';
import { pageView } from '../utils/analytics';
import { shouldLoadSubdomain, useSubdomain } from '../utils/subdomain';
import Test from '../components/participant/test/Test';
import DownloadFile from '../components/DownloadFile';

export { moment };

const httpLink = new HttpLink({
	uri: API_URL
});

export const bHistory = createHistory();
export const store = configureStore();

const getToken = () => {
	const token = sessionStorage.getItem('token');
	const apiToken = sessionStorage.getItem('apiToken');
	const participantToken = sessionStorage.getItem('participantToken');
	return token || (apiToken || participantToken);
};

function getDefaultLanguage() {
	const languages = {
		es: 'es',
		ca: 'cat',
		en: 'en',
		gl: 'gal',
		pt: 'pt'
	};

	const languageCode = navigator.language || navigator.userLanguage;
	const language = languageCode.split('-')[0];
	return languages[language] ? languages[language] : 'en';
}

const wsLink = new WebSocketLink({
	uri: WS_URL,
	options: {
		reconnect: true,
		timeout: 3000,
		connectionParams: () => ({
			token: getToken()
		})
	}
});

export const refreshWSLink = () => {
	wsLink.subscriptionClient.close(false, false);
	wsLink.subscriptionClient.connect();
};


const authLink = setContext((_, { headers }) => ({
	headers: {
		...headers,
		'x-jwt-token': getToken(),
		'cbx-client-v': CLIENT_VERSION
	}
}));

const link = split(
	({ query }) => {
		const { kind, operation } = getMainDefinition(query);
		return kind === 'OperationDefinition' && operation === 'subscription';
	},
	wsLink,
	httpLink,
);

const CouncilLiveContainer = Loadable({
	loader: () => import('./CouncilLiveContainer'),
	loading: LoadingMainApp
});
const MeetingLivePage = Loadable({
	loader: () => import('../components/meeting/live/MeetingLivePage'),
	loading: LoadingMainApp
});
const MeetingCreateContainer = Loadable({
	loader: () => import('../components/meeting/MeetingCreateContainer'),
	loading: LoadingMainApp
});
const CouncilLiveTestContainer = Loadable({
	loader: () => import('./CouncilLiveTestContainer'),
	loading: LoadingMainApp
});
const DocsPage = Loadable({
	loader: () => import('../components/docs/DocsPage'),
	loading: LoadingMainApp
});
const PlaygroundPage = Loadable({
	loader: () => import('../components/docs/PlaygroundPage'),
	loading: LoadingMainApp
});

// eslint-disable-next-line no-extend-native, func-names
String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

const retryLink = new RetryLink({
	delay: {
		initial: 1000,
		max: Infinity,
		jitter: true
	},
	attempts: {
		retryIf: (error, _operation) => {
			networkErrorHandler(error, toast, store, client, _operation);
			return error.message === 'Failed to fetch';
		}
	}
});

const addStatusLink = new ApolloLink((operation, forward) => forward(operation).map(response => {
	networkErrorHandler(null, toast, store);
	return response;
}));


const logoutLink = onError(({
	graphQLErrors, networkError, operation, forward
}) => {
	console.info(graphQLErrors);
	console.info(networkError);

	if (graphQLErrors) {
		if (graphQLErrors[0].code === 440) {
			return new Observable(observable => {
				let sub = null;
				refreshToken(client, toast, store).then(() => {
					const token = sessionStorage.getItem('token');
					const participantToken = sessionStorage.getItem('participantToken');
					operation.setContext({
						headers: {
							...operation.getContext().headers,
							authorization: token ?
								`Bearer ${token}`
								: `Bearer ${participantToken}`,
							// "x-jwt-token": token ? token : participantToken
						}
					});
					sub = forward(operation).subscribe(observable);
				});

				return () => (sub ? sub.unsubscribe() : null);
			});
		}
		graphQLErrors.map(error => graphQLErrorHandler(error, toast, store, client, operation, bHistory));
	}

	if (networkError) {
		networkErrorHandler(networkError, toast, store, client, operation);
	}
});

window.addEventListener('offline', () => {
	store.dispatch(noServerResponse());
});

window.addEventListener('online', () => {
	store.dispatch(serverRestored());
});

export const client = new ApolloClient({
	link: ApolloLink.from([retryLink, addStatusLink, logoutLink, authLink, link]),
	cache: new InMemoryCache(),
	defaultOptions: {
		query: {
			fetchPolicy: 'network-only',
			errorPolicy: 'all'
		},
		mutate: {
			errorPolicy: 'all'
		}
	}
});

if (sessionStorage.getItem('token')) {
	store.dispatch({ type: 'LOGIN_SUCCESS' });
	store.dispatch(initUserData());
} else {
	store.dispatch(loadingFinished());
}

if (shouldLoadSubdomain()) {
	store.dispatch(loadSubdomainConfig());
}

if (sessionStorage.getItem('participantLoginSuccess')) {
	store.dispatch({ type: 'PARTICIPANT_LOGIN_SUCCESS' });
}

export const MainContext = React.createContext();

const App = () => (
	<ApolloProvider client={client}>
		<Provider store={store}>
			<ThemeProvider>
				<ErrorHandler>
					<AppControl>
						<MainContext.Provider value={{
							client,
							bHistory
						}}>
							<Router history={bHistory}>
								<RouterWrapper />
							</Router>
						</MainContext.Provider>
					</AppControl>
				</ErrorHandler>
			</ThemeProvider>
		</Provider>
	</ApolloProvider>
);

const LoadRecommendations = Loadable({
	loader: () => import('../components/noCompany/Recommendations'),
	loading: LoadingMainApp
});

const RouterWrapper = () => {
	React.useEffect(() => {
		pageView();
	}, [window.location.href]);
	const subdomain = useSubdomain();
	let language = (subdomain && subdomain.defaultLanguage) ? subdomain.defaultLanguage : getDefaultLanguage();

	const state = store.getState();
	const { user, translate } = state;
	if (user?.preferredLanguage) {
		language = user.preferredLanguage;
	}

	React.useEffect(() => {
		if (!translate || !translate.selectedLanguage || translate.selectedLanguage !== language) {
			store.dispatch(setLanguage(language));
		}
	}, [language]);

	return (
		<React.Fragment>
			<Switch>
				<Route path="/download/:token" component={DownloadFile} />
				<Route
					exact
					path="/company/:company/council/:id/live"
					component={CouncilLiveContainer}
				/>
				<Route exact path="/test/:language" component={Test} />
				<Route
					path="/company/:company/council/:council/recommendations/:language"
					component={LoadRecommendations}
				/>
				<Route
					exact
					path="/cmp/:id"
					component={CouncilLiveTestContainer}
				/>
				<Route
					exact
					path="/evidence/:uuid?"
					component={ValidatorPage}
				/>
				<Route
					exact
					path="/convene/:id"
					component={ConveneDisplay}
				/>
				{!window.location.hostname.includes('app.councilbox')
					&& <Route
						exact
						path="/docs"
						component={DocsPage}
					/>
				}
				{!window.location.hostname.includes('app.councilbox')
					&& <Route
						exact
						path="/docs/tryit"
						component={PlaygroundPage}
					/>
				}
				<Route
					exact
					path="/company/:company/meeting/live"
					component={MeetingLivePage}
				/>
				<Route
					exact
					path="/meeting/"
					component={MeetingLivePage}
				/>
				<Route
					exact
					path="/meeting/new"
					component={MeetingCreateContainer}
				/>
				<Route path="/" component={AppRouter} />
			</Switch>
			<ToastContainer
				position="top-right"
				progressClassName={'toastProgressBar'}
			/>
		</React.Fragment>
	);
};

export default App;
