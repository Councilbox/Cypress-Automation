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
