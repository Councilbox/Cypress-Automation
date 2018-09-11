import React from "react";
import { Card, MenuItem, Tooltip } from "material-ui";
import { getPrimary, getSecondary } from "../../../../styles/colors";
import { graphql } from "react-apollo";
import { changeRequestWord } from "../../../../queries";
import { Icon } from "../../../../displayComponents";
import { haveGrantedWord, isAskingForWord } from "../../../../utils/CBX";

class MuteToggleButton extends React.Component {

    toggleMuteParticipant = () => {

    }

	render() {
		const { participant } = this.props;

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
                                <i class="fa fa-microphone" aria-hidden="true"></i>
							</MenuItem>
						</Card>
					</Tooltip>
				)}
			</div>
		);
	}
}

export default MuteToggleButton;
