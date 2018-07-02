const LOCATION_URL =
	process.env.REACT_APP_MODE === "dev"
		? "http://localhost:5000/graphql"
		: "https://apicbx.councilbox.com/graphql";

export const API_URL = LOCATION_URL;

// POINT CLIENT TO VPS SERVER
//const LOCATION_URL = process.env.REACT_APP_MODE === 'dev'? 'localhost:5000/graphql' : 'apicbx.councilbox.com';

//export const API_URL = `https://${LOCATION_URL}`;
