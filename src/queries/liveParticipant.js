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