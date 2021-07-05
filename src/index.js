import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import './styles/index.css';
import 'react-toastify/dist/ReactToastify.css';
import { unregister } from './registerServiceWorker';
import { init } from './utils/analytics';


init();
document.getElementById('landingPage').innerHTML = '';

ReactDOM.render(
	<App/>, document.getElementById('root')
);
unregister();

