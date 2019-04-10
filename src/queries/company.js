import gql from "graphql-tag";

const companyFragment = `
	alias
	tin
	logo
	id
	businessName
	address
	city
	zipcode
	country
	category
	countryState
	linkKey
	creatorId
	domain
	demo
	type
	language
	creationDate
	corporationId
`

export const updateCompany = gql`
	mutation updateCompany($company: CompanyInput) {
		updateCompany(company: $company) {
			${companyFragment}
		}
	}
`;

export const unlinkCompany = gql`
	mutation unlinkCompany($companyTin: String!) {
		unlinkCompany(companyTin: $companyTin) {
			success
			message
		}
	}
`;

export const linkCompany = gql`
	mutation linkCompany(
		$companyTin: String!
		$linkKey: String!
	) {
		linkCompany(
			companyTin: $companyTin
			linkKey: $linkKey
		) {
			success
			message
		}
	}
`;
