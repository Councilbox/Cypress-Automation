import DetectRTC from 'detectrtc';
import gql from 'graphql-tag';
import { getCompanies } from './companyActions';
import { client, bHistory, refreshWSLink, moment } from '../containers/App';
import { getMe, getTranslations } from '../queries';
import { initLogRocket } from '../utils/logRocket';

export const defaultLanguage = 'es';

export const buildTranslateObject = translations => {
	const translationObject = {};
	translations.forEach(translation => {
		translationObject[translation.label] = translation.text;
	});

	return translationObject;
};

export const setLanguage = language => async dispatch => {
	const response = await client.query({
		query: getTranslations,
		variables: {
			language
		}
	});
	if (!response.errors) {
		const translationObject = buildTranslateObject(response.data.translations);
		let locale = language;
		if (language === 'cat' || language === 'gal') {
			locale = 'es';
		}
		moment.updateLocale(locale, {
			months: translationObject.datepicker_months.split(','),
			monthsShort: translationObject.datepicker_months
				.split(',')
				.map(month => month.substring(0, 3))
		});
		localStorage.setItem(language, JSON.stringify(translationObject));
		dispatch({
			type: 'LOADED_LANG',
			value: translationObject,
			selected: language
		});
	}
};

export const initUserData = () => async dispatch => {
	const response = await client.query({
		query: getMe,
		errorPolicy: 'all'
	});
	if (!response.errors) {
		if (response.data.me) {
			if (process.env.REACT_APP_LOGROCKET_ENABLED) {
				initLogRocket(response.data.me);
			}

			dispatch({
				type: 'SET_USER_DATA',
				value: response.data.me
			});
			dispatch(getCompanies(response.data.me.id));
			dispatch(setLanguage(response.data.me.preferredLanguage));
		}
	} else if (response.errors[0].code === 440) {
		sessionStorage.removeItem('token');
	}
};

export const loginSuccess = (token, refreshToken) => dispatch => {
		sessionStorage.setItem('token', token);
		sessionStorage.setItem('refreshToken', refreshToken);
		refreshWSLink();
		dispatch(initUserData());
		dispatch(getCompanies());
		dispatch({ type: 'LOGIN_SUCCESS' });
	};

export const setUnsavedChanges = value => (
	{ type: 'UNSAVED_CHANGES', value }
);

export const loadSubdomainConfig = () => {
	const subdomain = window.location.hostname.split('.')[0];
	return async dispatch => {
		const response = await client.query({
			query: gql`
				query SubdomainConfig($subdomain: String!) {
					subdomainConfig(subdomain: $subdomain){
						title
						primary
						styles
						secondary
						logo
						icon
						background
						roomBackground
						hideSignUp
					}
				}
			`,
			variables: {
				subdomain
			}
		});

		if (response.errors) {
			window.location.replace('https://app.councilbox.com');
		}

		const config = response.data.subdomainConfig;

		if (config.primary) {
			document.documentElement.style.setProperty('--primary', config.primary);
		}

		if (config.secondary) {
			document.documentElement.style.setProperty('--secondary', config.secondary);
		}

		if (config.title) {
			document.title = config.title;
		}

		dispatch({ type: 'LOAD_SUBDOMAIN_CONFIG',
			value: {
				...response.data.subdomainConfig,
				name: subdomain
			}
		});
	};
};

export const participantLoginSuccess = () => dispatch => {
		sessionStorage.setItem('participantLoginSuccess', true);
		dispatch({ type: 'PARTICIPANT_LOGIN_SUCCESS' });
	};

export const loadingFinished = () => ({ type: 'LOADING_FINISHED' });

export const setUserData = user => dispatch => {
		dispatch({
			type: 'SET_USER_DATA',
			value: user
		});
		dispatch(setLanguage(user.preferredLanguage));
	};

export const noServerResponse = () => ({ type: 'NO_SERVER_RESPONSE' });

export const serverRestored = () => ({ type: 'SERVER_RESTORED' });

export const logout = () => {
	sessionStorage.clear();
	return { type: 'LOGOUT' };
};

export const logoutParticipant = (participant, council) => {
	sessionStorage.removeItem('participantLoginSuccess');
	bHistory.push(`/participant/${participant.id}/council/${council.id}/login`);
	return { type: 'PARTICIPANT_LOGOUT' };
};

export const setDetectRTC = () => dispatch => {
	DetectRTC.load(() => {
		dispatch({
			type: 'LOADED_DETECTRTC',
			detectRTC: DetectRTC
		});
	});
};
