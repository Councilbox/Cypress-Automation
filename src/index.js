import React from "react";
import ReactDOM from "react-dom";
import App from "./containers/App";
import Loadable from 'react-loadable';
import "./styles/index.css";
import LoadingMainApp from "./displayComponents/LoadingMainApp";
import "react-toastify/dist/ReactToastify.css";
import { unregister } from './registerServiceWorker';
import { init } from './utils/analytics';
init();

if(process.env.REACT_APP_HOTJAR){
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:1389461,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
}

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

