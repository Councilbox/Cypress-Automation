import { isMobile as mobile } from "react-device-detect";
const isIOS = (navigator.userAgent.match(/(iPad)/)) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) //esto es si es ipad v13 -> devuelve true 


export const isLandscape = () => {
    let { orientation } = window.screen;

    if(orientation){
        if(orientation.type.includes('portrait')){
            return false;
        } else {
            return true;
        }
    }

    return Math.abs(window.orientation) === 90? true : false;
}

export const isMobile = mobile || isIOS;