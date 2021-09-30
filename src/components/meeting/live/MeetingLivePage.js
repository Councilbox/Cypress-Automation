import React from 'react';
import { lightGrey } from '../../../styles/colors';
import { bHistory } from '../../../containers/App';
import withSharedProps from '../../../HOCs/withSharedProps';
import withWindowSize from '../../../HOCs/withWindowSize';
import { Icon } from '../../../displayComponents';
import logo from '../../../assets/img/logo-white.png';

const rand = Date.now();

const MeetingLivePage = () => {
	const state = {
		url: sessionStorage.getItem('meetingUrl'),
	};

	React.useEffect(() => {
		if (!state.url) {
			bHistory.push('/');
		}
		return () => sessionStorage.removeItem('meetingUrl');
	}, [state.url]);

	return (
		<div
			style={{
				height: '100%',
				overflow: 'hidden',
				backgroundColor: lightGrey,
				fontSize: '1em'
			}}
		>
			<div
				elevation={0}
				style={{
					background: '#212121',
					display: 'flex',
					width: '100%',
					userSelect: 'none',
					position: 'absolute',
					zIndex: 1000,
					height: '3em',
					alignItems: 'center',
					justifyContent: 'space-between'
				}}
			>
				<div style={{ width: '20%' }}>
					<img
						src={logo}
						className="App-logo"
						style={{
							height: '1.5em',
							marginLeft: '2em'
						}}
						alt="logo"
					/>
				</div>
				<div
					style={{
						width: '35%',
						marginRight: '10%',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					}}
				>
				</div>
				<div
					style={{
						width: '10%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'flex-end',
						marginRight: '2em'
					}}
				>
					<Icon
						className="material-icons"
						style={{
							fontSize: '1.5em',
							color: 'white',
							cursor: 'pointer'
						}}
						onClick={bHistory.back}
					>
						exit_to_app
					</Icon>
				</div>
			</div>
			<div
				style={{
					height: '3em',
					width: '100%'
				}}
			/>
			<div
				style={{
					display: 'flex',
					width: '100%',
					height: 'calc(100% - 3em)',
					flexDirection: 'row'
				}}
			>
				{!!state.url
					&& <iframe
						id="meeting-iframe"
						title="meetingScreen"
						allow="geolocation; microphone; camera; display-capture"
						scrolling="no"
						className="temp_video"
						src={`https://${state.url}?rand=${rand}`}
						allowFullScreen={true}
						style={{
							border: 'none !important'
						}}
					>
						Something wrong...
					</iframe>
				}
			</div>
		</div>
	);
};


export default (withSharedProps()(withWindowSize(MeetingLivePage)));
