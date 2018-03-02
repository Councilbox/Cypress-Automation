import React, {Component} from 'react';
import AppRouter from './AppRouter';
import { Router, Switch, Route } from 'react-router-dom';
import CouncilLiveContainer from './CouncilLiveContainer';
import createHistory from 'history/createBrowserHistory';
import configureStore from '../store/store';
import { Provider } from 'react-redux';
import { setLanguage, setUserData, loadingFinished } from '../actions/mainActions';
import { getCompanies } from '../actions/companyActions';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';


const httpLink = new HttpLink({
    uri: 'http://172.18.2.65:5000/graphql'
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
  })

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})


export const store = configureStore();
store.dispatch(setLanguage('es'));
export const bHistory = createHistory();
if(sessionStorage.getItem('token')){
    store.dispatch({type: 'LOGIN_SUCCESS'});
    store.dispatch(setUserData(sessionStorage.getItem('token')));
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
