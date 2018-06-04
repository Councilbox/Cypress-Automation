import React from "react";
import { Button } from "material-ui";
import { BasicButton } from '../../displayComponents';
import moment from "moment";
import FontAwesome from "react-fontawesome";
import withTranslations from "../../HOCs/withTranslations";
import withWindowSize from "../../HOCs/withWindowSize";
import withWindowOrientation from "../../HOCs/withWindowOrientation";
import { primary, secondary } from "../../styles/colors";
import { iOS_DEVICE, NOT_COMPATIBLE_BROWSER, UNSUPORTED_WINDOWS_VERSION } from '../../utils/webRTC';
import notCompatibleBrowserIcon from '../../assets/img/not_compatible_device.svg';
import notCompatiblePhoneIcon from '../../assets/img/no-compatible-phone.svg';

const styles = {
	container: {
		width: "100%",
		height: "100%",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		position: "relative"
	},
	splittedContainer: {
		width: "100%",
		height: "100%",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		position: "relative"
	},
	textContainer: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		padding: "15px",
		paddingBottom: '0px',
		textAlign: "center"
	},
	imageContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		padding: "15px",
		width: "100%"
	}
};

class ErrorState extends React.Component {
	handleNotCompatible = status => {
		const { translate, windowSize, windowOrientation } = this.props;
		switch (status) {
			case UNSUPORTED_WINDOWS_VERSION:
				return <UnsuportedWindowsVersion translate={translate} windowSize={windowSize} windowOrientation={windowOrientation} />;

			case iOS_DEVICE:
				return <IOSDevice translate={translate} windowSize={windowSize} windowOrientation={windowOrientation} />;

			case NOT_COMPATIBLE_BROWSER:
				return <NotCompatibleBrowser translate={translate} windowSize={windowSize} windowOrientation={windowOrientation} />;
		}
	};

	render() {
		const {
			translate,
			status,
			data,
			windowSize,
			windowOrientation
		} = this.props;

		return (
			<div
				style={
					windowSize === "xs" &&
						windowOrientation === "portrait"
						? styles.container
						: styles.splittedContainer
				}
			>
				{this.handleNotCompatible(status)}
			</div>
		);
	}
}

class UnsuportedWindowsVersion extends React.Component {
	render() {
		const { translate, windowSize, windowOrientation } = this.props;
		return (
			<React.Fragment>
				<div
					style={{
						...styles.textContainer,
						...(windowSize === "xs" &&
							windowOrientation === "portrait"
							? { maxWidth: "100%" }
							: { maxWidth: "50%", minWidth: "50%" })
					}}
				>
					<h5 style={{ color: primary, fontWeight: "bold" }}>
						{translate.we_are_sorry}
					</h5>

					<h6 style={{fontWeight: 'bold'}}>{translate.unsupported_windows_version}</h6>

					<p>
						{translate.unsupported_windows_version_msg}
					</p>
				</div>

				<div style={styles.imageContainer}>
					<img src={notCompatibleBrowserIcon} />
				</div>
			</React.Fragment>
		);
	}
}

