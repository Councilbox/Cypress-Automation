import React from "react";
import ReactDOM from "react-dom";
import App from "./containers/App";
import registerServiceWorker, { unregister } from "./registerServiceWorker";
import Loadable from 'react-loadable';
import "./styles/index.css";
//import { ThemeProvider } from "./displayComponents";
import LoadingMainApp from "./displayComponents/LoadingMainApp";
import "react-toastify/dist/ReactToastify.css";

const ThemeProviderLoad = Loadable({
	loader: () => import('./displayComponents/ThemeProvider'),
	loading: LoadingMainApp
});

document.getElementById('landingPage').innerHTML = '';


/*  const App = Loadable({
	 loader: () => import('./containers/App'),
	 loading: LoadingMainApp
 }) */

ReactDOM.render(
	<ThemeProviderLoad>
		<App/>
	</ThemeProviderLoad>,
	document.getElementById("root")
);
registerServiceWorker();

