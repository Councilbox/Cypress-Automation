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

export const getCorporationUsers = gql` 
  query getCorporationUsers { 
    corporationUsers { 
      id 
      usr 
      name 
      surname 
      email 
      phone 
      lastConnectionDate 
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