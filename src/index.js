import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import registerServiceWorker from './registerServiceWorker';
import './styles/index.css';

ReactDOM.render(
    <MuiThemeProvider>
        <App/>
    </MuiThemeProvider>, document.getElementById('root'));
registerServiceWorker();
