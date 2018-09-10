import { printCifAlreadyUsed, printSessionExpiredError } from "./CBX";
import { logout } from "../actions/mainActions";
import { refreshTokenQuery } from '../queries';
import { LiveToast } from '../displayComponents';
import React from 'react';

export const refreshToken = async (apolloClient, toast, store) => {
	const rToken = sessionStorage.getItem('refreshToken');
	if(rToken){
		const response = await apolloClient.mutate({
			mutation: refreshTokenQuery,
			variables: {
				token: rToken
			}
		});
		if(!response.errors){
			sessionStorage.setItem('token', response.data.refreshToken.token);
			sessionStorage.setItem('refreshToken', response.data.refreshToken.refreshToken);
			return response;
		}
	}

	toast(
		<LiveToast
			message={printSessionExpiredError()}
		/>, {
			position: toast.POSITION.TOP_RIGHT,
			autoClose: true,			
			className: "errorToast"
		}
	);
	store.dispatch(logout());

}


export const graphQLErrorHandler = async (graphQLError, toast, store, apolloClient, operation) => {
	if (graphQLError.message === "Validation error") {
		if (graphQLError.originalError) {
			if (graphQLError.originalError.fields) {
				if (graphQLError.originalError.fields.tin) {
					toast(
						<LiveToast
							message={printCifAlreadyUsed()}
						/>, {
							position: toast.POSITION.TOP_RIGHT,
							autoClose: true,			
							className: "errorToast"
						}
					);
				}
			}
		}
	}
};
