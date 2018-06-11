import React, { Component } from "react";
import AppRouter from "./AppRouter";
import { Route, Router, Switch } from "react-router-dom";
import CouncilLiveContainer from "./CouncilLiveContainer";
import MeetingLiveContainer from "./MeetingLiveContainer";
import createHistory from "history/createBrowserHistory";
import configureStore from "../store/store";
import { Provider } from "react-redux";
import { initUserData, loadingFinished, resetStore, setLanguage} from "../actions/mainActions";
import { ApolloClient } from "apollo-client";
//import { RetryLink } from 'apollo-link-retry';
import { HttpLink } from "apollo-link-http";
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { API_URL } from "../config";
import { toast, ToastContainer } from "react-toastify";
import { graphQLErrorHandler, networkErrorHandler } from "../utils";
import moment from "moment";
import "moment/locale/es";

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

/*const retryLink = new RetryLink({
	delay: {
		initial: 500,
		max: Infinity,
		jitter: true
	},
	attempts: {
		max: 10,
		retryIf: (error, _operation) => {
			console.log(error);
			networkErrorHandler(error, toast, store);
			return !!error
		}
	}
});*/

const addStatusLink = new ApolloLink((operation, forward) => {
	return forward(operation).map((response) => {
		networkErrorHandler(null, toast, store);
		return response;
	})
  })

const logoutLink = onError(({ graphQLErrors, networkError, response }) => {
	console.log(graphQLErrors);
	console.log(networkError);
	if (graphQLErrors) {
		graphQLErrorHandler(graphQLErrors, toast, store);
	}
	//networkErrorHandler(networkError, toast, store);
});

export const client = new ApolloClient({
	link: logoutLink.concat(authLink.concat(addStatusLink.concat(httpLink))),
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
									path="/company/:company/meeting/:id/live"
									component={MeetingLiveContainer}
								/>
								<Route path="/" component={AppRouter} />
							</Switch>
							<ToastContainer position="top-right" />
						</React.Fragment>
					</Router>
				</Provider>
			</ApolloProvider>
		);
	}
}

export default App;
