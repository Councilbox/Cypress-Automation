import React, {Component} from 'react';
import AppRouter from './AppRouter';
import { Router } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import configureStore from '../store/store';
import { Provider } from 'react-redux';
import { setLanguage } from '../actions/mainActions';
import { setUserData } from '../actions/mainActions';

export const store = configureStore();
store.dispatch(setLanguage('pt'));
export const history = createHistory();
if(sessionStorage.getItem('token')){
    store.dispatch({type: 'LOGIN_SUCCESS'});
    store.dispatch(setUserData(sessionStorage.getItem('token')));
}

class App extends Component {

    render() {
        return (
            <Provider store={store}>
                <Router history={history}>
                    <AppRouter />
                </Router>
            </Provider>
        );
    }
}

export default App;
