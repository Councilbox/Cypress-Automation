export const isLandscape = () => {
    const { orientation } = window.screen;

    if(orientation){
        if(orientation.type.includes('portrait')){
            return false;
        } else {
            return true;
        }
    } else {
        if (window.innerWidth < window.innerHeight) {
            return false;
        } else {
            return true;
        }
    }
}