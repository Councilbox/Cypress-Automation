import { getCompanies } from "./companyActions";
import { client } from "../containers/App";
import { getMe, getTranslations } from "../queries";
import moment from "moment";
import DetectRTC from "detectrtc";

export let language = "es";

export const loginSuccess = token => {
	return dispatch => {
		sessionStorage.setItem("token", token);
		dispatch(initUserData());
		dispatch(getCompanies());
		dispatch({ type: "LOGIN_SUCCESS" });
	};
};

export const loadingFinished = () => ({ type: "LOADING_FINISHED" });

export const initUserData = () => {
	return async dispatch => {
		const response = await client.query({
			query: getMe,
			errorPolicy: "all"
		});
		if (!response.errors) {
			if (response.data.me) {
				dispatch({
					type: "SET_USER_DATA",
					value: response.data.me
				});
				dispatch(getCompanies(response.data.me.id));
				dispatch(setLanguage(response.data.me.preferred_language));
			}
		} else {
			response.errors[0].code === 440 &&
				sessionStorage.removeItem("token");
		}
	};
};

export const setUserData = user => {
	return dispatch => {
		resetStore();
		dispatch({
			type: "SET_USER_DATA",
			value: user
		});
		dispatch(setLanguage(user.preferred_language));
	};
};

const resetStore = () => {
	client.resetStore();
};

export const noServerResponse = () => {
	return { type: 'NO_SERVER_RESPONSE' };
}

export const serverRestored = () => {
	return { type: 'SERVER_RESTORED' };
}

export const logout = () => {
	sessionStorage.clear();
	return { type: "LOGOUT" };
};

export const setLanguage = language => {
	return async dispatch => {
		const response = await client.query({
			query: getTranslations,
			variables: { language: language }
		});
		const translationObject = {};
		response.data.translations.forEach(translation => {
			translationObject[translation.label] = translation.text;
		});
		let locale = language;
		if (language === "cat" || language === "gal") {
			locale = "es";
		}
		moment.locale(locale, {
			months: translationObject.datepicker_months.split(","),
			monthsShort: translationObject.datepicker_months
				.split(",")
				.map(month => month.substring(0, 3))
		});
		dispatch({
			type: "LOADED_LANG",
			value: translationObject,
			selected: language
		});
	};
};

export const setDetectRTC = () => {
	return  dispatch => {
		DetectRTC.load(() => {
			dispatch({
				type: "LOADED_DETECTRTC",
				detectRTC: DetectRTC
			});
		});
	};
};
