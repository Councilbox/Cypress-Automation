import React from 'react';
import { Card, MenuItem, Tooltip } from 'material-ui';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import gql from 'graphql-tag';
import { getSecondary } from '../../../../../styles/colors';
import { haveGrantedWord } from '../../../../../utils/CBX';

class MuteToggleButton extends React.Component {
	toggleMuteParticipant = async () => {
		this.setState({
			loading: true
		});
		if ((this.props.participant.videoParticipant && this.props.participant.videoParticipant.mutedCam)) {
			const response = await this.props.unmuteParticipant({
				variables: {
					councilId: this.props.participant.councilId,
					videoParticipantId: this.props.participant.videoParticipant.id
				}
			});

			if (response.data) {
				if (response.data.unmuteVideoParticipantCam.success) {
					this.setState({
						loading: false
					});
					this.props.refetch();
				}
			}
		} else {
			const response = await this.props.muteParticipant({
				variables: {
					councilId: this.props.participant.councilId,
					videoParticipantId: this.props.participant.videoParticipant.id
				}
			});

			if (response.data) {
				if (response.data.muteVideoParticipantCam.success) {
					this.setState({
						loading: false
					});
					this.props.refetch();
				}
			}
		}
	}

	render() {
		const { participant } = this.props;

		// TRADUCCION
		return (
			<div style={{ marginRight: '0.3em' }}>
				{haveGrantedWord(participant) && (
					<Tooltip
						title={
							participant.requestWord === 2 ?
								'Desactivar cámara'
								: ''
						}
					>
						<Card
							onClick={() => this.toggleMuteParticipant(participant.id)
							}
							style={{
								width: '1.6em',
								height: '1.6em',
								borderRadius: '0.1em',
								backgroundColor: getSecondary()
							}}
						>
							<MenuItem
								style={{
									height: '1.6em',
									width: '1.6em',
									padding: 0,
									margin: 0,
									color: 'white',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}
							>
								{(this.props.participant.videoParticipant && this.props.participant.videoParticipant.mutedCam) ?
									<span className="material-icons" style={{ fontSize: '1.15em' }}>
										videocam_off
									</span>
									: <span className="material-icons" style={{ fontSize: '1.15em' }}>
										videocam
									</span>
								}
							</MenuItem>
						</Card>
					</Tooltip>
				)}
			</div>
		);
	}
}


const muteParticipant = gql`
	mutation MuteVideoParticipantCam($videoParticipantId: String!, $councilId: Int!){
		muteVideoParticipantCam(videoParticipantId: $videoParticipantId, councilId: $councilId){
			success
		}
	}
`;

const unmuteParticipant = gql`
	mutation UnmuteVideoParticipantCam($videoParticipantId: String!, $councilId: Int!){
		unmuteVideoParticipantCam(videoParticipantId: $videoParticipantId, councilId: $councilId){
			success
		}
	}
`;

export default compose(
	graphql(muteParticipant, {
		name: 'muteParticipant'
	}),

	graphql(unmuteParticipant, {
		name: 'unmuteParticipant'
	})
)(MuteToggleButton);
