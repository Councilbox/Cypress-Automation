import { store } from "../containers/App";
import { variant } from "../config";

export const lightGrey = "#F5F5F5";
export const mediumGrey = "#505050";
export const darkGrey = "#3B3B3B";
export const font = "Lato";
export const turquoise = "#61ABB7";
//55bdce
export const lightTurquoise = "#e7f2f4";
export const green = "#84CE5A";
export const red = "#FF3232";
//#ffcc33 #847248
export const primary = "#7D2180";
export const secondary = turquoise;

export const getPrimary = () => {
	let actual = document.documentElement.style.getPropertyValue('--primary') || primary;
	return actual;
};

export const getSecondary = () => {
	let actual = document.documentElement.style.getPropertyValue('--secondary') || secondary;
	return actual;
};
export const getLightGrey = () => {
	return lightGrey;
};
