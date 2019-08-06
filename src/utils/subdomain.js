import { store } from "../containers/App";
import { SERVER_URL } from "../config";

export const getCustomLogo = () => {
    return `${SERVER_URL}${store.getState().subdomain.logo}`;
}

export const getCustomIcon = () => {
    return `${SERVER_URL}${store.getState().subdomain.icon}`;
}

export const shouldLoadSubdomain = () => {
    const validSubdomains = {
        'app': true,
        'localhost': true,
        'app-pre': true
    }
    const subdomain = window.location.hostname.split('.')[0];
    return validSubdomains[subdomain]? false : true;
}