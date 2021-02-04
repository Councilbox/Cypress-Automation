import { isMobile as mobile } from "react-device-detect";

const isIOS = (navigator.userAgent.match(/(iPad)/)) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export const isLandscape = () => {
    const { orientation } = window.screen;

    if(orientation){
        if(orientation.type.includes('portrait')){
            return false;
        }

        return true;
    }

    return Math.abs(window.orientation) === 90;
}

export const isMobile = mobile || isIOS;
