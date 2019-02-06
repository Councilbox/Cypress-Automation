import { store } from "../containers/App";

export const lightGrey = "#F5F5F5";
export const mediumGrey = "#505050";
export const darkGrey = "#3B3B3B";
export const font = "Lato";
export const turquoise = "#49a6b5";
//55bdce
export const lightTurquoise = "#e7f2f4";
export const green = "#84CE5A";
export const red = "#FF3232";

export const primary = "#9C27B0";
export const secondary = turquoise;

export const getPrimary = () => {
	if (store) {
		const state = store.getState();
		if(state.companies.list.length > 0){
			const color = state.companies.list[state.companies.selected].primary;
			return color ? color : primary;
		}
	}
	return primary;
};

export const getSecondary = () => {
	if (store) {
		const state = store.getState();
		if(state.companies.list.length > 0){
			const color = state.companies.list[state.companies.selected].secondary;
			return color ? color : secondary;
		}
	}
	return secondary;
};
export const getLightGrey = () => {
	return lightGrey;
};
