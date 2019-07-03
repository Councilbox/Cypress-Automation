import React from "react";
import ReactDOM from "react-dom";
import App from "./containers/App";
import Loadable from 'react-loadable';
import "./styles/index.css";
import LoadingMainApp from "./displayComponents/LoadingMainApp";
import "react-toastify/dist/ReactToastify.css";
import { unregister } from './registerServiceWorker';
import ReactGa from 'react-ga';

ReactGa.initialize(process.env.REACT_APP_GTAG_ID);

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

