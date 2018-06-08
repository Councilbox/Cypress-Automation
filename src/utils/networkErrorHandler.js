import { noServerResponse, serverRestored } from "../actions/mainActions";


export const networkErrorHandler = (networkError, toast, store) => {
    if(!networkError){
        if(!store.getState().main.serverStatus){
            store.dispatch(serverRestored());
        }
    }else{
        if(networkError.message === 'Failed to fetch'){
            console.log('Dispatching server error');
            store.dispatch(noServerResponse());
        }
    }
};