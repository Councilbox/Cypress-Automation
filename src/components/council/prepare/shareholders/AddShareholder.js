import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton } from '../../../../displayComponents';
import ShareholderEditor from './ShareholderEditor';
import { getSecondary } from '../../../../styles/colors';

const getNumberValue = value => {
	if (value === 'undefined' || value === null) {
		return 1;
	}

	const num = +value;

	if (Number.isNaN(num)) {
		return 1;
	}

	return value;
};


const ApproveRequestButton = ({
	request, client, refetch, council
}) => {
	const [modal, setModal] = React.useState(null);
	const {
		requestType, legalTermsAccepted, attachments, earlyVotes, representative, ...cleanData
	} = request.data;
	cleanData.numParticipations = getNumberValue(cleanData.numParticipations);
	cleanData.socialCapital = getNumberValue(
		Object.prototype.hasOwnProperty.call(cleanData, 'socialCapital') ? cleanData.socialCapital : cleanData.numParticipations);
	cleanData.personOrEntity = cleanData.personOrEntity ? +cleanData.personOrEntity : 0;
	cleanData.assistanceIntention = cleanData.assistanceIntention ? +cleanData.assistanceIntention : 0;
	const secondary = getSecondary();
	const buttonColor = request.participantCreated ? 'grey' : secondary;

	const setParticipantCreated = async participant => {
		await client.mutate({
			mutation: gql`
				mutation SetRequestShareholderCreated($requestId: Int!, $participantId: Int!){
					setRequestShareholderCreated(requestId: $requestId, participantId: $participantId){
						success
					}
				}
			`,
			variables: {
				requestId: request.id,
				participantId: participant.participantId
			}
		});
		refetch();
		setModal(false);
	};


	const sendPrueba = async () => {
		await client.mutate({
			mutation: gql`
				mutation SetRequestShareholderCreated($requestId: Int!, $participantId: Int!){
					setRequestShareholderCreated(requestId: $requestId, participantId: $participantId){
						success
					}
				}
			`,
			variables: {
				requestId: request.id,
				participantId: request.participantId
			}
		});
	};

	return (
		<>
			<BasicButton
				disabled={request.participantCreated}
				text={request.participantCreated ? 'Ya creado' : 'Añadir al censo'}
				onClick={() => {
					if (request.participantCreated) {
						sendPrueba();
					} else {
						setModal(request);
					}
				}}
				buttonStyle={{
					border: `1px solid ${buttonColor}`
				}}
				color="white"
				textStyle={{ color: buttonColor }}
			// onClick={approveRequest}
			/>
			{modal
				&& <ShareholderEditor
					open={modal}
					council={council}
					participations={true}
					refetch={setParticipantCreated}
					defaultValues={cleanData}
					councilId={request.councilId}
					requestClose={() => setModal(false)}
				/>
			}
		</>
	);
};

export default withApollo(ApproveRequestButton);
