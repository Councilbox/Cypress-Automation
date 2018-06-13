import gql from "graphql-tag";

export const getCorporation = gql`
	query getCorporation {
		corporation {
			id
			businessName
			address
			tin
			logo
			language
		}
	}
`;


export const corporationDrafts = gql`
	query corporationDrafts(
		$filters: [FilterInput]
		$options: OptionsInput
	) {
		corporationDrafts(
			filters: $filters
			options: $options
		) {
			list {
				categories
				companyType
				corporationId
				councilType
				description
				id
				language
				majority
				majorityDivider
				majorityType
				prototype
				statuteId
				text
				title
				type
				userId
				votationType
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
