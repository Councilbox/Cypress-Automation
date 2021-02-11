import React from 'react';
import { Card } from 'material-ui';
import withTranslations from '../../../HOCs/withTranslations';
import withDetectRTC from '../../../HOCs/withDetectRTC';
import Header from '../Header';

const styles = {
	viewContainer: {
		width: '100vw',
		height: '100vh',
		position: 'relative'
	},
	mainContainer: {
		width: '100%',
		height: 'calc(100% - 48px)',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		backgroundImage: 'blue',
		padding: '10px'
	},
	cardContainer: {
		margin: '20px',
		padding: '20px',
		maxWidth: '100%'
	}
};

class ParticipantMeet extends React.Component {
state = {
	participantId: null
};

render() {
	const { participant, council } = this.props;
	// const { participantId } = this.state;
	return (
		<div style={styles.viewContainer}>
			<Header logoutButton={true} participant={participant} council={council}/>
			<div style={styles.mainContainer}>
				<Card style={styles.cardContainer}>
MEET
				</Card>
			</div>
		</div>
	);
}
}

export default withTranslations()(withDetectRTC()(ParticipantMeet));
