import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton } from '../../../../displayComponents';
import ShareholderEditor from './ShareholderEditor';
import { getSecondary } from '../../../../styles/colors';
import initialState from '../../../../store/reducers/initialState';

const getNumberValue = value => {
	if (value === 'undefined' || value === null) {
		return 1;
	}

	const num = +value;

	if (Number.isNaN(Number(num))) {
		return 1;
	}

	return num;
};

const cleanRequestData = participantData => ({
	name: participantData.name,
	surname: participantData.surname,
	position: participantData.position,
	dni: participantData.dni,
	email: participantData.email,
	phone: participantData.phone,
	numParticipations: getNumberValue(participantData.numParticipations),
	socialCapital: getNumberValue(
		(Object.prototype.hasOwnProperty.call(participantData, 'socialCapital') &&
		participantData.socialCapital &&
		participantData.socialCapital !== 0) ?
			participantData.socialCapital :
			participantData.numParticipations),
	personOrEntity: participantData.personOrEntity ? +participantData.personOrEntity : 0,
	assistanceIntention: participantData.assistanceIntention ? +participantData.assistanceIntention : 0,
	requestWord: participantData.requestWord ? +participantData.requestWord : 0,
	initialState: Number.isNaN(Number(initialState)) ? 0 : initialState
});

const buildRepresentative = representative => {
	if (Array.isArray(representative) && representative.length > 0) {
		if (representative[0].name === 'representación') {
			return {
				name: representative[0].info[1]?.value,
				dni: representative[0].info[2]?.value,
				email: representative[0].info[3]?.value,
				phone: representative[0].info[4]?.value,
			};
		}
	}

	return representative;
};


const ApproveRequestButton = ({
	request, client, refetch, council, translate
}) => {
	const [modal, setModal] = React.useState(null);
	const cleanData = cleanRequestData(request.data);
	const { representative } = request.data;

	const representativeData = buildRepresentative(representative);
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
				text={request.participantCreated ? translate.already_created : translate.add_to_the_census}
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
					defaultRepresentative={(representativeData && (request.data.requestType === 'representation' || request.data.requestType === 'vote')) ? {
						...representativeData,
						hasRepresentative: true
					} : null}
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
