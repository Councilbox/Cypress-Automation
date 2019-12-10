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