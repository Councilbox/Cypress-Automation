import ReactGa from 'react-ga';
import { store } from '../containers/App';
export const init = () => {
    if(checkShouldTrack()){
        //ReactGa.initialize(process.env.REACT_APP_GTAG_ID);
    }
}

const filteredEmails = /councilbox|cocodin/;

const checkShouldTrack = () => {
    return true;
    const state = store.getState();
    if(state.user && state.user.email){
        const { email } = state.user;
        if(filteredEmails.test(email)){
            return false;
        }
    }

    return true;
}

export const sendGAevent = args => {
    if(checkShouldTrack()){
        console.log(args);
        //ReactGa.event(args);
    }
}

export const pageView = () => {
    if(checkShouldTrack()){
        console.log(window.location.pathname.replace(/\d+\//g, '').replace(/\/\d+$/g, ''));
        //ReactGa.pageview(window.location.pathname.replace(/\d+\//g, '').replace(/\/\d+$/g, '') + window.location.search);
    }
}