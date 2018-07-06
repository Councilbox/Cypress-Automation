import React, { Component } from "react";
import AppRouter from "./AppRouter";
import { Route, Router, Switch } from "react-router-dom";
import CouncilLiveContainer from "./CouncilLiveContainer";
import MeetingLivePage from "../components/meeting/live/MeetingLivePage";
import MeetingCreateContainer from '../components/meeting/MeetingCreateContainer';
import createHistory from "history/createBrowserHistory";
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
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { API_URL } from "../config";
import { toast, ToastContainer } from "react-toastify";
import { graphQLErrorHandler, refreshToken, networkErrorHandler } from "../utils";
import moment from "moment";
import "moment/locale/es";
import 'antd/dist/antd.css';

moment.updateLocale("es");

const httpLink = new HttpLink({
	uri: API_URL
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
			"x-jwt-token": token ? token : participantToken
		}
	};
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
			networkErrorHandler(error, toast, store);
			if(error.message === 'Response not successful: Received status code 400'){
				graphQLErrorHandler({error, client, _operation});
			}
			return error.message === 'Failed to fetch'
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
		networkErrorHandler(networkError, toast, store)
	}
});

export const client = new ApolloClient({
	link: ApolloLink.from([retryLink, addStatusLink, logoutLink, authLink, httpLink]),
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
