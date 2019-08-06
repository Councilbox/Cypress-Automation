import React from "react";
import AppRouter from "./AppRouter";
import { Route, Router, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import LoadingMainApp from '../displayComponents/LoadingMainApp';
import Loadable from 'react-loadable';
import configureStore from "../store/store";
import ThemeProvider from "../displayComponents/ThemeProvider";
import ErrorHandler from '../components/ErrorHandler';
import { Provider } from "react-redux";
import { initUserData, loadingFinished, loadSubdomainConfig, setLanguage, noServerResponse, serverRestored } from "../actions/mainActions";
import { ApolloClient } from "apollo-client";
import { RetryLink } from 'apollo-link-retry';
import AppControl from './AppControl';
import { HttpLink } from "apollo-link-http";
import { ApolloLink, Observable } from 'apollo-link';
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";
import { WebSocketLink } from 'apollo-link-ws';
import { setContext } from "apollo-link-context";
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { onError } from "apollo-link-error";
import { API_URL, CLIENT_VERSION, WS_URL } from "../config";
import { toast, ToastContainer } from "react-toastify";
import { graphQLErrorHandler, refreshToken, networkErrorHandler } from "../utils";
import '../styles/antd.css';
import AdomWrapper from './AdomWrapper';
import moment from "moment/min/moment-with-locales.min";
import ValidatorPage from "../components/notLogged/validator/ValidatorPage";
import ConveneDisplay from "../components/council/convene/ConveneDisplay";
import { pageView } from "../utils/analytics";
import withSharedProps from "../HOCs/withSharedProps";
import { shouldLoadSubdomain } from "../utils/subdomain";
export { moment as moment };

const httpLink = new HttpLink({
	uri: API_URL
});


const wsLink = new WebSocketLink({
	uri: WS_URL,
	options: {
		reconnect: true,
		timeout: 3000,
		connectionParams: {
			token: sessionStorage.getItem("token"),
		},
	}
});

const authLink = setContext((_, { headers }) => {
	const token = sessionStorage.getItem("token");
	const apiToken = sessionStorage.getItem('apiToken');
	const participantToken = sessionStorage.getItem("participantToken");
	return {
		headers: {
			...headers,
			/* authorization: token
				? `Bearer ${token}`
				: apiToken? `Bearer ${apiToken}` :
				`Bearer ${participantToken}`, */
			"x-jwt-token": token ? token : apiToken? apiToken : participantToken,
			"cbx-client-v": CLIENT_VERSION
		}
	};
});

const link = split(
	({ query, ...rest }) => {
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
	loader: () => import("../components/docs/DocsPage"),
	loading: LoadingMainApp
})
const PlaygroundPage = Loadable({
	loader: () => import("../components/docs/PlaygroundPage"),
	loading: LoadingMainApp
})

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

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

const addStatusLink = new ApolloLink((operation, forward) => {
	return forward(operation).map((response) => {
		networkErrorHandler(null, toast, store);
		return response;
	});
});


const logoutLink = onError(({ graphQLErrors, networkError, operation, response, forward}) => {
	console.error(graphQLErrors);
	console.error(networkError);

 	if (graphQLErrors) {
		if (graphQLErrors[0].code === 440) {
			return new Observable(observable => {
				let sub = null;
				refreshToken(client, toast, store).then(() => {
					const token = sessionStorage.getItem("token");
					const participantToken = sessionStorage.getItem("participantToken");
					operation.setContext({
						headers: {
							...operation.getContext().headers,
							authorization: token
								? `Bearer ${token}`
								: `Bearer ${participantToken}`,
							//"x-jwt-token": token ? token : participantToken
						}
					});
					sub = forward(operation).subscribe(observable);
				});

				return () => (sub? sub.unsubscribe() : null);
			});
		}
		graphQLErrors.map(error => graphQLErrorHandler(error, toast, store, client, operation, bHistory));
	}

	if(networkError){
		networkErrorHandler(networkError, toast, store, client, operation);
	}
});

window.addEventListener('offline', () => {
	store.dispatch(noServerResponse());
})

window.addEventListener('online', () => {
	store.dispatch(serverRestored());
})

export const client = new ApolloClient({
	link: ApolloLink.from([retryLink, addStatusLink, logoutLink, authLink, link]),
	cache: new InMemoryCache(),
	defaultOptions: {
		query: {
			fetchPolicy: "network-only",
			errorPolicy: "all"
		},
		mutate: {
			errorPolicy: "all"
		}
	}
});
export const bHistory = createHistory();

export const store = configureStore();
store.dispatch(setLanguage("es"));
if (sessionStorage.getItem("token")) {
	store.dispatch({ type: "LOGIN_SUCCESS" });
	store.dispatch(initUserData());
} else {
	store.dispatch(loadingFinished());
}

if(shouldLoadSubdomain()){
	store.dispatch(loadSubdomainConfig());
}

if(sessionStorage.getItem("participantLoginSuccess")){
	store.dispatch({ type: "PARTICIPANT_LOGIN_SUCCESS" });
}

const App = () => {
	return (
		<ApolloProvider client={client}>
			<Provider store={store}>
				<ThemeProvider>
					<ErrorHandler>
						<AppControl>
							<AdomWrapper>
								<Router history={bHistory}>
									<RouterWrapper />
								</Router>
							</AdomWrapper>
						</AppControl>
					</ErrorHandler>
				</ThemeProvider>
			</Provider>
		</ApolloProvider>
	);
}

const RouterWrapper = props => {
	React.useEffect(() => {
		pageView();
	}, [window.location.href]);

	return (
		<React.Fragment>
			<Switch>
				<Route
					exact
					path="/company/:company/council/:id/live"
					component={CouncilLiveContainer}
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
				{!window.location.hostname.includes('app.councilbox') &&
						<Route
							exact
							path="/docs"
							component={DocsPage}
						/>
					}
					{!window.location.hostname.includes('app.councilbox') &&
						<Route
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
	)
};

export default App;
