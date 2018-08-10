const LOCATION_URL =
	process.env.REACT_APP_MODE === "dev"
		? "http://localhost:5000/graphql"
		: "https://apicbx.councilbox.com/graphql";

export const WS_URL = process.env.REACT_APP_MODE === "dev" ? "ws://localhost:5000/subscriptions" : "wss://apicbx.councilbox.com/subscriptions";

export const CLIENT_VERSION = '1.0.0';
export const API_URL = LOCATION_URL;
export const videoVersions = {
	CMP: 'CMP',
	OLD: 'OLD'
}
export const config = {
	videoEnabled: true,
	videoVersion: videoVersions.CMP //OLD - CMP
}

// POINT CLIENT TO VPS SERVER
//const LOCATION_URL = process.env.REACT_APP_MODE === 'dev'? 'localhost:5000/graphql' : 'apicbx.councilbox.com';

//export const API_URL = `https://${LOCATION_URL}`;
