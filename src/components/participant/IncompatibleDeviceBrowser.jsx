import React from 'react';
import { BasicButton } from '../../displayComponents';
import withTranslations from '../../HOCs/withTranslations';
import withWindowSize from '../../HOCs/withWindowSize';
import withWindowOrientation from '../../HOCs/withWindowOrientation';
import { primary, secondary } from '../../styles/colors';
import { IOS_DEVICE, NOT_COMPATIBLE_BROWSER, UNSUPORTED_WINDOWS_VERSION } from '../../utils/webRTC';
import notCompatibleBrowserIcon from '../../assets/img/not_compatible_device.svg';
import notCompatiblePhoneIcon from '../../assets/img/no-compatible-phone.svg';

const styles = {
	container: {
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative'
	},
	splittedContainer: {
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative'
	},
	textContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '15px',
		paddingBottom: '0px',
		textAlign: 'center'
	},
	imageContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: '12em',
		padding: '15px',
		width: '100%'
	}
};

class ErrorState extends React.Component {
handleNotCompatible = status => {
	const { translate, windowSize, windowOrientation } = this.props;
	switch (status) {
	case UNSUPORTED_WINDOWS_VERSION:
		return <UnsuportedWindowsVersion translate={translate} windowSize={windowSize} windowOrientation={windowOrientation} />;

	case IOS_DEVICE:
		return <IOSDevice translate={translate} windowSize={windowSize} windowOrientation={windowOrientation} />;

	case NOT_COMPATIBLE_BROWSER:
		return <NotCompatibleBrowser translate={translate} windowSize={windowSize} windowOrientation={windowOrientation} />;
	default:
		return <div />;
	}
};

render() {
	const {
		status,
		windowSize,
		windowOrientation
	} = this.props;

	return (
		<div
			style={
				windowSize === 'xs'
&& windowOrientation === 'portrait' ?
					styles.container
					: styles.splittedContainer
			}
		>
			{this.handleNotCompatible(status)}
		</div>
	);
}
}

const UnsuportedWindowsVersion = ({ translate, windowSize, windowOrientation }) => (
	<React.Fragment>
		<div
			style={{
				...styles.textContainer,
				...(windowSize === 'xs'
&& windowOrientation === 'portrait' ?
					{ maxWidth: '100%' }
					: { maxWidth: '50%', minWidth: '50%' })
			}}
		>
			<h5 style={{ color: primary, fontWeight: 'bold' }}>
				{translate.we_are_sorry}
			</h5>

			<h6 style={{ fontWeight: 'bold' }}>{translate.unsupported_windows_version}</h6>

			<p>
				{translate.unsupported_windows_version_msg}
			</p>
		</div>

		<div style={styles.imageContainer}>
			<img src={notCompatibleBrowserIcon} alt={translate.unsupported_browser} style={{ width: '8em', height: 'auto' }} />
		</div>
	</React.Fragment>
);


const IOSDevice = ({ translate, windowSize, windowOrientation }) => (
	<React.Fragment>
		{(windowSize === 'xs' && windowOrientation === 'landscape') ?
			<React.Fragment>
				<div
					style={{
						...styles.textContainer,
						...{ maxWidth: '100%' }
					}}
				>
					<h5 style={{ color: primary, fontWeight: 'bold' }}>
						{translate.we_are_sorry}
					</h5>

					<h6>
						{translate.unsupported_device}
					</h6>
				</div>

			</React.Fragment>
			:				<React.Fragment>
				<div
					style={styles.textContainer}
				>
					<h5 style={{ color: primary, fontWeight: 'bold' }}>
						{translate.we_are_sorry}
					</h5>

					<h6>
						{translate.unsupported_device}
					</h6>
				</div>

				<div style={styles.imageContainer}>
					<img src={notCompatiblePhoneIcon} alt={translate.unsupported_device} style={{ width: '8em', height: 'auto' }} />
				</div>
			</React.Fragment>
		}
	</React.Fragment>
);

const NotCompatibleBrowser = ({ translate, windowSize, windowOrientation }) => (
	<React.Fragment>
		<div
			style={{
				...styles.textContainer,
				...((windowSize === 'xs' && windowOrientation === 'portrait') ?
					{ maxWidth: '100%' }
					: { maxWidth: '50%', minWidth: '50%' })
			}}
		>
			<h5 style={{ color: primary, fontWeight: 'bold' }}>
				{translate.we_are_sorry}
			</h5>

			<h6 style={{ fontWeight: 'bold' }}>{translate.unsupported_browser}</h6>

			<p>
				{translate.incompatible_browser_msg_clean}
			</p>

			<a href="https://www.google.com.mx/chrome/browser/desktop/?brand=CHBD&gclid=Cj0KCQjw09zOBRCqARIsAH8XF1YGCu-kSPzW6nLfK0qUZQBvhiX_3hAluYZEw0wDtzrfzdej17_xkREaArJPEALw_wcB" target="_blank" rel="noopener noreferrer">
				<BasicButton
					color={secondary}
					textStyle={{
						color: 'white',
						fontWeight: '700',
						fontSize: '0.9em',
						textTransform: 'none'
					}}
					text={translate.download}
					textPosition="after"
					icon={<i className="fa fa-chrome" aria-hidden="true" style={{ marginLeft: '5px' }}></i>}
				/>
			</a>
		</div>

		<div style={styles.imageContainer}>
			<img src={notCompatibleBrowserIcon} alt={translate.unsupported_browser} style={{ width: '8em', height: 'auto' }} />
		</div>
	</React.Fragment>
);

export default withTranslations()(
	withWindowOrientation(withWindowSize(ErrorState))
);
