import gql from "graphql-tag";

export const updateCompany = gql`
    mutation updateCompany($company: CompanyInput){
      updateCompany(company: $company){
        alias
        tin
        logo
        id
        businessName
        address
        city
        zipcode
        country
        countryState
        linkKey
        creatorId
        domain
        demo
        type
        language
        creationDate
        corporationId
      }
    }
`;