import gql from "graphql-tag";

export const createCompanyDraft = gql`
	mutation createCompanyDraft($draft: CompanyDraftInput!) {
		createCompanyDraft(draft: $draft) {
			id
		}
	}
`;

export const updateCompanyDraft = gql`
	mutation updateCompanyDraft($draft: CompanyDraftInput!) {
		updateCompanyDraft(draft: $draft) {
			id
		}
	}
`;

export const deleteDraft = gql`
	mutation deleteCompanyDraft($id: Int!) {
		deleteCompanyDraft(id: $id) {
			success
		}
	}
`;

export const companyDrafts = gql`
	query companyDrafts(
		$companyId: Int!
		$filters: [FilterInput]
		$options: OptionsInput
		$tags: [String]
	) {
		companyDrafts(
			companyId: $companyId
			filters: $filters
			options: $options
			tags: $tags
		) {
			list {
				id
				title
				text
				description
				majority
				majorityType
				majorityDivider
				votationType
				tags
				type
			}
			total
		}
		draftTypes {
			id
			label
			value
		}
	}
`;

export const draftData = gql`
	query statutes($companyId: Int!) {
		companyStatutes(companyId: $companyId) {
			title
			id
		}
		draftTypes {
			id
			label
			value
		}
		votingTypes {
			value
			label
		}
		majorityTypes {
			label
			value
		}
	}
`;

export const getCompanyDraftData = gql`
	query getData($companyId: Int!, $id: Int!) {
		companyDraft(id: $id) {
			id
			userId
			companyId
			title
			description
			text
			type
			votationType
			governingBodyType
			majorityType
			majority
			statuteId
			companyType
			language
			draftId
			creationDate
			lastModificationDate
			corporationId
			majorityDivider
			tags
		}
		companyStatutes(companyId: $companyId) {
			id
			title
		}
		majorityTypes {
			label
			value
		}
		draftTypes {
			label
			value
		}
		votingTypes {
			label
			value
		}
	}
`;
export const getCompanyDraftDataNoCompany = gql`
	query getData($companyId: Int!) {
		companyStatutes(companyId: $companyId) {
			id
			title
		}
		majorityTypes {
			label
			value
		}
		companyTypes {
			label
			value
		}
		draftTypes {
			label
			value
		}
		votingTypes {
			label
			value
		}
	}
`;
