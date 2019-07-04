import ReactGa from 'react-ga';
import { store } from '../containers/App';
export const init = () => {
    ReactGa.initialize(process.env.REACT_APP_GTAG_ID);
}

const filteredEmails = /councilbox|cocodin/;

export const sendGAevent = args => {
    const state = store.getState();
    if(state.user && state.user.email){
        const { email } = state.user;
        if(filteredEmails.test(email)){
            return;
        }
    }
    ReactGa.event(args);
}