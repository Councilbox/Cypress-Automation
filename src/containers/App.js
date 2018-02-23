import React, {Component} from 'react';
import AppRouter from './AppRouter';
import { Router, Switch, Route } from 'react-router-dom';
import CouncilLiveContainer from './CouncilLiveContainer';
import createHistory from 'history/createBrowserHistory';
import configureStore from '../store/store';
import { Provider } from 'react-redux';
import { setLanguage, setUserData, loadingFinished } from '../actions/mainActions';
import { getCompanyInfo } from '../actions/companyActions';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { setContext } from 'apollo-link-context';


const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql'
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = sessionStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      "x-jwt-token": token
    }
  }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})


export const store = configureStore();
store.dispatch(setLanguage('es'));
export const bHistory = createHistory();
if(sessionStorage.getItem('token')){
    store.dispatch({type: 'LOGIN_SUCCESS'});
    store.dispatch(setUserData(sessionStorage.getItem('token')));
    store.dispatch(getCompanyInfo());
}else{
    store.dispatch(loadingFinished());
}

class App extends Component {

    render() {
        return (
            <ApolloProvider client={client}>
                <Provider store={store}>
                    <Router history={bHistory}>
                        <Switch>
                            <Route exact path="/company/:company/council/:id/live" component={CouncilLiveContainer} />
                            <Route path="/" component={AppRouter} />
                        </Switch>
                    </Router>
                </Provider>
            </ApolloProvider>
        );
    }
}

export default App;
