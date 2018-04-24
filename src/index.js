import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import { unregister } from './registerServiceWorker';
import './styles/index.css';
import { ThemeProvider } from './components/displayComponents';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.render(
    <ThemeProvider>
        <App />
    </ThemeProvider>, document.getElementById('root'));
//registerServiceWorker();
unregister();