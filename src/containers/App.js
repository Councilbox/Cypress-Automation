import React, {Component} from 'react';
import '../styles/App.css';
import AppRouter from './AppRouter';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import configureStore from '../store/store';
import { Provider } from 'react-redux';

export const store = configureStore();

class App extends Component {

    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <AppRouter />
                </BrowserRouter>
            </Provider>
        );
    }
}

export default App;
