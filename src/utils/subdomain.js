import { store } from "../containers/App";
import { SERVER_URL } from "../config";

export const getCustomLogo = () => {
    const state = store.getState();

    if(state.subdomain.logo){
        return `${SERVER_URL}${state.subdomain.logo}`;
    }
    return null;
}

export const getCustomIcon = () => {
    const state = store.getState();

    if(state.subdomain.icon){
        return `${SERVER_URL}${state.subdomain.icon}`;
    }
    return null;
}

export const getCustomBackground = () => {
    const state = store.getState();

    if(state.subdomain.background){
        return `${SERVER_URL}${state.subdomain.background}`;
    }
    return null;
}

export const getCustomRoomBackground = () => {
    const state = store.getState();

    if(state.subdomain.roomBackground){
        return `${SERVER_URL}${state.subdomain.roomBackground}`;
    }
    return null;
}

export const useSubdomain = () => {
    const state = store.getState();

    return state.subdomain;
}

export const shouldLoadSubdomain = () => {
    const validSubdomains = {
        'app': true,
        'localhost': true,
        'app-pre': true,
        '172': true
    }
    const subdomain = window.location.hostname.split('.')[0];
    return validSubdomains[subdomain]? false : true;
}