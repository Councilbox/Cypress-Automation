import React from 'react';
import { Grid, GridItem, LoadingSection } from '../../../../displayComponents';
import * as CBX from '../../../../utils/CBX';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { AGENDA_STATES } from '../../../../constants';
import VotingsTableFiltersContainer from './VotingsTableFiltersContainer';
import CustomAgendaRecount from './CustomAgendaRecount';
import CustomAgendaManualVotings from './CustomAgendaManualVotings';

const CustomPointVotingsLive = ({ agenda, council, recount, translate, refetch, data: fetchedData, ...props}) => {

    if(fetchedData.loading){
        return <LoadingSection />
    }

    return (
        <div>
            <Grid style={{width: '100%', display: 'flex'}}>
                
                    <CustomAgendaRecount agenda={agenda} />
                
                {((CBX.canEditPresentVotings(agenda) && CBX.agendaVotingsOpened(agenda) && council.councilType !== 3) || (council.councilType === 3 && agenda.votingState === 4)) &&
                    <CustomAgendaManualVotings agenda={agenda} translate={translate} />
				}

                <GridItem xs={12} md={12} lg={12}>
                    <VotingsTableFiltersContainer
                        recount={recount}
                        council={council}
                        translate={translate}
                        agenda={agenda}
                    />
                </GridItem>
            </Grid>
        </div>
    )
}

const Votings = ({ votings }) => {
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