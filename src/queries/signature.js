import gql from "graphql-tag";

export const deleteSignature = gql`
	mutation deleteSignature($id: Int!) {
		deleteSignature(id: $id) {
			success
		}
	}
`;

export const signatures = gql`
	query signatures($companyId: Int!, $state: Int!, $active: Int!) {
		signatures(companyId: $companyId, state: $state, active: $active) {
			id
			title
			expirationDateToSign
		}
	}
`;
