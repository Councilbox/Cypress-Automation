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

export const unlinkCompany = gql`
  mutation unlinkCompany($userId: Int!, $companyTin: String!){
    unlinkCompany(userId: $userId, companyTin: $companyTin){
      success
      message
    }
  }
`;