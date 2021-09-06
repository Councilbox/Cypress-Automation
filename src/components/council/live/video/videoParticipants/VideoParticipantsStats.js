import React from 'react';
import { Tooltip } from 'material-ui';
import { Icon } from '../../../../../displayComponents';
import { mediumGrey, lightGrey, turquoise } from '../../../../../styles/colors';
import RecordingButton from '../RecordingButton';

const VideoParticipantsStats = ({
	videoFullScreen,
	translate,
	council,
	toggleFullScreen,
	stats
}) => {
	const [collapse, setCollapse] = React.useState(true);

	const handleWindowSize = React.useCallback(() => {
		const innerWidth = document.getElementById('participant-stats-container').offsetWidth;
		setCollapse(innerWidth < 480 && !videoFullScreen);
	}, [setCollapse]);

	React.useEffect(() => {
		handleWindowSize();
		window.addEventListener('resize', handleWindowSize);
		return () => window.removeEventListener('resize', handleWindowSize);
	}, [council.id, setCollapse]);


	return (
		<div
			id="participant-stats-container"
			style={{
				height: videoFullScreen ? '100%' : '3em',
				width: '100%',
				position: 'relative',
				display: 'flex',
				justifyContent: 'space-between',
				cursor: videoFullScreen ? 'pointer' : '',
				flexDirection: videoFullScreen ? 'column' : 'row',
				backgroundColor: mediumGrey,
				overflowX: 'visible',
				alignItems: 'center'
			}}
			{...(videoFullScreen ? { onClick: toggleFullScreen } : {})}
			className="withShadow"
		>
			<div
				style={{
					display: 'flex',
					flexDirection: videoFullScreen ? 'column' : 'row',
				}}
			>
				{collapse ?
					<>
						<Tooltip title={translate.present.toLowerCase().capitalize()}>
							<div
								style={{
									marginLeft: '1em',
									marginRight: '0.5em',
									height: videoFullScreen ? '3em' : '100%',
									display: 'flex',
									alignItems: 'center'
								}}
							>
								<Icon
									className="material-icons"
									style={{
										fontSize: '1.1em',
										marginRight: '0.3em',
										color: turquoise
									}}
								>
									language
								</Icon>
								<span
									style={{
										fontWeight: '700',
										color: 'white',
										fontSize: '0.8em'
									}}
								>
									{stats.online}
								</span>
							</div>
						</Tooltip>

						<Tooltip title={translate.absents}>
							<div
								style={{
									marginLeft: '1em',
									marginRight: '0.5em',
									height: videoFullScreen ? '3em' : '100%',
									display: 'flex',
									alignItems: 'center'
								}}
							>
								<Icon
									className="material-icons"
									style={{
										fontSize: '1.1em',
										marginRight: '0.3em',
										color: 'crimson'
									}}
								>
									language
								</Icon>
								<span
									style={{
										fontWeight: '700',
										color: 'white',
										fontSize: '0.8em'
									}}
								>
									{stats.offline}
								</span>
							</div>
						</Tooltip>
						<Tooltip title={translate.asking_word}>
							<div
								style={{
									marginLeft: '1em',
									marginRight: '0.5em',
									height: videoFullScreen ? '3em' : '100%',
									display: 'flex',
									alignItems: 'center'
								}}
								{...(stats.askingForWord > 0 ? { className: 'fadeToggle' } : {})}
							>
								<Icon
									className="material-icons"
									style={{
										fontSize: '1.1em',
										marginRight: '0.3em',
										color: turquoise
									}}
								>
									pan_tool
								</Icon>
								<span
									style={{
										fontWeight: '700',
										color: 'white',
										fontSize: '0.8em'
									}}
								>
									{stats.askingForWord}
								</span>
							</div>
						</Tooltip>
					</>
					:
					<>
						<Tooltip title={translate.current_remote_census}>
							<div
								style={{
									marginLeft: '1em',
									marginRight: '0.5em',
									height: videoFullScreen ? '3em' : '100%',
									display: 'flex',
									alignItems: 'center'
								}}
							>
								<Icon
									className="material-icons"
									style={{
										fontSize: '1.1em',
										marginRight: '0.3em',
										color: lightGrey
									}}
								>
									person
								</Icon>
								<span
									style={{
										fontWeight: '700',
										color: 'white',
										fontSize: '0.8em'
									}}
								>
									{stats.total}
								</span>
							</div>
						</Tooltip>
						<Tooltip title={translate.present.toLowerCase().capitalize()}>
							<div
								style={{
									marginLeft: '1em',
									marginRight: '0.5em',
									height: videoFullScreen ? '3em' : '100%',
									display: 'flex',
									alignItems: 'center'
								}}
							>
								<Icon
									className="material-icons"
									style={{
										fontSize: '1.1em',
										marginRight: '0.3em',
										color: turquoise
									}}
								>
									language
								</Icon>
								<span
									style={{
										fontWeight: '700',
										color: 'white',
										fontSize: '0.8em'
									}}
								>
									{stats.online}
								</span>
							</div>
						</Tooltip>

						<Tooltip title={translate.absents}>
							<div
								style={{
									marginLeft: '1em',
									marginRight: '0.5em',
									height: videoFullScreen ? '3em' : '100%',
									display: 'flex',
									alignItems: 'center'
								}}
							>
								<Icon
									className="material-icons"
									style={{
										fontSize: '1.1em',
										marginRight: '0.3em',
										color: 'crimson'
									}}
								>
									language
								</Icon>
								<span
									style={{
										fontWeight: '700',
										color: 'white',
										fontSize: '0.8em'
									}}
								>
									{stats.offline}
								</span>
							</div>
						</Tooltip>
						<Tooltip title={translate.broadcasting}>
							<div
								style={{
									marginLeft: '1em',
									marginRight: '0.5em',
									height: videoFullScreen ? '3em' : '100%',
									display: 'flex',
									alignItems: 'center'
								}}
							>
								<Icon
									className="material-icons"
									style={{
										fontSize: '1.1em',
										marginRight: '0.3em',
										color: turquoise
									}}
								>
									videocam
								</Icon>
								<span
									style={{
										fontWeight: '700',
										color: 'white',
										fontSize: '0.8em'
									}}
								>
									{stats.broadcasting}
								</span>
							</div>
						</Tooltip>
						<Tooltip title={translate.banned}>
							<div
								style={{
									marginLeft: '1em',
									marginRight: '0.5em',
									height: videoFullScreen ? '3em' : '100%',
									display: 'flex',
									alignItems: 'center'
								}}
							>
								<Icon
									className="material-icons"
									style={{
										fontSize: '1.1em',
										marginRight: '0.3em',
										color: 'crimson'
									}}
								>
									block
								</Icon>
								<span
									style={{
										fontWeight: '700',
										color: 'white',
										fontSize: '0.8em'
									}}
								>
									{stats.banned}
								</span>
							</div>
						</Tooltip>
						<Tooltip title={translate.asking_word}>
							<div
								style={{
									marginLeft: '1em',
									marginRight: '0.5em',
									height: videoFullScreen ? '3em' : '100%',
									display: 'flex',
									alignItems: 'center'
								}}
								{...(stats.askingForWord > 0 ? { className: 'fadeToggle' } : {})}
							>
								<Icon
									className="material-icons"
									style={{
										fontSize: '1.1em',
										marginRight: '0.3em',
										color: turquoise
									}}
								>
									pan_tool
								</Icon>
								<span
									style={{
										fontWeight: '700',
										color: 'white',
										fontSize: '0.8em'
									}}
								>
									{stats.askingForWord}
								</span>
							</div>
						</Tooltip>
						<Tooltip title={translate.waiting_room}>
							<div
								style={{
									marginLeft: '1em',
									marginRight: '0.5em',
									height: videoFullScreen ? '3em' : '100%',
									display: 'flex',
									alignItems: 'center'
								}}
							>
								<Icon
									className="material-icons"
									style={{
										fontSize: '1.1em',
										marginRight: '0.3em',
										color: turquoise
									}}
								>
									tv_off
								</Icon>
								<span
									style={{
										fontWeight: '700',
										color: 'white',
										fontSize: '0.8em'
									}}
								>
									{stats.waitingRoom}
								</span>
							</div>
						</Tooltip>
					</>
				}
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: videoFullScreen ? 'column' : 'row',
				}}
			>
				<RecordingButton
					council={council}
					translate={translate}
				/>
				<div
					style={{
						borderRadius: '5px',
						cursor: 'pointer',
						width: '2.9em',
						height: '2.9em',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
					onClick={toggleFullScreen}
				>
					<Icon
						className="material-icons"
						style={{ color: lightGrey }}
					>
						{videoFullScreen ?
							'zoom_out'
							: 'zoom_in'}
					</Icon>
				</div>
			</div>

		</div>
	);
};

export default VideoParticipantsStats;
