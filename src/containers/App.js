import React, {Component} from 'react';
import AppRouter from './AppRouter';
import { Router, Switch, Route } from 'react-router-dom';
import CouncilLiveContainer from './CouncilLiveContainer';
import MeetingLiveContainer from './MeetingLiveContainer';
import createHistory from 'history/createBrowserHistory';
import configureStore from '../store/store';
import { Provider } from 'react-redux';
import { setLanguage, initUserData, loadingFinished, logout } from '../actions/mainActions';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { API_URL } from '../config';
import { ToastContainer, toast } from 'react-toastify';
import { printSessionExpiredError } from '../utils/CBX'; 

const httpLink = new HttpLink({
    uri: API_URL
});

const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      "x-jwt-token": token
    }
  }
});

const logoutLink = onError(({ graphQLErrors, networkError }) => {
    console.log(graphQLErrors);
    console.log(networkError);
    const translate = store.getState().translate;   
    if(graphQLErrors){
        if(graphQLErrors[0].code === 440){
            toast.error(printSessionExpiredError());
            store.dispatch(logout());
        }else{
            //toast.error(graphQLErrors[0].message);
        }
    }
});

export const client = new ApolloClient({
    link: logoutLink.concat(authLink.concat(httpLink)),
    cache: new InMemoryCache()
})

export const store = configureStore();
store.dispatch(setLanguage('es'));
export const bHistory = createHistory();
if(sessionStorage.getItem('token')){
    store.dispatch({type: 'LOGIN_SUCCESS'});
    store.dispatch(initUserData());
}else{
    store.dispatch(loadingFinished());
}

class App extends Component {

    render() {
        return (
            <ApolloProvider client={client}>
                <Provider store={store}>
                    <Router history={bHistory}>
                        <React.Fragment>
                            <Switch>
                                <Route exact path="/company/:company/council/:id/live" component={CouncilLiveContainer} />
                                <Route exact path="/company/:company/meeting/:id/live" component={MeetingLiveContainer} />                            
                                <Route path="/" component={AppRouter} />
                            </Switch>
                            <ToastContainer
                                position="top-right"
                            />
                        </React.Fragment>
                    </Router>
                </Provider>
            </ApolloProvider>
        );
    }
}

export default App;
