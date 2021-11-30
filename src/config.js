import { shouldLoadSubdomain } from './utils/subdomain';

export const SERVER_URL
	= process.env.REACT_APP_MODE === 'dev' ?
		`http://${window.location.hostname}:5000`
		: `https://${process.env.REACT_APP_API_URL}`;

export const WS_URL = process.env.REACT_APP_MODE === 'dev' ? `ws://${window.location.hostname}:5000/subscriptions` : `wss://${process.env.REACT_APP_API_URL}/subscriptions`;
export const singleVoteCompanies = [449];
if (process.env.REACT_APP_MODE === 'dev') {
	// singleVoteCompanies.push(375);
}

export const variants = {
	COE: 'COE'
};

const getVariant = () => {
	if (shouldLoadSubdomain()) return 'CUSTOM';
	return false;
};

export const variant = getVariant();
export const EXPLORER_URL = 'https://alastria-explorer.councilbox.com';

export const CLIENT_VERSION = process.env.REACT_APP_VERSION || '8.12.0';
export const API_URL = `${SERVER_URL}/graphql`;
export const videoVersions = {
	CMP: 'CMP',
	OLD: 'OLD'
};
export const config = {
	videoEnabled: true,
	videoVersion: videoVersions.CMP // OLD - CMP
};

export const CONTACT_URL = 'https://www.councilbox.com/contactar/';
export const CONSENTIO_ID = 443;
export const TRIAL_DAYS = 0;
