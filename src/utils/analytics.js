import ReactGa from 'react-ga';

export const init = () => {
    ReactGa.initialize(process.env.REACT_APP_GTAG_ID);
}

export const sendGAevent = args => {
    ReactGa.event(args);
}