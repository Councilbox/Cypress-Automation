import { COUNCIL_TYPES, PARTICIPANT_STATES } from '../constants';

export const COMPATIBLE = 'COMPATIBLE';
export const UNSUPORTED_WINDOWS_VERSION = 'UNSUPORTED_WINDOWS_VERSION';
export const IOS_DEVICE = 'IOS_DEVICE';
export const NOT_COMPATIBLE_BROWSER = 'NOT_COMPATIBLE_BROWSER';

export const checkIsUnsupportedWindowsVersion = detectRTC => {
	let isUnsupportedWindowsVersion = false;

	if (
		detectRTC.osName.indexOf('Windows') !== -1
		&& (detectRTC.osVersion.indexOf('Vista') !== -1
			|| detectRTC.osVersion.indexOf('XP') !== -1)
	) {
		isUnsupportedWindowsVersion = true;
	}

	return isUnsupportedWindowsVersion;
};

export const checkIsWebRTCCompatibleBrowser = detectRTC => detectRTC.isWebRTCSupported && (detectRTC.browser.isChrome || detectRTC.browser.isFirefox);

export const checkIsiOSDevice = detectRTC => detectRTC.isMobileDevice && detectRTC.osName === 'iOS';

export const checkIsMobileDevice = detectRTC => detectRTC.isMobileDevice;

export const checkIsCompatible = (detectRTC, council, participant) => {
	if (council.councilType === COUNCIL_TYPES.NO_VIDEO) {
		return COMPATIBLE;
	}
	if (participant.state === PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE) {
		return COMPATIBLE;
	}
	const isCompatible = NOT_COMPATIBLE_BROWSER;
	const isUnsupportedWindowsVersion = checkIsUnsupportedWindowsVersion(detectRTC);
	const isiOSDevice = checkIsiOSDevice(detectRTC);
	const isWebRTCCompatibleBrowser = checkIsWebRTCCompatibleBrowser(detectRTC);

	if (detectRTC.osName === 'Windows') {
		if (isUnsupportedWindowsVersion) {
			return UNSUPORTED_WINDOWS_VERSION;
		}
	}

	if (isiOSDevice) {
		return IOS_DEVICE;
	}

	if (isWebRTCCompatibleBrowser) {
		return COMPATIBLE;
	}

	return isCompatible;
};
