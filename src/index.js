import React from "react";
import ReactDOM from "react-dom";
import App from "./containers/App";
import "./styles/index.css";
import "react-toastify/dist/ReactToastify.css";
import { unregister } from './registerServiceWorker';
import { init } from './utils/analytics';
init();


if(process.env.REACT_APP_HOTJAR){
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:525880,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
}

document.getElementById('landingPage').innerHTML = '';

ReactDOM.render(
	<App/>, document.getElementById("root")
);
unregister();

