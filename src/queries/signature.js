import gql from "graphql-tag";

export const deleteSignature = gql`
	mutation deleteSignature($id: Int!) {
		deleteSignature(id: $id) {
			success
		}
	}
`;

export const signatures = gql`
	query signatures($companyId: Int!, $state: [Int]) {
		signatures(companyId: $companyId, state: $state) {
			id
			title
			expirationDateToSign
		}
	}
`;

export const signature = gql`
	query Signature($id: Int!){
		signature(id: $id) {
			id
			companyId
			title
			description
			expirationDateToSign
			state
			requestId
			attachment {
				id
				signatureId
				title
				description
				filename
				filesize
				filetype
			}

		}
	}
`;