class IOSDevice extends React.Component {
	render() {
		const protocol = window.location.protocol;
		const appLink = (window.location.href).replace(protocol, 'cbxapp:');
		console.log(appLink);
		const { translate, windowSize, windowOrientation } = this.props;
		return (
			<React.Fragment>
				{(windowSize === "xs" && windowOrientation === "landscape") ?
						<React.Fragment>
							<div
								style={{
									...styles.textContainer,
									...{ maxWidth: "100%" }
								}}
							>
								<h5 style={{ color: primary, fontWeight: "bold" }}>
									{translate.we_are_sorry}
								</h5>

								<h6 style={{fontWeight: 'bold'}}>{translate.app_required}</h6>

								<p>
									{translate.app_required_msg}
								</p>

								<div style={{marginBottom: '20px'}}>
									<a 
										href="https://itunes.apple.com/es/app/councilbox/id1338823032?mt=8" 
										style={{
											display:'inline-block', 
											overflow:'hidden',
											background: 'url(https://linkmaker.itunes.apple.com/assets/shared/badges/es-es/appstore-lrg.svg) no-repeat',
											width: '135px',
											height: '40px',
											backgroundSize: 'contain'
										}}
									>
									</a>
								</div>
							</div>

							{window.location.href.includes('login') &&
								<div
									style={{
										...styles.textContainer,
										...{ maxWidth: "100%" }
									}}
								>
									<p>
										{translate.universal_link_msg}
									</p>

									<div>
										<a href={appLink}>
											<BasicButton
												color={primary}
												textStyle={{
													color: 'white',
													fontWeight: "700",
													fontSize: "0.9em",
													textTransform: "none"
												}}
												text={translate.open_in_app}
												textPosition="after"
												icon={<i className="fa fa-external-link" aria-hidden="true" style={{marginLeft: '5px'}}></i>}
											/>
										</a>
									</div>
								</div>
							}
						</React.Fragment>
					:
						<React.Fragment>
							<div
								style={styles.textContainer}
							>
								<h5 style={{ color: primary, fontWeight: "bold" }}>
									{translate.we_are_sorry}
								</h5>

								<h6 style={{fontWeight: 'bold'}}>{translate.app_required}</h6>

								<p>
									{translate.app_required_msg}
								</p>

								<div style={{marginBottom: '20px'}}>
									<a 
										href="https://itunes.apple.com/es/app/councilbox/id1338823032?mt=8" 
										style={{
											display:'inline-block', 
											overflow:'hidden',
											background: 'url(https://linkmaker.itunes.apple.com/assets/shared/badges/es-es/appstore-lrg.svg) no-repeat',
											width: '135px',
											height: '40px',
											backgroundSize: 'contain'
										}}
									>
									</a>
								</div>

								{window.location.href.includes('login') &&
									<div>
										<p>
											{translate.universal_link_msg}
										</p>

										<div>
											<a href={appLink}>
												<BasicButton
													color={primary}
													textStyle={{
														color: 'white',
														fontWeight: "700",
														fontSize: "0.9em",
														textTransform: "none"
													}}
													text={translate.open_in_app}
													textPosition="after"
													icon={<i className="fa fa-external-link" aria-hidden="true" style={{marginLeft: '5px'}}></i>}
												/>
											</a>
										</div>
									</div>
								}
							</div>

							<div style={styles.imageContainer}>
								<img src={notCompatiblePhoneIcon} />
							</div>
						</React.Fragment>
				}
			</React.Fragment>
		);
	}
}

class NotCompatibleBrowser extends React.Component {
	render() {
		const { translate, windowSize, windowOrientation } = this.props;
		return (
			<React.Fragment>
				<div
					style={{
						...styles.textContainer,
						...(windowSize === "xs" &&
							windowOrientation === "portrait"
							? { maxWidth: "100%" }
							: { maxWidth: "50%", minWidth: "50%" })
					}}
				>
					<h5 style={{ color: primary, fontWeight: "bold" }}>
						{translate.we_are_sorry}
					</h5>

					<h6 style={{fontWeight: 'bold'}}>{translate.unsupported_browser}</h6>

					<p>
						{translate.incompatible_browser_msg_clean}
					</p>

					<a href="https://www.google.com.mx/chrome/browser/desktop/?brand=CHBD&gclid=Cj0KCQjw09zOBRCqARIsAH8XF1YGCu-kSPzW6nLfK0qUZQBvhiX_3hAluYZEw0wDtzrfzdej17_xkREaArJPEALw_wcB" target="_blank">
						<BasicButton
							color={secondary}
							textStyle={{
								color: 'white',
								fontWeight: "700",
								fontSize: "0.9em",
								textTransform: "none"
							}}
							text={translate.download}
							textPosition="after"
							icon={<i className="fa fa-chrome" aria-hidden="true" style={{marginLeft: '5px'}}></i>}
						/>
					</a>
				</div>

				<div style={styles.imageContainer}>
					<img src={notCompatibleBrowserIcon}/>
				</div>
			</React.Fragment>
		);
	}
}

export default withTranslations()(
	withWindowOrientation(withWindowSize(ErrorState))
);
