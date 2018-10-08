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

export const corporationUsers = gql` 
  query corporationUsers($filters: [FilterInput], $options: OptionsInput) { 
    corporationUsers(filters: $filters, options: $options) { 
			list {
				id 
				usr 
				name 
				surname 
				actived
				email 
				phone 
				lastConnectionDate 
			}
			total
    } 
  } 
`; 
 
export const getCorporationUser = gql` 
  query getCorporationUser ( 
    $id: Int! 
  ) { 
    corporationUser (id: $id){ 
      id 
      usr 
      name 
      surname 
      email 
      phone 
      lastConnectionDate 
      companies{ 
        id 
        businessName 
        logo 
      } 
      sends{ 
        id 
        sendDate 
        impositionDate 
        sendType 
        reqCode 
      } 
    } 
  } 
`; 