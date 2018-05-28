import { printCifAlreadyUsed, printSessionExpiredError } from "./CBX";
import { logout } from "../actions/mainActions";

export const graphQLErrorHandler = (graphQLErrors, toast, store) => {
	if (graphQLErrors[0].code === 440) {
		toast.error(printSessionExpiredError());
		store.dispatch(logout());
	}

	if (graphQLErrors[0].message === "Validation error") {
		if (graphQLErrors[0].originalError) {
			if (graphQLErrors[0].originalError.fields) {
				if (graphQLErrors[0].originalError.fields.tin) {
					toast.error(printCifAlreadyUsed());
				}
			}
		}
	}
};
