import React from 'react';
import { withApollo, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { MenuItem } from 'material-ui';
import { primary } from '../../../styles/colors';
import {
	AlertConfirm, BasicButton, TextInput, LoadingSection, Checkbox, SelectInput
} from '../../../displayComponents';
import { removeTypenameField } from '../../../utils/CBX';

let interval = null;


const FixedVideoURLModal = ({ council, client, ...props }) => {
	const [state, setState] = React.useState({
		modal: false,
		loading: false,
		success: false
	});
	const [vimeoErrors, setVimeoErrors] = React.useState({
		vimeoId: '',
		vimeoKey: ''
	});

	const [data, setData] = React.useState(null);
	const [videoConfig, setVideoConfig] = React.useState(null);

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: gql`
				query CouncilRoom($councilId: Int!){
					councilRoom(councilId: $councilId){
						platformVideo
						videoConfig
						type
						videoLink
					}
					videoConfig
				}
			`,
			variables: {
				councilId: council.id
			}
		});

		if (response.data.councilRoom) {
			const councilRoom = removeTypenameField(response.data.councilRoom);
			setData({
				platformVideo: councilRoom.platformVideo || null,
				videoLink: councilRoom.videoLink || '',
				type: councilRoom.type,
				videoConfig: {
					rtmp: '',
					viewerURL: '',
					...(councilRoom.videoConfig ? councilRoom.videoConfig : {})
				}
			});
		} else {
			setData({
				platformVideo: null,
				videoLink: '',
				videoConfig: {
					rtmp: '',
					viewerURL: '',
					autoHybrid: false,
					disableHybrid: false
				}
			});
		}
		setVideoConfig(JSON.parse(response.data.videoConfig));
	}, [council.id]);

	React.useEffect(() => {
		getData();
	}, [getData]);

	React.useEffect(() => () => clearInterval(interval), [state.modal]);

	if (!data) {
		return <LoadingSection />;
	}


	const openURLModal = event => {
		event.preventDefault();
		event.stopPropagation();
		setState({
			...state,
			modal: true
		});
	};

	const closeURLModal = () => {
		setState({
			...state,
			modal: false
		});
	};

	const refreshButtons = () => {
		setState({
			...state,
			success: false,
			loading: false,
			error: false
		});
	};

	const updateCouncilRoomLink = async () => {
		if (data.videoConfig.hybridMode === 'VIMEO') {
			const newErrors = {
				vimeoId: '',
				vimeoKey: ''
			};

			let hasError = false;

			if (!data.videoConfig.vimeoId) {
				newErrors.vimeoId = 'Campo requerido';
				hasError = true;
			}
			if (!data.videoConfig.vimeoKey) {
				newErrors.vimeoKey = 'Campo requerid';
				hasError = true;
			}

			setVimeoErrors(newErrors);

			if (hasError) {
				return;
			}
		}
		clearInterval(interval);
		setState({
			...state,
			loading: true,
			success: false
		});
		await props.updateCouncilRoomLink({
			variables: {
				councilId: council.id,
				councilRoom: data
			}
		});

		setState({
			...state,
			loading: false,
			success: true
		});
		interval = setInterval(refreshButtons, 3000);
	};


	const handleEnter = event => {
		refreshButtons();
		if (event.nativeEvent.keyCode === 13) {
			updateCouncilRoomLink();
		}
	};

	const renderBody = () => (
		<>
			{videoConfig
				&& <>
					<div style={{ marginBottom: '1em' }}>
						<h5>Video config:</h5>
						<div>
							Número de instancias disponibles: {videoConfig.instances}
						</div>
						<div>
							En rotación: {videoConfig.availableSlots}
						</div>
					</div>

				</>
			}
			<SelectInput
				value={data.type || 'default'}
				floatingText={'Plataforma de video'}
				onChange={event => setData({
					...data,
					type: event.target.value
				})}
			>
				<MenuItem value={'default'}>Por defecto</MenuItem>
				<MenuItem value={'CMP'}>CMP</MenuItem>
				<MenuItem value={'SHUTTER'}>SHUTTER</MenuItem>
			</SelectInput>

			<TextInput
				value={data.platformVideo}
				onKeyUp={handleEnter}
				floatingText="Fijado al número"
				onChange={event => setData({ ...data, platformVideo: event.target.value })}
			/>

			<TextInput
				value={data.videoLink}
				onKeyUp={handleEnter}
				floatingText="Video URL"
				onChange={event => setData({ ...data, videoLink: event.target.value })}
			/>

			<TextInput
				value={data.videoConfig.rtmp}
				onKeyUp={handleEnter}
				floatingText="URL RTMP"
				onChange={event => setData({
					...data,
					videoConfig: {
						...data.videoConfig,
						rtmp: event.target.value
					}
				})}
			/>
			<TextInput
				value={data.videoConfig.viewerURL}
				onKeyUp={handleEnter}
				floatingText="URL para participantes sin palabra"
				onChange={event => setData({
					...data,
					videoConfig: {
						...data.videoConfig,
						viewerURL: event.target.value
					}
				})}
			/>
			<Checkbox
				label={'Activar sistema híbrido'}
				value={data.videoConfig.autoHybrid}
				onChange={(event, isInputChecked) => setData({
					...data,
					videoConfig: {
						...data.videoConfig,
						autoHybrid: isInputChecked
					}
				})}
			/>
			{data.videoConfig.autoHybrid
				&& <>
					<SelectInput
						value={data.videoConfig.hybridMode}
						floatingText={'Sistema híbrido'}
						onChange={event => setData({
							...data,
							videoConfig: {
								...data.videoConfig,
								hybridMode: event.target.value
							}
						})}
					>
						<MenuItem value={'VIMEO'}>Vimeo</MenuItem>
						<MenuItem value={'WEBRTC'}>WebRTC</MenuItem>
					</SelectInput>
					<SelectInput
						value={data.videoConfig.rtmpType}
						floatingText={'Tipo de streaming híbrido'}
						onChange={event => setData({
							...data,
							videoConfig: {
								...data.videoConfig,
								rtmpType: event.target.value
							}
						})}
					>
						<MenuItem value={'presenter'}>Presentador</MenuItem>
						<MenuItem value={'multi'}>Pantalla partida</MenuItem>
					</SelectInput>
					{data.videoConfig.hybridMode === 'VIMEO' &&
						<>
							<TextInput
								value={data.videoConfig.vimeoId}
								onKeyUp={handleEnter}
								floatingText="Vimeo ID"
								errorText={vimeoErrors.vimeoId}
								onChange={event => setData({
									...data,
									videoConfig: {
										...data.videoConfig,
										vimeoId: event.target.value
									}
								})}
							/>
							<TextInput
								value={data.videoConfig.vimeoKey}
								onKeyUp={handleEnter}
								floatingText="Vimeo key"
								errorText={vimeoErrors.vimeoKey}
								onChange={event => setData({
									...data,
									videoConfig: {
										...data.videoConfig,
										vimeoKey: event.target.value
									}
								})}
							/>
							<TextInput
								value={data.videoConfig.videoPrivId}
								onKeyUp={handleEnter}
								floatingText="Vimeo private key"
								onChange={event => setData({
									...data,
									videoConfig: {
										...data.videoConfig,
										videoPrivId: event.target.value
									}
								})}
							/>
						</>
					}
				</>

			}

			<Checkbox
				label={'Desactivar detección automática del sistema híbrido'}
				value={data.videoConfig.disableHybrid}
				onChange={(event, isInputChecked) => setData({
					...data,
					videoConfig: {
						...data.videoConfig,
						disableHybrid: isInputChecked
					}
				})}
			/>
		</>
	);

	return (
		<>
			<BasicButton
				text="Video config"
				type="flat"
				color="white"
				textStyle={{ color: primary, fontWeight: '700' }}
				onClick={openURLModal}
				buttonStyle={{ border: '1px solid ' }}
			/>
			<AlertConfirm
				requestClose={closeURLModal}
				open={state.modal}
				loadingAction={state.loading}
				successAction={state.success}
				acceptAction={updateCouncilRoomLink}
				buttonAccept={'Aceptar'}
				buttonCancel={'Cancelar'}
				bodyText={renderBody()}
				title={'Fijar video URL'}
			/>
		</>
	);
};

const updateCouncilRoomLink = gql`
	mutation UpdateCouncilRoomLink($councilRoom: CouncilRoomInput!, $councilId: Int!){
		updateCouncilRoom(councilRoom: $councilRoom, councilId: $councilId){
			success
			message
		}
	}
`;

export default graphql(updateCouncilRoomLink, {
	name: 'updateCouncilRoomLink'
})(withApollo(FixedVideoURLModal));
