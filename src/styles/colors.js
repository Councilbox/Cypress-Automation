import { store } from '../containers/App';

export const lightGrey = '#F5F5F5';
export const mediumGrey = '#505050';
export const darkGrey = '#3B3B3B';
export const font = 'Lato';
export const turquoise = '#61ABB7';
export const green = '#84CE5A';

export const primary = '#9C27B0';
export const secondary = turquoise;

export const getPrimary = () => {
    if(store) {
        const color = store.getState().companies.primary;
        return color? color : primary;
    }
    return primary;
};

export const getSecondary = () => {
    if(store) {
        const color = store.getState().companies.secondary;
        return color? color : secondary;
    }
    return secondary;
};