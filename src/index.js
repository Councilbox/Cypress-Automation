import React from "react";
import ReactDOM from "react-dom";
import App from "./containers/App";
import registerServiceWorker from "./registerServiceWorker";
import Loadable from 'react-loadable';
import "./styles/index.css";
import LoadingMainApp from "./displayComponents/LoadingMainApp";
import "react-toastify/dist/ReactToastify.css";
import { unregister } from './registerServiceWorker';

const ThemeProviderLoad = Loadable({
	loader: () => import('./displayComponents/ThemeProvider'),
	loading: LoadingMainApp
});

document.getElementById('landingPage').innerHTML = '';

ReactDOM.render(
	<ThemeProviderLoad>
		<App/>
	</ThemeProviderLoad>,
	document.getElementById("root")
);
unregister();
//registerServiceWorker();

