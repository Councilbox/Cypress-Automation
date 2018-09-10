import gql from "graphql-tag";

export const setAssistanceComment = gql`
	mutation setAssistanceComment(
		$assistanceComment: String!
	) {
		setAssistanceComment(
			assistanceComment: $assistanceComment
		) {
			success
		}
	}
`;

export const setAssistanceIntention = gql`
	mutation setAssistanceIntention(
		$assistanceIntention: Int!,
		$representativeId: Int,
	) {
		setAssistanceIntention(
			assistanceIntention: $assistanceIntention
			representativeId: $representativeId
		) {
			success
		}
	}
`;


export const liveParticipantSignature = gql`
	query liveParticipantSignature(
		$participantId: Int!,
	) {
		liveParticipantSignature(
			participantId: $participantId
		) {
			id
			participantId
			data
			date
		}
	}
`;

export const setLiveParticipantSignature = gql`
	mutation setLiveParticipantSignature(
		$signature: LiveParticipantSignatureInput!,
		$state: Int
	) {
		setLiveParticipantSignature(
			signature: $signature,
			state: $state
		) {
			success
		}
	}
`;

export const changeParticipantState = gql`
	mutation changeParticipantState(
		$participantId: Int!,
		$state: Int!,
	) {
		changeParticipantState(
			participantId: $participantId
			state: $state
		) {
			success
			message
		}
	}
`;
export const addDelegation = gql`
	mutation addDelegation(
		$participantId: Int!,
		$delegateId: Int!,
	) {
		addDelegation(
			participantId: $participantId
			delegateId: $delegateId
		) {
			success
			message
		}
	}
`;

export const liveParticipants = gql`
	query liveParticipants(
		$councilId: Int!
		$filters: [FilterInput]
		$notificationStatus: Int
		$options: OptionsInput
	) {
		liveParticipants(
			councilId: $councilId
			filters: $filters
			notificationStatus: $notificationStatus
			options: $options
		) {
			list {
				id
				delegateId
				state
				audio
				video
				councilId
				name
				position
				email
				phone
				dni
				date
				type
				participantId
				online
				requestWord
				numParticipations
				surname
				assistanceComment
				assistanceLastDateConfirmed
				assistanceIntention
				representative {
					id
					name
					surname
				}
				blocked
				lastDateConnection
				videoMode
				notifications {
					participantId
					reqCode
					refreshDate
				}
				firstLoginDate
				firstLoginCurrentPointId
				language
				signed
				socialCapital
				address
				city
				country
				countryState
				zipcode
				delegateUuid
				actived
				personOrEntity
			}
			total
		}
	}
`;