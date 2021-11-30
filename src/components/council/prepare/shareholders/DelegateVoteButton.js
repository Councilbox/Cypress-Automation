import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton } from '../../../../displayComponents';
import { getSecondary } from '../../../../styles/colors';
import DelegateOwnVoteModal from '../../live/DelegateOwnVoteModal';
import { PARTICIPANT_STATES } from '../../../../constants';


const DelegateVoteButton = ({
	request, client, refetch, setRepresentative, text, translate, inModal, setInModal, closeModalAlert
}) => {
	const [modal, setModal] = React.useState(null);
	const [data, setData] = React.useState(null);
	const [loading, setLoading] = React.useState(true);
	const buttonColor = getSecondary();

	const getParticipant = React.useCallback(async () => {
		const response = await client.query({
			query: gql`
				query CouncilParticipant($participantId: Int!, $councilId: Int!){
					councilParticipant(participantId: $participantId){
						id
						councilId
						name
						surname
						position
						email
						phone
						dni
						type
						secondaryEmail
						initialState
						numParticipations
						socialCapital
						uuid
						delegateUuid
						delegateId
						position
						language
						representatives {
							id
							name
							surname
							dni
							email
							initialState
							secondaryEmail
							phone
							position
							language
							notifications {
								id
								reqCode
								refreshDate
							}
							live {
								name
								id
								surname
								assistanceComment
								assistanceLastDateConfirmed
								assistanceIntention
							}
						}
						represented {
							id
							name
							surname
							numParticipations
							socialCapital
							dni
							email
							type
							phone
							position
							language
							notifications {
								reqCode
								refreshDate
								sendDate
							}
							live {
								name
								id
								surname
								assistanceComment
								assistanceLastDateConfirmed
								assistanceIntention
							}
						}
						live {
							name
							id
							state
							surname
							delegationProxy {
								signedBy
								id
								participantId
								delegateId
							}
							voteLetter {
								signedBy
								id
								participantId
							}
							delegateId
							assistanceComment
							assistanceLastDateConfirmed
							assistanceIntention
							representative {
								id
								name
								surname
								dni
								position
							}
						}
						city
						personOrEntity
						notifications {
							id
							reqCode
							sendDate
							refreshDate
						}
					}
					council(id: $councilId) {
						id
						statute {
							id
							prototype
							councilId
							statuteId
							title
							existPublicUrl
							addParticipantsListToAct
							existsAdvanceNoticeDays
							advanceNoticeDays
							existsSecondCall
							minimumSeparationBetweenCall
							canEditConvene
							requireProxy
							firstCallQuorumType
							firstCallQuorum
							firstCallQuorumDivider
							secondCallQuorumType
							secondCallQuorum
							secondCallQuorumDivider
							existsDelegatedVote
							delegatedVoteWay
							existMaxNumDelegatedVotes
							maxNumDelegatedVotes
							existsLimitedAccessRoom
							limitedAccessRoomMinutes
							existsQualityVote
							qualityVoteOption
							canUnblock
							canAddPoints
							canReorderPoints
							existsAct
							existsWhoSignTheAct
							includedInActBook
							includeParticipantsList
							existsComments
							conveneHeader
							intro
							constitution
							conclusion
							actTemplate
							censusId
						}
					}
				}
			`,
			variables: {
				participantId: request.participantId,
				councilId: request.councilId
			}
		});
		setData(response.data);
		setLoading(false);
	}, [request.participantId]);

	const sendNotification = async () => {
		await client.mutate({
			mutation: gql`
				mutation SendRequestDelegationConfirmation($requestId: Int!, $participantId: Int!){
					sendRequestDelegationConfirmation(requestId: $requestId, participantId: $participantId){
						success
					}
				}
			`,
			variables: {
				requestId: request.id,
				participantId: data.councilParticipant.id
			}
		});
		await getParticipant();
		await refetch();
	};

	React.useEffect(() => {
		getParticipant();
	}, [getParticipant]);

	if (loading) {
		return '';
	}

	const closeModals = () => {
		setModal(request);
		if (!inModal && setInModal) {
			setInModal(true);
		}
	};

	const participant = data.councilParticipant;

	if (participant.live.state === PARTICIPANT_STATES.DELEGATED || participant.live.state === PARTICIPANT_STATES.REPRESENTATED) {
		setRepresentative(true);
	}

	if (inModal) {
		return (
			<>
				<DelegateOwnVoteModal
					show={modal}
					council={data.council}
					participant={participant.live}
					refetch={sendNotification}
					requestClose={() => { setInModal(false); closeModalAlert(); }}
					translate={translate}
					inModal={inModal}
				/>
			</>
		);
	}
	return (
		<>
			<BasicButton
				text={text || ((participant.live.state === PARTICIPANT_STATES.DELEGATED || participant.live.state === PARTICIPANT_STATES.REPRESENTATED) ?
					`${participant.live.state === PARTICIPANT_STATES.DELEGATED ? translate.delegated_in : translate.represented_by} ${participant.live.representative ? participant.live.representative.name : '-'} ${participant.live.representative ? participant.live.representative.surname : ''}`
					: translate.to_delegate_vote)}
				onClick={closeModals}
				buttonStyle={{
					border: `1px solid ${buttonColor}`,
					marginLeft: '0.3em'
				}}
				color="white"
				textStyle={{ color: buttonColor }}
			/>
			<DelegateOwnVoteModal
				show={modal}
				council={data.council}
				participant={participant.live}
				refetch={sendNotification}
				requestClose={() => setModal(false)}
				translate={translate}
				notify={true}
				inModal={inModal}
			/>
		</>
	);
};

export default withApollo(DelegateVoteButton);

