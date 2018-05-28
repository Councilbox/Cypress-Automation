import gql from "graphql-tag";

export const addAgenda = gql `
  mutation addAgenda($agenda: AgendaInput) {
    addAgenda(agenda: $agenda) {
      id
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

export const agendaVotings = gql`
  query agendaVotings($agendaId: Int!, $filters: [FilterInput], $authorFilters: AuthorFilter, $options: OptionsInput){
    agendaVotings(agendaId: $agendaId, filters: $filters, authorFilters: $authorFilters, options: $options){
      list{
        id
        author{
          name
          surname
          numParticipations
          socialCapital
          position
          delegatedVotes{
            name
            surname
            dni
            position
            socialCapital
            numParticipations
          }
        }
        authorRepresentative{
          name
          surname
          position
          dni
          delegatedVotes{
            name
            surname
            dni
            position
            socialCapital
            numParticipations
          }
        }
        participantId
        agendaId
        presentVote
        numParticipations
        comment
        vote
      }
      total
    }
  }
`;


export const updateAgendaVoting = gql`
  mutation updateAgendaVoting($agendaVoting: AgendaVotingInput){
    updateAgendaVoting(agendaVoting: $agendaVoting){
      success
      message
    }
  }
`;

export const agendaComments = gql`
query agendaComments($agendaId: Int!, $filters: [FilterInput], $authorFilters: AuthorFilter, $options: OptionsInput){
  agendaComments(agendaId: $agendaId, filters: $filters, authorFilters: $authorFilters, options: $options){
    list{
      id
      author{
        name
        surname
        numParticipations
        position
      }
      presentVote
      numParticipations
      comment
      vote
    }
    total
  }
}
`;