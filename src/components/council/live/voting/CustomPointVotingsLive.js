import React from 'react';
import { Grid, GridItem, LoadingSection } from '../../../../displayComponents';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { AGENDA_STATES } from '../../../../constants';
import VotingsTableFiltersContainer from './VotingsTableFiltersContainer';
import CustomAgendaRecount from './CustomAgendaRecount';

const CustomPointVotingsLive = ({ agenda, council, recount, translate, refetch, data: fetchedData, ...props}) => {

    if(fetchedData.loading){
        return <LoadingSection />
    }

    return (
        <div>
            <Grid style={{width: '100%', display: 'flex'}}>
                {agenda.subjectType === 7 && agenda.votingState === AGENDA_STATES.DISCUSSION?
                    <React.Fragment>
                        <div>
                            <div style={{width: '100%', padding: '2em', border: `2px solid gainsboro`}}>
                                {'Por motivos de privacidad en los puntos de votación anónima, el recuento está oculto hasta el cierre de votaciones' /*TRADUCCION*/}
                            </div>
                            <div style={{marginTop: '2em'}}>
                                <VotingsTableFiltersContainer
                                    recount={recount}
                                    translate={translate}
                                    agenda={agenda}
                                />
                            </div>
                        </div>
                    </React.Fragment>
                :
                    <React.Fragment>
                        <CustomAgendaRecount agenda={agenda} />
                        <GridItem xs={12} md={12} lg={12}>
                            <VotingsTableFiltersContainer
                                recount={recount}
                                translate={translate}
                                agenda={agenda}
                            />
                        </GridItem>
                    </React.Fragment>
                }
            </Grid>
        </div>
    )
}

const Votings = ({ votings }) => {
    console.log(votings);

    return (
        <React.Fragment>
            {votings.map(vote => (
                <div style={{padding: '0.3em'}}>
                    {vote.author.name}
                </div>
            ))}
        </React.Fragment>
    )
}


const agendaBallots = gql`
    query AgendaBallots($id: Int!){
        agenda(id: $id){
            ballots {
				id
				value
                weight
				participantId
				itemId
            }
            items {
                id
                value
            }
            votings {
                id
				author {
					id
					name
					surname
					numParticipations
					state
					type
					socialCapital
					position
					delegatedVotes {
						id
						name
						surname
						dni
						position
						socialCapital
						numParticipations
					}
				}
				authorRepresentative {
					id
					participantId
					name
					surname
					type
					position
					dni
					socialCapital
					numParticipations
					delegatedVotes {
						id
						name
						surname
						dni
						type
						position
						socialCapital
						numParticipations
					}
				}
				participantId
				agendaId
				delegateId
				presentVote
				numParticipations
				comment
				vote
            }
        }
    }
`;


export default graphql(agendaBallots, {
    options: props => ({
        variables: {
            id: props.agenda.id
        },
        pollInterval: 5000
    })
})(CustomPointVotingsLive);