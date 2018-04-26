import gql from "graphql-tag";

export const languages = gql`
  query languages{
    languages{
      desc
      columnName
    }
  }
`;


export const countries = gql `
  query countries {
    countries {
      deno
      id
    }
  }
`;

export const provinces = gql`
  query ProvinceList($countryId: Int!){
    provinces(countryId: $countryId){
      id
      deno
    }
  }
`;

export const companyTypes = gql `
  query companyTypes {
    companyTypes {
      label
      value
    }
  }
`;

export const majorities = gql `
  query majorities{
    majorities {
      value
      label
    }
  }
`;

export const quorums = gql `
  query quorums{
    quorums 
  }
`;

export const votationTypes = gql `
  query votationTypes{
    votingTypes {
      label
      value
    }
  }
`;