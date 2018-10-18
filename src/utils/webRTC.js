import { COUNCIL_TYPES, PARTICIPANT_STATES } from '../constants';
export const COMPATIBLE = "COMPATIBLE";
export const UNSUPORTED_WINDOWS_VERSION = "UNSUPORTED_WINDOWS_VERSION";
export const iOS_DEVICE = "iOS_DEVICE";
export const NOT_COMPATIBLE_BROWSER = "NOT_COMPATIBLE_BROWSER";

export const checkIsUnsupportedWindowsVersion = detectRTC => {
	let isUnsupportedWindowsVersion = false;

	if (
		detectRTC.osName.indexOf("Windows") !== -1 &&
		(detectRTC.osVersion.indexOf("Vista") !== -1 ||
			detectRTC.osVersion.indexOf("XP") !== -1)
	) {
		isUnsupportedWindowsVersion = true;
	}

	return isUnsupportedWindowsVersion;
};

export const checkIsWebRTCCompatibleBrowser = detectRTC => {
	let isCompatible =
		detectRTC.isWebRTCSupported &&
		(detectRTC.browser.isChrome || detectRTC.browser.isFirefox)
			? true
			: false;
	return isCompatible;
};

export const checkIsiOSDevice = detectRTC => {
	const isiOSDevice =
		detectRTC.isMobileDevice && detectRTC.osName === "iOS" ? true : false;
	return isiOSDevice;
};

export const checkIsMobileDevice = detectRTC => {
	const isMobileDevice = detectRTC.isMobileDevice ? true : false;
	return isMobileDevice;
};

export const checkIsCompatible = (detectRTC, council, participant) => {

	console.log(participant);

 	if(council.councilType === COUNCIL_TYPES.NO_VIDEO){
		return COMPATIBLE;
	}
	if(participant.state === PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE){
		return COMPATIBLE;
	}
	let isCompatible = NOT_COMPATIBLE_BROWSER;
	let isUnsupportedWindowsVersion = checkIsUnsupportedWindowsVersion(
		detectRTC
	);
	let isiOSDevice = checkIsiOSDevice(detectRTC);
	let isWebRTCCompatibleBrowser = checkIsWebRTCCompatibleBrowser(detectRTC);

	if (detectRTC.osName === "Windows") {
		if (isUnsupportedWindowsVersion) {
			isCompatible = UNSUPORTED_WINDOWS_VERSION;
			return isCompatible;
		}
	}

	if (isiOSDevice) {
		return iOS_DEVICE;
	}

	if (isWebRTCCompatibleBrowser) {
		return COMPATIBLE;;
	} else {
		return isCompatible;
	}
};
