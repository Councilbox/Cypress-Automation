import gql from "graphql-tag";

export const userAndCompanySignUp = gql`
	mutation userAndCompanySignUp(
		$data: UserAndCompanySignUpInput!
	) {
		userAndCompanySignUp(
			data: $data
		) {
			success
		}
	}
`;

export const checkEmailExists = gql`
	query checkEmailExists($email: String!) {
		checkEmailExists(email: $email) {
			success
		}
	}
`;

export const checkCifExists = gql`
	query checkCifExists($cif: String!) {
		checkCifExists(cif: $cif) {
			success
		}
	}
`;
