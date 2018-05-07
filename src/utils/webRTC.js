export const checkIsUnsupportedWindowsVersion = (detectRTC) =>{
    let isUnsupportedWindowsVersion = false;

    if(((detectRTC.osName).indexOf('Windows') !== -1) && (((detectRTC.osVersion).indexOf('Vista') !== -1) || ((detectRTC.osVersion).indexOf('XP') !== -1))){
        isUnsupportedWindowsVersion = true;
    }

    return isUnsupportedWindowsVersion;
};

export const checkIsWebRTCCompatibleBrowser = (detectRTC) => {
    let isCompatible =  (
                            (detectRTC.isWebRTCSupported && (detectRTC.browser.isChrome || detectRTC.browser.isFirefox) && detectRTC.osName !== 'iOS') ? 
                                true 
                            : 
                                false
                        );
    return isCompatible;
};

export const checkIsCompatibleBrowser = (detectRTC) => {
    let isCompatible = false;
    let isUnsupportedWindowsVersion = checkIsUnsupportedWindowsVersion(detectRTC);
    let isWebRTCCompatibleBrowser = checkIsWebRTCCompatibleBrowser(detectRTC);

    if(detectRTC.osName === "Windows"){
        if(isUnsupportedWindowsVersion) {
            isCompatible = false;
            return isCompatible;
        }
    }

    if(isWebRTCCompatibleBrowser) {
        isCompatible = true;
        return isCompatible;
    }
    
    if(!isWebRTCCompatibleBrowser) {
        isCompatible = false;
        return isCompatible;
    }
};

export const checkIsiOSDevice = (detectRTC) => {
    const isiOSDevice = (detectRTC.isMobileDevice && detectRTC.osName == 'iOS')? true : false;
    return isiOSDevice;
};

export const checkIsMobileDevice = (detectRTC) => {
    const isMobileDevice = (detectRTC.isMobileDevice)? true : false;
    return isMobileDevice;
};