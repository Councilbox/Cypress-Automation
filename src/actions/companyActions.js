
import { client, store } from '../containers/App';
import { buildTranslationsProxy, loadingFinished } from './mainActions';
import { companies as companiesQuery, setCompanyAsSelected } from '../queries';

export const saveSignUpInfo = info => ({
	type: 'SIGN_UP_INFO',
	value: info
});

export const getCompanies = userId => async dispatch => {
	if (userId) {
		const response = await client.query({
			query: companiesQuery,
			variables: { userId },
			fetchPolicy: 'network-only'
		});
		const selectedCompany = response.data.userCompanies.findIndex(element => element.actived === 1);
		if (response.data.userCompanies.length === 0) {
			dispatch({
				type: 'NO_COMPANIES'
			});
		} else {
			dispatch({
				type: 'COMPANIES',
				value: response.data.userCompanies.map(item => ({ ...item.company })),
				selected: selectedCompany !== -1 ? selectedCompany : 0
			});
		}
		dispatch(loadingFinished());
	}
};

export const setCompany = company => {
	const index = store.getState().companies.selected;
	const companies = [...store.getState().companies.list];
	companies[index] = company;
	return {
		type: 'COMPANIES',
		value: companies,
		selected: index
	};
};

const getSpecificTranslations = (language, company) => {
	const { type, id } = company;

	const specificTranslations = {
		society: {},
		10: {
			censuses: 'Propietarios',
			entity_name: 'Propiedad',
			present_vote: 'Presentes',
			remote_vote: 'Remotos',
			votes: 'Coeficiente',
			votes_in_favor_for_approve: 'Coeficiente necesario',
			total_votes: 'Coeficiente total'
		}
	};

	const idTranslations = {
		658: {
			es: {
				delegated_in: 'Representado por',
				delegates: 'Representado por',
				representations_delegations: 'Representaciones',
				selectedCompany: 658,
			}
		},
		1203: {
			es: {
				abstention: 'En blanco',
				abstention_btn: 'En blanco',
				abstention_capital_letters: 'EN BLANCO',
				abstention_lowercase: 'En blanco',
				abstentions: 'EN BLANCO',
				selectedCompany: 1203,
				num_abstention: 'Nº de personas en blanco'
			},
			cat: {
				abstention: 'En blanc',
				abstention_btn: 'En blanc',
				abstention_capital_letters: 'EN BLANC',
				abstention_lowercase: 'En blanc',
				abstentions: 'EN BLANCO',
				selectedCompany: 1203,
				num_abstention: 'Núm. de persones en blanc'
			}
		},
		1311: {
			es: {
				abstention: 'En blanco',
				abstention_btn: 'En blanco',
				abstention_capital_letters: 'EN BLANCO',
				abstention_lowercase: 'En blanco',
				abstentions: 'EN BLANCO',
				selectedCompany: 1311,
				num_abstention: 'Nº de personas en blanco'
			},
			cat: {
				abstention: 'En blanc',
				abstention_btn: 'En blanc',
				abstention_capital_letters: 'EN BLANC',
				abstention_lowercase: 'En blanc',
				abstentions: 'EN BLANCO',
				selectedCompany: 1311,
				num_abstention: 'Núm. de persones en blanc'
			}
		},
		546: {
			es: {
				dont_vote: 'En blanco',
				no_vote_lowercase: 'En blanco',
				they_didnt_vote: 'En blanco',
				no_vote: 'EN BLANCO',
				selectedCompany: 666,
				num_no_vote: 'Nº de personas en blanco'
			},
			cat: {
				dont_vote: 'En blanc',
				no_vote_lowercase: 'En blanc',
				they_didnt_vote: 'En blanc',
				no_vote: 'EN BLANCO',
				selectedCompany: 666,
				num_no_vote: 'Núm. de persones en blanc'
			},
			gal: {
				dont_vote: 'En branco',
				no_vote_lowercase: 'En branco',
				they_didnt_vote: 'En branco',
				no_vote: 'EN BRANCO',
				selectedCompany: 666,
				num_no_vote: 'Nº de persoas en branco'
			},
			en: {
				dont_vote: 'Blank',
				no_vote_lowercase: 'Blank',
				no_vote: 'BLANK',
				selectedCompany: 666,
				they_didnt_vote: 'Blank',
				num_no_vote: 'Number of blank votes'
			}
		}
	};

	const extraTranslations = {
		selectedCompany: null,
		...(specificTranslations[type] ? specificTranslations[type] : specificTranslations.society),
		...(idTranslations[id] ? idTranslations[id][language] : {})
	};

	return extraTranslations;
};

export const addSpecificTranslations = company => {
	const initialTranslations = store.getState().translate;
	const specificTranslations = getSpecificTranslations(initialTranslations.selectedLanguage, company);

	return {
		type: 'LOADED_LANG',
		value: buildTranslationsProxy({
			...initialTranslations,
			...specificTranslations
		}),
	};
};

export const changeCompany = (index, id) => async dispatch => {
	const companies = [...store.getState().companies.list];
	await client.mutate({
		mutation: setCompanyAsSelected,
		variables: {
			userId: store.getState().user.id,
			companyId: id || companies[index].id
		}
	});
	dispatch({
		type: 'CHANGE_SELECTED',
		value: index
	});
};
