import React, { Component } from "react";
import AppRouter from "./AppRouter";
import { Route, Router, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import LoadingMainApp from '../displayComponents/LoadingMainApp';
import Loadable from 'react-loadable';
import configureStore from "../store/store";
import ErrorHandler from '../components/ErrorHandler';
import { Provider } from "react-redux";
import { initUserData, loadingFinished, setLanguage} from "../actions/mainActions";
import { ApolloClient } from "apollo-client";
import { RetryLink } from 'apollo-link-retry';
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
import moment from "moment/min/moment-with-locales.min";
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
	const participantToken = sessionStorage.getItem("participantToken");
	return {
		headers: {
			...headers,
			authorization: token
				? `Bearer ${token}`
				: `Bearer ${participantToken}`,
			"x-jwt-token": token ? token : participantToken,
			"cbx-client-v": CLIENT_VERSION
		}
	};
});

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

const retryLink = new RetryLink({
	delay: {
		initial: 500,
		max: Infinity,
		jitter: true
	},
	attempts: {
		max: 10,
		retryIf: (error, _operation) => {
			/* console.log(error.name);
			console.log(error.message);
			console.log(_operation); */
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
							"x-jwt-token": token ? token : participantToken
						}
					});
					sub = forward(operation).subscribe(observable);
				});

				return () => (sub? sub.unsubscribe() : null);
			});
		}

		graphQLErrors.map(error => graphQLErrorHandler(error, toast, store, client, operation));
	}

	if(networkError){
		networkErrorHandler(networkError, toast, store, client, operation);
	}
});

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

export const store = configureStore();
store.dispatch(setLanguage("es"));
export const bHistory = createHistory();
if (sessionStorage.getItem("token")) {
	store.dispatch({ type: "LOGIN_SUCCESS" });
	store.dispatch(initUserData());
} else {
	store.dispatch(loadingFinished());
}

if(sessionStorage.getItem("participantLoginSuccess")){
	store.dispatch({ type: "PARTICIPANT_LOGIN_SUCCESS" });
}

class App extends Component {
	render() {
		return (
			<ApolloProvider client={client}>
				<Provider store={store}>
					<ErrorHandler>
						<Router history={bHistory}>
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
								<ToastContainer position="top-right" />
							</React.Fragment>
						</Router>
					</ErrorHandler>
				</Provider>
			</ApolloProvider>
		);
	}
}

export default App;
