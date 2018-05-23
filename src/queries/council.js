import gql from "graphql-tag";

export const addAgenda = gql `
  mutation addAgenda($councilID: Int!) {
    council(id: $councilID) {
      id
       attachments {
        councilId
        filename
        filesize
        filetype
        id
      }
    }
  }
`;

export const removeAgenda = gql`
  mutation removeAgenda($councilId: Int!, $agendaId: Int!){
    removeAgenda(councilId: $councilId, agendaId: $agendaId){
      id
    }
  }
`;

export const updateAgendas = gql`
  mutation updateAgendas($agendaList: [AgendaInput]){
    updateAgendas(agendaList: $agendaList){
      abstentionManual
      abstentionVotings
      agendaSubject
      comment
      councilId
      currentRemoteCensus
      dateEnd
      dateEndVotation
      dateStart
      dateStartVotation
      description
      id
      majority
      majorityDivider
      majorityType
      negativeManual
      negativeVotings
      noParticipateCensus
      noVoteManual
      noVoteVotings
      numAbstentionManual
      numAbstentionVotings
      numCurrentRemoteCensus
      numNegativeManual
      numNegativeVotings
      numNoParticipateCensus
      numNoVoteManual
      numNoVoteVotings
      numPositiveManual
      numPositiveVotings
      numPresentCensus
      numRemoteCensus
      numTotalManual
      numTotalVotings
      orderIndex
      pointState
      positiveManual
      positiveVotings
      presentCensus
      remoteCensus
      socialCapitalCurrentRemote
      socialCapitalNoParticipate
      socialCapitalPresent
      socialCapitalRemote
      sortable
      subjectType
      totalManual
      totalVotings
      votingState
    }
  }
`;


export const updateAgenda = gql`
  mutation updateAgenda($agenda: AgendaInput){
    updateAgenda(agenda: $agenda){
      id
    }
  }
`;