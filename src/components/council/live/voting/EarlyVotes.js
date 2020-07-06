import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { TableRow, TableCell, withStyles, Card, CardContent, Tooltip } from "material-ui";
import withSharedProps from '../../../../HOCs/withSharedProps';
import { PARTICIPANT_STATES, AGENDA_TYPES } from '../../../../constants';
import { Table, PaginationFooter } from '../../../../displayComponents';
import { showNumParticipations, getPercentage } from '../../../../utils/CBX';
import VotingValueIcon from './VotingValueIcon';
import { isMobile } from '../../../../utils/screen';


const EarlyVotes = ({ agenda, translate, client, ...props }) => {
    const [earlyVotes, setEarlyVotes] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: gql`
                query EarlyVotes($agendaId: Int!){
                    earlyVotes(agendaId: $agendaId){
                        participantId
                        value
                        numParticipations
                        author {
                            name
                            surname
                            state
                            numParticipations
                            representative {
                                name
                                numParticipations
                                surname
                                state
                            }
                        }
                    }
                }
            `,
            variables: {
                agendaId: agenda.id
            }
        });

        console.log(response);
        setEarlyVotes(response.data.earlyVotes);
        setLoading(false);
    }, [agenda.id])

    React.useEffect(() => {
        getData();
    }, [getData])

    const printPercentage = value => {
		//This companies work based on coefficients
		if(props.company.type === 10){
			return '';
		}

		return `(${getPercentage(value, props.recount.partTotal)}%)`
    }
    
    const renderVotingMenu = vote => (
		<React.Fragment>
			{agenda.subjectType === AGENDA_TYPES.PRIVATE_VOTING || agenda.subjectType === AGENDA_TYPES.CUSTOM_PRIVATE || props.council.councilType === 3 ?
                translate.has_voted
				:
				<VotingValueIcon
                    vote={vote.value}
                />
			}
		</React.Fragment>
	)


    const renderParticipantInfo = vote => {
		return (
			<div style={{ minWidth: '7em' }}>
				<span style={{ fontWeight: '700' }}>
					{!!vote.authorRepresentative ?
						<React.Fragment>
							{`${vote.authorRepresentative.name} ${vote.authorRepresentative.surname || ''} ${vote.authorRepresentative.position ? ` - ${vote.authorRepresentative.position}` : ''}`}
						</React.Fragment>
						:
						<React.Fragment>
							{`${vote.author.name} ${vote.author.surname || ''} ${vote.author.position ? ` - ${vote.author.position}` : ''}`}
							{vote.author.voteDenied &&
								<Tooltip title={vote.author.voteDeniedReason}>
									<span style={{color: 'red', fontWeight: '700'}}>
										(Voto denegado)
									</span>
								</Tooltip>
							}
						</React.Fragment>

					}
				</span>
				<React.Fragment>
					{!!vote.delegatedVotes &&
						vote.delegatedVotes.filter(vote => vote.author.state !== PARTICIPANT_STATES.REPRESENTATED).map(delegatedVote => (
							<React.Fragment key={`delegatedVote_${delegatedVote.id}`}>
								<br />
								{delegatedVote.fixed &&
									<Tooltip
										//title={getTooltip(delegatedVote.vote)}
									>
										<VotingValueIcon
											vote={delegatedVote.vote}
											fixed
										/>
									</Tooltip>
								}
								{`${delegatedVote.author.name} ${delegatedVote.author.surname || ''} ${delegatedVote.author.position ? ` - ${delegatedVote.author.position}` : ''} (Ha delegado su voto) ${isMobile? ` - ${showNumParticipations(delegatedVote.author.numParticipations, props.company)} ` : ''}`}
								{delegatedVote.author.voteDenied &&
									<Tooltip title={delegatedVote.author.voteDeniedReason}>
										<span style={{color: 'red', fontWeight: '700'}}>
											(Voto denegado)
										</span>
									</Tooltip>
								}
							</React.Fragment>
						))
					}
				</React.Fragment>
			</div>
		)

	}


    if(loading){
        return '';
    }


    return (
        <>
            <Table
                style={{ width: '100%', }}
                forceMobileTable={true}
                headers={[
                    { name: '' },
                    { name: translate.participant_data },
                    { name: translate.votes }
                ]}
            >
                {earlyVotes.map(vote => (
                    <TableRow key={`vote_${vote.id}`}>
                        <TableCell style={{ fontSize: '0.95em' }}>
                            {vote.author.numParticipations === 0 && vote.representing && vote.representing[0].author.numParticipations === 0 ?
                                '-'
                                :
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection:
                                            "row",
                                        alignItems: "center",
                                    }}
                                >
                                    {vote.delegateId && vote.author.state !== PARTICIPANT_STATES.REPRESENTATED ?
                                        translate.customer_delegated
                                        :
                                        <React.Fragment>
                                            {renderVotingMenu(vote)}
                                        </React.Fragment>
                                    }
                                </div>
                            }
                        </TableCell>
                        <TableCell style={{ fontSize: '0.95em' }}>
                            {renderParticipantInfo(vote)}
                        </TableCell>
                        <TableCell style={{ fontSize: '0.95em' }}>
                            {(vote.author.state !== PARTICIPANT_STATES.REPRESENTATED)?
                                (vote.author.numParticipations > 0 ? `${showNumParticipations(vote.author.numParticipations, props.company)} ${printPercentage(vote.author.numParticipations)}` : 0)
                            :
                                vote.authorRepresentative.numParticipations > 0? `${showNumParticipations(vote.authorRepresentative.numParticipations, props.company)} ${printPercentage(vote.authorRepresentative.numParticipations)}` : '-'
                            }
                        </TableCell>
                    </TableRow>
                ))}
            </Table>
            <div
                style={{
                    width: "90%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "1em",
                    paddinRight: "10em"
                }}
            >
                <PaginationFooter
                    page={props.page}
                    translate={translate}
                    length={earlyVotes.length}
                    total={earlyVotes.length}
                    limit={10}
                    changePage={props.changePage}
                />
            </div>
        </>
    )
}

export default withApollo(withSharedProps()(EarlyVotes))