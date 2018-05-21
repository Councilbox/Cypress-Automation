import gql from "graphql-tag";

export const censuses = gql`
  query censuses($companyId: Int!, $filters: [FilterInput], $options: OptionsInput){
    censuses(companyId: $companyId, filters: $filters, options: $options){
      list{
        id
        companyId
        censusName
        censusDescription
        defaultCensus
        quorumPrototype
        state
        creatorId
        creationDate
        lastEdit
      }
      total
    }
  }
`;

export const census = gql`
  query census($id: Int!){
    census(id: $id){
      id
      companyId
      censusName
      censusDescription
      defaultCensus
      quorumPrototype
      state
      creatorId
      creationDate
      lastEdit
    }
  }
`;

export const censusParticipants = gql`
  query censusParticipants($censusId: Int!, $filters: [FilterInput], $options: OptionsInput){
    censusParticipants(censusId: $censusId, filters: $filters, options: $options){
      list{
        id
        name
        surname
        position
        email
        phone
        dni
        type
        delegateId
        numParticipations
        socialCapital
        uuid
        delegateUuid
        position
        language
        city
        personOrEntity
        representative {
            id
            name
            surname
            dni
            email
            phone
            position
            language
        }
      }
      total

    }
  }
`;


export const addCensusParticipant = gql`
  mutation addCensusParticipant($participant: CensusParticipantInput!, $representative: CensusParticipantInput){
    addCensusParticipant(participant: $participant, representative: $representative){
      id
    }
  }
`;

export const updateCensusParticipant = gql`
  mutation updateCensusParticipant($participant: CensusParticipantInput!, $representative: CensusParticipantInput){
    updateCensusParticipant(participant: $participant, representative: $representative){
      id
    }
  }
`;

export const createCensus = gql`
  mutation createCensus($census: CensusInput!){
    createCensus(census: $census){
      id
    }
  }
`;

export const deleteCensus = gql`
  mutation deleteCensus($censusId: Int!){
    deleteCensus(censusId: $censusId){
      id
    }
  }
`;

export const setDefaultCensus = gql`
  mutation setDefaultCensus($censusId: Int!){
    setDefaultCensus(censusId: $censusId){
      id
    }
  }
`;

export const cloneCensus = gql`
  mutation cloneCensus($census: CensusInput!){
    cloneCensus(census: $census){
      id
    }
  }
`;