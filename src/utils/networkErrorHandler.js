import { noServerResponse, serverRestored } from "../actions/mainActions";
import { sendGraphQLError } from '../queries';
import { CLIENT_VERSION } from '../config';

export const networkErrorHandler = async (networkError, toast, store, apolloClient, operation) => {
    if(!networkError){
        if(!store.getState().main.serverStatus){
            store.dispatch(serverRestored());
        }
    }else{
        if(networkError.message === 'Failed to fetch'){
            console.log('Dispatching server error');
            store.dispatch(noServerResponse());
        }

        if(networkError.statusCode === 400){
            let companies = store.getState().companies;
            let user = store.getState().user;
            console.log(operation);
            await apolloClient.mutate({
                mutation: sendGraphQLError,
                variables: {
                    error: {
                        error: networkError.result.errors[0].stack,
                        operation: JSON.stringify(operation),
                        additionalInfo: `Client version: ${
                            CLIENT_VERSION
                        }, userId: ${
                           !!user.id? user.id : undefined
                        }, companyId: ${
                            companies.list.length > 0 ? companies.list[companies.selected].id : undefined
                        }`
                    }
                }
            });
        }
    }
};