import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';
import './styles/index.css';
import { ThemeProvider } from './components/displayComponents';



ReactDOM.render(
    <ThemeProvider>
        <App />
    </ThemeProvider>, document.getElementById('root'));
registerServiceWorker();