import React from 'react';
import { MenuItem, Card } from 'material-ui';
import { graphql } from 'react-apollo';
import { DropDownMenu, Icon } from '../../../../../displayComponents';
import { getSecondary } from '../../../../../styles/colors';
import {
	participantIsBlocked,
	canUnblockParticipant
} from '../../../../../utils/CBX';
import { unbanParticipant as unbanParticipantMutation, changeRequestWord } from '../../../../../queries';

const VideoParticipantMenu = ({ translate, participant, ...props }) => {
	const secondary = getSecondary();

	const unbanParticipant = async () => {
		const response = await props.unbanParticipant({
			variables: {
				participantId: participant.id
			}
		});

		if (response) {
			if (response.data.unbanParticipant.success) {
				props.refetch();
			}
		}
	};

	const changeWordState = async (id, value) => {
		const response = await props.changeRequestWord({
			variables: {
				requestWord: value,
				participantId: id
			}
		});

		if (response) {
			props.refetch();
		}
	};

	return (
		<DropDownMenu
			Component={() => (
				<Card
					style={{
						width: '1.6em',
						height: '1.6em',
						borderRadius: '0.1em',
						backgroundColor: secondary
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
								color: 'white'
							}}
						>
							keyboard_arrow_down
						</Icon>
					</MenuItem>
				</Card>
			)}
			items={
				<React.Fragment>
					{participantIsBlocked(participant) ? (
						canUnblockParticipant(props.council) && (
							<MenuItem
								onClick={unbanParticipant}
							>
								<Icon
									className="material-icons"
									style={{
										color: 'green',
										marginRight: '0.4em'
									}}
								>
									rotate_right
								</Icon>
								{translate.unban_participant}
							</MenuItem>
						)
					) : (
						<MenuItem
							onClick={props.setBanParticipant}
						>
							<Icon
								className="material-icons"
								style={{
									color: 'red',
									marginRight: '0.4em'
								}}
							>
								block
							</Icon>
							{translate.ban_participant}
						</MenuItem>
					)}
					{(participant.requestWord !== 3 && participant.requestWord !== 4 && !participantIsBlocked(participant)) && (
						<MenuItem
							onClick={() => changeWordState(participant.id, 3)}
						>
							<Icon
								className="material-icons"
								style={{
									color: secondary,
									marginRight: '0.4em'
								}}
							>
								launch
							</Icon>
							{translate.send_to_waiting_room}
						</MenuItem>
					)}
					<MenuItem
						onClick={props.setParticipantHistory}
					>
						<Icon
							className="material-icons"
							style={{
								color: secondary,
								marginRight: '0.4em'
							}}
						>
							storage
						</Icon>
						{translate.video_logs_list}
					</MenuItem>
				</React.Fragment>
			}
		/>
	);
};


export default graphql(unbanParticipantMutation, {
	name: 'unbanParticipant'
})(graphql(changeRequestWord, {
	name: 'changeRequestWord'
})(VideoParticipantMenu));
