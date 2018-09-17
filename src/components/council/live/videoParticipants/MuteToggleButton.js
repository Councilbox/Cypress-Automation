import React from "react";
import { Card, MenuItem, Tooltip } from "material-ui";
import { getPrimary, getSecondary } from "../../../../styles/colors";
import { graphql, compose } from "react-apollo";
import { changeRequestWord } from "../../../../queries";
import { Icon } from "../../../../displayComponents";
import { haveGrantedWord, isAskingForWord } from "../../../../utils/CBX";
import gql from 'graphql-tag';

class MuteToggleButton extends React.Component {

	state = {
		muted: this.props.participant.videoParticipant.mutedMic
	}

    toggleMuteParticipant = async () => {
		if(this.props.participant.videoParticipant.mutedMic){
			const response = await this.props.unmuteParticipant({
				variables: {
					councilId: this.props.participant.councilId,
					videoParticipantId: this.props.participant.videoParticipant.id
				}
			});

			console.log(response);

			if(response.data){
				if(response.data.unmuteVideoParticipant.success){
					this.setState({
						muted: false
					});
				}
			}
		}else {
			const response = await this.props.muteParticipant({
				variables: {
					councilId: this.props.participant.councilId,
					videoParticipantId: this.props.participant.videoParticipant.id
				}
			});

			if(response.data){
				if(response.data.muteVideoParticipant.success){
					this.setState({
						muted: true
					});
				}
			}
		}
    }

	render() {
		const { participant } = this.props;
		console.log(participant);

		return (
			<div style={{marginRight: '0.3em'}}>
				{haveGrantedWord(participant) && (
					<Tooltip
						title={
							participant.requestWord === 2
								? 'Mutar participante'
								: ""
						}
					>
						<Card
							onClick={() =>
								this.toggleMuteParticipant(participant.id)
							}
							style={{
								width: "1.6em",
								height: "1.6em",
								borderRadius: "0.1em",
								backgroundColor: getSecondary()
							}}
						>
							<MenuItem
								style={{
									height: "1.6em",
									width: "1.6em",
									padding: 0,
									margin: 0,
                                    color: 'white',
									display: "flex",
									alignItems: "center",
									justifyContent: "center"
								}}
							>
								{this.state.muted? 
                                	<i className="fa fa-microphone-slash" aria-hidden="true"></i>						
								:
                                	<i className="fa fa-microphone" aria-hidden="true"></i>
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
