const LOCATION_URL =
	process.env.REACT_APP_MODE === "dev"
		? "localhost:5000/graphql"
		: "apicbx.councilbox.com";

export const API_URL = `${process.env.REACT_APP_MODE === "dev" ? window.location.protocol : 'https:'}//${LOCATION_URL}`;