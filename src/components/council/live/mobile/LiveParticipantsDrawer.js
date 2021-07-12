import React from 'react';
import { Drawer } from 'material-ui';
import { Icon } from '../../../../displayComponents';
import { darkGrey } from '../../../../styles/colors';
import ParticipantsLive from '../video/ParticipantsLive';


const LiveParticipantsDrawer = ({
	open, requestClose, council, translate
}) => {
	const toggleFullScreen = () => false;

	return (
		<React.Fragment>
			{open
&& <Drawer
	style={{
		zIndex: -1,
		minWidth: `${100}px`,
		maxWidth: '100%',
	}}
	anchor="left"
	variant="persistent"
	open={open}
	PaperProps={{
		style: {
			width: '80%'
		}
	}}
	onClose={requestClose}
>
	<div
		style={{
			height: '100%',
			width: '100%',
			paddingTop: '3em',
			overflow: 'hidden'
		}}
	>
		<div
			style={{
				display: 'flex',
				cursor: 'pointer',
				alignItems: 'center',
				justifyContent: 'space-between',
				paddingLeft: '0.8em',
				fontSize: '0.90rem',
				width: '100%',
				height: '3.5em',
				fontWeight: '700',
				backgroundColor: darkGrey,
				textTransform: 'uppercase',
				color: 'grey'
			}}
			onClick={requestClose}
		>
			{translate.live_participants_drawer}
			<Icon
				className="material-icons"
				style={{
					color: 'grey',
					marginRight: '1.1em'
				}}
			>
keyboard_arrow_left
			</Icon>
		</div>
		<div
			style={{
				width: '100%',
				height: '100%',
				overflow: 'hidden',
				paddingBottom: '3em',
				backgroundColor: darkGrey,
				position: 'relative'
			}}
		>
			<ParticipantsLive
				councilId={council.id}
				council={council}
				translate={translate}
				videoFullScreen={false}
				toggleFullScreen={toggleFullScreen}
			/>
		</div>
	</div>
</Drawer>
			}
		</React.Fragment>
	);
};

export default LiveParticipantsDrawer;
