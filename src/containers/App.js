import React, {Component} from 'react';
import AppRouter from './AppRouter';
import { Router } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import configureStore from '../store/store';
import { Provider } from 'react-redux';
import { setLanguage, setUserData, loadingFinished } from '../actions/mainActions';
import { getCompanyInfo } from '../actions/companyActions';

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
            <Provider store={store}>
                <Router history={bHistory}>
                    <AppRouter />
                </Router>
            </Provider>
        );
    }
}

export default App;
