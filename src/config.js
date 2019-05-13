const LOCATION_URL =
	process.env.REACT_APP_MODE === "dev"
		? `http://${process.env.REACT_APP_LOCAL_API}/graphql`
		: `https://${process.env.REACT_APP_API_URL}/graphql`;

export const WS_URL = process.env.REACT_APP_MODE === "dev" ? "ws://localhost:5000/subscriptions" : `wss://${process.env.REACT_APP_API_URL}/subscriptions`;
export const singleVoteCompanies = [449];
if(process.env.REACT_APP_MODE === 'dev'){
	//singleVoteCompanies.push(375);
}

export const EXPLORER_URL = 'https://alastria-explorer.councilbox.com';

export const CLIENT_VERSION = process.env.REACT_APP_VERSION;
export const API_URL = LOCATION_URL;
export const videoVersions = {
	CMP: 'CMP',
	OLD: 'OLD'
}
export const config = {
	videoEnabled: true,
	videoVersion: videoVersions.CMP //OLD - CMP
}

export const CONTACT_URL = "https://www.councilbox.com/contactar/";
export const CONSENTIO_ID = 443;
export const TRIAL_DAYS = 5;

// POINT CLIENT TO VPS SERVER
//const LOCATION_URL = process.env.REACT_APP_MODE === 'dev'? 'localhost:5000/graphql' : 'apicbx.councilbox.com';

//export const API_URL = `https://${LOCATION_URL}`;
