import React from 'react';
import { Card, MenuItem, Tooltip } from 'material-ui';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { flowRight as compose } from 'lodash';
import { getSecondary } from '../../../../../styles/colors';
import { haveGrantedWord } from '../../../../../utils/CBX';

const MuteToggleButton = ({ translate, participant, refetch, muteParticipant }) => {
	const disabled = participant.videoParticipant && participant.videoParticipant.mutedMic;

	const toggleMuteParticipant = async () => {
		if ((participant.videoParticipant && !participant.videoParticipant.mutedMic)) {
			const response = await muteParticipant({
				variables: {
					councilId: participant.councilId,
					videoParticipantId: participant.videoParticipant.id
				}
			});

			if (response.data) {
				if (response.data.muteVideoParticipant.success) {
					refetch();
				}
			}
		}
	};

	return (
		<div style={{ marginRight: '0.3em' }}>
			{haveGrantedWord(participant) && (
				<Tooltip
					title={
						!disabled ?
							translate.mute_microphone
							: translate.only_participant_can_enable_audio
					}
				>
					<Card
						onClick={disabled ? () => {} : () => toggleMuteParticipant(participant.id)}
						style={{
							width: '1.6em',
							height: '1.6em',
							borderRadius: '0.1em',
							backgroundColor: disabled ? 'grey' : getSecondary()
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
							{(participant.videoParticipant && participant.videoParticipant.mutedMic) ?
								<i className="fa fa-microphone-slash" aria-hidden="true" style={{ transform: 'scaleX(-1)' }}></i>
								: <i className="fa fa-microphone" aria-hidden="true"></i>
							}
						</MenuItem>
					</Card>
				</Tooltip>
			)}
		</div>
	);
};

const muteParticipant = gql`
	mutation muteParticipant($videoParticipantId: String!, $councilId: Int!){
		muteVideoParticipant(videoParticipantId: $videoParticipantId, councilId: $councilId){
			success
		}
	}
`;

const unmuteParticipant = gql`
	mutation UnmuteParticipant($videoParticipantId: String!, $councilId: Int!){
		unmuteVideoParticipant(videoParticipantId: $videoParticipantId, councilId: $councilId){
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
