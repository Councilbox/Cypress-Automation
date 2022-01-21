import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { PARTICIPANT_TYPE } from '../../../constants';
import { BasicButton } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';

const LoginAfterAccessLimitButton = ({ translate, participant, client, refetch }) => {
	const primary = getPrimary();

	const grantAccessAfterLimit = async () => {
		await client.mutate({
			mutation: gql`
				mutation GrantParticipantAccessAfterLimit($participantId: Int!){
					grantParticipantAccessAfterLimit(participantId: $participantId) {
						success
						message
					}
				}
			`,
			variables: {
				participantId: participant.id
			}
		});

		refetch();
	};

	return (
		<BasicButton
			text={participant.type === PARTICIPANT_TYPE.GUEST ? translate.enter_room : translate.enter_room_as_guest}
			color={primary}
			textStyle={{
				color: 'white',
				fontWeight: '700'
			}}
			onClick={grantAccessAfterLimit}
		/>
	);
};

export default withApollo(LoginAfterAccessLimitButton);
