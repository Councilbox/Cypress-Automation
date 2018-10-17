import CouncilboxApi from "../api/CouncilboxApi";
import { client, store } from "../containers/App";
import { loadingFinished } from "./mainActions";
import { companies, setCompanyAsSelected } from "../queries";

export const saveSignUpInfo = info => {
	return {
		type: "SIGN_UP_INFO",
		value: info
	};
};

export const getCompanies = userId => {
	return async dispatch => {
		if (userId) {
			const response = await client.query({
				query: companies,
				variables: { userId: userId },
				fetchPolicy: "network-only"
			});
			let selectedCompany = response.data.userCompanies.findIndex(element =>
				element.actived === 1
			);
			if(response.data.userCompanies.length === 0){
				dispatch({
					type: 'NO_COMPANIES'
				});
			}else{
				dispatch({
					type: "COMPANIES",
					value: response.data.userCompanies.map(item => {
						return { ...item.company };
					}),
					selected: selectedCompany !== -1 ? selectedCompany : 0
				});
			}
			dispatch(loadingFinished());
		}
	};
};

export const setCompany = company => {
	const index = store.getState().companies.selected;
	const companies = [...store.getState().companies.list];
	companies[index] = company;
	return {
		type: "COMPANIES",
		value: companies,
		selected: index
	};
};

export const changeCompany = (index, id) => {
	return async dispatch => {
		const companies = [...store.getState().companies.list];
		await client.mutate({
			mutation: setCompanyAsSelected,
			variables: {
				userId: store.getState().user.id,
				companyId: !!id? id: companies[index].id
			}
		});
		dispatch({
			type: "CHANGE_SELECTED",
			value: index
		});
	};
};

export const getRecount = companyID => {
	return dispatch => {
		return CouncilboxApi.getRecount(companyID).then(response => {
			dispatch({
				type: "RECOUNTS",
				value: response
			});
		});
	};
};

export const getCouncils = info => {
	return dispatch => {
		return CouncilboxApi.getCouncils(info).then(response => {
			if (response) {
				dispatch({
					type: "DRAFTS",
					value: response
				});
			}
		});
	};
};