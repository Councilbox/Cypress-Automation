import React from 'react';
import { Card, MenuItem, Tooltip } from 'material-ui';
import { graphql } from 'react-apollo';
import { getPrimary, getSecondary } from '../../../../../styles/colors';
import { changeRequestWord } from '../../../../../queries';
import { Icon } from '../../../../../displayComponents';
import { haveGrantedWord, isAskingForWord } from '../../../../../utils/CBX';

class ChangeRequestWordButton extends React.Component {
	changeWordState = async (id, value) => {
		const response = await this.props.changeRequestWord({
			variables: {
				requestWord: value,
				participantId: id
			}
		});

		if (response) {
			this.props.refetch();
		}
	};

	render() {
		const { participant } = this.props;

		return (
			<div style={{ marginRight: '0.3em' }}>
				{(participant.requestWord === 3 && !participant.blocked) && (
					<Tooltip
						title={this.props.translate.grant_room_access}
					>
						<Card
							onClick={() => this.changeWordState(participant.id, 2)
							}
							className={'fadeToggle'}
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
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}
							>
								<Icon
									className="material-icons"
									style={{
										fontSize: '1em',
										color: 'white'
									}}
								>
									input
								</Icon>
							</MenuItem>
						</Card>
					</Tooltip>
				)}

				{haveGrantedWord(participant) && (
					<Tooltip
						title={
							participant.requestWord === 2 ?
								this.props.translate.cancel_broadcast
								: ''
						}
					>
						<Card
							onClick={() => this.changeWordState(participant.id, 0)
							}
							style={{
								width: '1.6em',
								height: '1.6em',
								borderRadius: '0.1em',
								backgroundColor: getPrimary()
							}}
						>
							<MenuItem
								style={{
									height: '1.6em',
									width: '1.6em',
									padding: 0,
									margin: 0,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}
							>
								<Icon
									className="material-icons"
									style={{
										fontSize: '0.9em',
										marginRight: '0.3em',
										color: 'white'
									}}
								>
									pan_tool
								</Icon>
							</MenuItem>
						</Card>
					</Tooltip>
				)}
				{isAskingForWord(participant) && (
					<Tooltip title={this.props.translate.give_word} >
						<Card
							onClick={() => this.changeWordState(participant.id, 2)}
							className={'fadeToggle'}
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
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}
							>
								<Icon
									className="material-icons"
									style={{
										fontSize: '0.92em',
										marginRight: '0.3em',
										color: 'white'
									}}
								>
									pan_tool
								</Icon>
							</MenuItem>
						</Card>
					</Tooltip>
				)}
			</div>
		);
	}
}

export default graphql(changeRequestWord, {
	name: 'changeRequestWord'
})(ChangeRequestWordButton);
