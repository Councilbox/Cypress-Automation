import React from 'react';
import { Button, Grid } from 'material-ui';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import DetectRTC from 'detectrtc';
import { isAndroid, isIOS } from 'react-device-detect';
import FontAwesome from 'react-fontawesome';
import withTranslations from '../../../HOCs/withTranslations';
import { getPrimary, getSecondary } from '../../../styles/colors';
import * as CBX from '../../../utils/CBX';
import { AlertConfirm } from '../../../displayComponents';
import { useOldState } from '../../../hooks';
import { ConfigContext } from '../../../containers/AppControl';
import { isMobile } from '../../../utils/screen';
import { COUNCIL_STATES, COUNCIL_TYPES } from '../../../constants';


const RequestWordMenu = ({
	translate, participant, council, ...props
}) => {
	const [state, setState] = useOldState({
		alertCantRequestWord: false,
		safariModal: false,
		confirmWordModal: false,
	});
	const [canRequest, setCanRequest] = React.useState(false);
	const config = React.useContext(ConfigContext);

	React.useEffect(() => {
		let interval;
		if (CBX.isAskingForWord(participant)) {
			interval = setInterval(() => {
				props.refetchParticipant();
			}, 3000);
		}
		return () => clearInterval(interval);
	}, [participant.requestWord]);

	React.useEffect(() => {
		checkCanRequest();
	}, [DetectRTC, council.state]);

	const checkCanRequest = async () => {
		await updateRTC();

		if (!council.askWordMenu || council.state === COUNCIL_STATES.PAUSED) {
			return setCanRequest(false);
		}

		if (isIOS) {
			return setCanRequest(config.iOSWord);
		}

		if (isAndroid) {
			return setCanRequest(config.androidWord);
		}

		if (config.requestWordFirefox && DetectRTC.browser.name === 'Firefox') {
			return setCanRequest(true);
		}

		if (config.requestWordSafari && DetectRTC.browser.name === 'Safari') {
			return setCanRequest(true);
		}

		if (DetectRTC.browser.name !== 'Chrome' || (+DetectRTC.browser.version < 72)) {
			return setCanRequest(false);
		}

		setCanRequest(DetectRTC.audioInputDevices.length > 0);
	};

	const secondary = getSecondary();
	const primary = getPrimary();

	const askForWord = async () => {
		setState({
			loading: true
		});
		await props.changeRequestWord({
			variables: {
				participantId: participant.id,
				requestWord: 1,
			}
		});
		await props.refetchParticipant();
		setState({
			loading: false,
			confirmWordModal: false
		});
	};

	const updateRTC = () => new Promise(resolve => {
		DetectRTC.load(() => resolve());
	});

	const cancelAskForWord = async () => {
		await props.changeRequestWord({
			variables: {
				participantId: participant.id,
				requestWord: 0
			}
		});
		await props.refetchParticipant();
	};

	const showSafariAskingModal = () => {
		setState({
			safariModal: true
		});
	};

	const closeSafariModal = () => {
		setState({
			safariModal: false
		});
	};

	const closeWordModal = () => {
		setState({
			confirmWordModal: false
		});
	};

	const showConfirmWord = () => {
		setState({
			confirmWordModal: true
		});
	};

	const renderSafariAlertBody = () => {
		if (!council.askWordMenu) {
			return translate.cant_ask_word;
		}

		if (DetectRTC.audioInputDevices.length === 0) {
			return translate.no_audio_devices;
		}

		return translate.safari_word_ask_info;
	};

	const grantedWord = CBX.haveGrantedWord(participant);

	const renderWordButtonIconMobil = () => {
		const buttonAction = () => {
			if (council.state === COUNCIL_STATES.PAUSED) {
				return;
			}

			if (!canRequest) {
				return showSafariAskingModal();
			}

			return showConfirmWord();
		};

		const renderButton = () => {
			if (!CBX.canAskForWord(participant)) {
				return <span />;
			}

			if (grantedWord || CBX.isAskingForWord(participant)) {
				return (
					<Button
						className={'NoOutline'}
						disabled={council.councilType === COUNCIL_TYPES.ONE_ON_ONE}
						style={{
							width: '100%',
							height: '100%',
							minWidth: '0',
							padding: '0',
							margin: '0',
							fontSize: '10px',
							color: grantedWord ? 'grey' : secondary,
						}}
						onClick={cancelAskForWord}
					>
						<div style={{ display: 'unset' }}>
							<div style={{ position: 'relative' }}>
								{grantedWord ? (
									<i className="material-icons" style={{
										fontSize: '24px',
										padding: '0',
										margin: '0',
										width: '1em',
										height: '1em',
										overflow: 'hidden',
										userSelect: 'none',
										color: primary,
									}}>
										pan_tool
									</i>
								) :
									<React.Fragment>
										<FontAwesome
											name={'hourglass-start '}
											style={{
												top: '-6px',
												fontWeight: 'bold',
												right: '-10px',
												position: 'absolute',
												fontSize: '1rem',
												marginRight: '0.3em',
												color: primary
											}}
										/>
										<i className="material-icons" style={{
											fontSize: '24px',
											padding: '0',
											margin: '0',
											width: '1em',
											height: '1em',
											overflow: 'hidden',
											userSelect: 'none',
											color: primary,
										}}>
											pan_tool
										</i>
									</React.Fragment>
								}
							</div>
							<div style={{
								color: 'white',
								fontSize: '0.55rem',
								textTransform: 'none'
							}}>
								{translate.ask_word_short}
							</div>
						</div>
					</Button>
				);
			}

			return (
				<Button
					className={'NoOutline'}
					style={{
						width: '100%', height: '100%', minWidth: '0', padding: '0', margin: '0', fontSize: '10px'
					}}
					onClick={buttonAction}
				>
					<div style={{ display: 'unset' }}>
						<div style={{ position: 'relative' }}>
							{state.loading &&
								<FontAwesome
									name={'circle-o-notch fa-spin'}
									style={{
										top: '-8px',
										fontWeight: 'bold',
										right: '-10px',
										position: 'absolute',
										fontSize: '1rem',
										marginRight: '0.3em',
										color: secondary
									}}
								/>
							}
							<FontAwesome
								name={'hand-paper-o'}
								style={{
									color: !canRequest ? 'grey' : '#ffffffcc',
									fontSize: '24px',
									width: '1em',
									height: '1em',
									overflow: 'hidden',
									userSelect: 'none'
								}}
							/>
						</div>
						<div style={{
							fontSize: '0.55rem',
							textTransform: 'none',
							color: !canRequest ? 'grey' : '#ffffffcc',
						}}>
							{translate.ask_word_short}
						</div>
					</div>
				</Button>
			);
		};

		return (
			<div style={{
				width: props.isPc ? '50%' : '20%',
				textAlign: 'center',
				paddingTop: '0.35rem',
				color: grantedWord ? 'grey' : secondary,
				borderLeft: props.isPc ? '1px solid dimgrey' : '',
				borderTop: props.isPc ? '1px solid dimgrey' : '',
			}}>
				{renderButton()}
			</div>
		);
	};

	const fixedURLMode = (props.videoURL && (!props.videoURL.includes('councilbox')
		&& !props.videoURL.includes('rivulet')
		&& !props.videoURL.includes('cbx')
		&& !props.videoURL.includes('streaminggalicia')
		&& !props.videoURL.includes('vimeo')
	));

	return (
		<React.Fragment>
			{!fixedURLMode ?
				renderWordButtonIconMobil()
				:
				<div style={{
					width: props.isPc ? '50%' : '20%',
					borderLeft: props.isPc ? '1px solid dimgrey' : '',
					borderTop: props.isPc ? '1px solid dimgrey' : '',
				}}>
				</div>
			}
			<AlertConfirm
				requestClose={closeSafariModal}
				open={state.safariModal}
				fullWidth={false}
				acceptAction={closeSafariModal}
				buttonAccept={translate.accept}
				bodyText={renderSafariAlertBody()}
				title={translate.warning}
			/>
			<AlertConfirm
				requestClose={closeWordModal}
				open={state.confirmWordModal}
				acceptAction={askForWord}
				cancelAction={closeWordModal}
				title={translate.warning}
				bodyText={translate.will_ask_for_word}
				buttonAccept={translate.accept}
				buttonCancel={translate.cancel}
			/>

			{grantedWord && props.avisoVideoState &&
			<Grid item xs={isMobile ? 12 : 12} md={8}
				style={{
					transition: 'all .3s ease-in-out',
					display: 'flex',
					position: 'fixed',
					minHeight: '50px',
					top: '6.7rem',
					left: '0',
					alignItems: 'center',
					justifyContent: 'center',
					zIndex: '1010',
				}}
			>
				<div style={{
					width: '100vw',
					marginLeft: '10px',
					paddingRight: '6px',
					height: '50px',
				}}
				>
					<div style={{
						borderTop: '1px solid gainsboro',
						borderRadiusTopLeft: '5px',
						position: 'relative',
						width: '100%',
						height: '100%',
						background: 'white',
					}}>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								height: '100%',
								fontSize: '15px',
								color: secondary,
								paddingLeft: '10px'
							}}
						>
							<div style={{ marginRight: '10px', marginTop: '4px' }}>
								<FontAwesome
									name={'info-circle'}
									style={{
										fontSize: '1.4em',
									}}
								/>
							</div>
							<div>
								{translate.word_gived}
							</div>
							<div>
								<FontAwesome
									name={'close'}
									style={{
										cursor: 'pointer',
										fontSize: '1.5em',
										color: secondary,
										position: 'absolute',
										right: '12px',
										top: '8px'
									}}
									onClick={props.avisoVideoStateCerrar}
								/>
							</div>
						</div>
					</div>
				</div>
			</Grid>
			}
		</React.Fragment>
	);
};

const changeRequestWord = gql`
    mutation ChangeRequestWord($participantId: Int!, $requestWord: Int!){
        changeRequestWord(participantId: $participantId, requestWord: $requestWord){
            success
            message
        }
    }
`;

export default graphql(changeRequestWord, {
	name: 'changeRequestWord'
})(withTranslations()(RequestWordMenu));
