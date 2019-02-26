import React from 'react';
import { Grid, GridItem, LoadingSection } from '../../../../displayComponents';
import { Pie, Polar, HorizontalBar } from 'react-chartjs-2';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { CUSTOM_AGENDA_VOTING_TYPES, AGENDA_STATES } from '../../../../constants';
import VotingsTableFiltersContainer from './VotingsTableFiltersContainer';

const CustomPointVotingsLive = ({ agenda, council, recount, translate, refetch, data: fetchedData, ...props}) => {
    const data = formatDataFromAgenda(agenda);

    console.log(fetchedData);

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
                        <GridItem lg={4} md={6} xs={12}>
                            <HorizontalBar
                                data={data}
                                height={120}
                                width={120}
                                options={{
                                    maintainAspectRatio: false
                                }}
                            />
                        </GridItem>
                        <GridItem lg={8} md={6} xs={12}>
                            {agenda.items.map(item => (
                                <div key={`custom_item_${item.id}`}>
                                    {`${item.value}: Votos ${agenda.ballots.filter(ballot => ballot.itemId === item.id).length}`}
                                </div>
                            ))}

                        </GridItem>
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

const formatDataFromAgenda = agenda => {
    const labels = agenda.items.map(item => item.value);
    const colors = ['#E8B745', '#D1DE3B', '#6AD132', '#2AC26D', '#246FB0', '#721E9C', '#871A1C', '#6EA85D', '#9DAA49', '#CDA645']

    const dataSet = agenda.items.map(item => agenda.ballots.filter(ballot => ballot.itemId === item.id).length);

    const data = {
        labels,
        datasets: [{
            label: 'Votaciones',
            data: dataSet,
            backgroundColor: colors,
            hoverBackgroundColor: colors
        }]
    }

    return data;
}


const agendaBallots = gql`
    query AgendaBallots($id: Int!){
        agenda(id: $id){
            ballots {
				id
				value
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