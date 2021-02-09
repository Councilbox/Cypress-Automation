import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { TableRow, TableCell, withStyles, Card, CardContent, Tooltip } from 'material-ui';
import withSharedProps from '../../../../HOCs/withSharedProps';
import { PARTICIPANT_STATES, AGENDA_TYPES } from '../../../../constants';
import { Table, PaginationFooter } from '../../../../displayComponents';
import { showNumParticipations, getPercentage } from '../../../../utils/CBX';
import VotingValueIcon from './VotingValueIcon';
import { isMobile } from '../../../../utils/screen';


const EarlyVotes = ({ agenda, translate, client, ...props }) => {
    const [earlyVotes, setEarlyVotes] = React.useState(null);
    const [recount, setRecount] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: gql`
                query EarlyVotes($agendaId: Int!){
                    earlyVotes(agendaId: $agendaId){
                        id
                        participantId
                        value
                        numParticipations
                        author {
                            id
                            name
                            surname
                            state
                            numParticipations
                            delegatedVotes {
                                id
                                name
                                surname
                                state
                                numParticipations
                            }
                            representative {
                                id
                                name
                                numParticipations
                                surname
                                state
                            }
                        }
                    }
                    earlyVotesRecount(agendaId: $agendaId){
                        positive
                        negative
                        abstention
                        noVote
                        total
                    }
                }
            `,
            variables: {
                agendaId: agenda.id
            }
        });

        setEarlyVotes(response.data.earlyVotes);
        setRecount(response.data.earlyVotesRecount);
        setLoading(false);
    }, [agenda.id]);

    React.useEffect(() => {
        getData();
    }, [getData]);

    const printPercentage = value => {
		// This companies work based on coefficients
		if (props.company.type === 10) {
			return '';
		}

		return `(${getPercentage(value, props.recount.partTotal)}%)`;
    };

    const renderVotingMenu = vote => (
		<React.Fragment>
			{agenda.subjectType === AGENDA_TYPES.PRIVATE_VOTING || agenda.subjectType === AGENDA_TYPES.CUSTOM_PRIVATE || props.council.councilType === 3 ?
                translate.has_voted
				:				<VotingValueIcon
                    vote={vote.value}
                />
			}
		</React.Fragment>
	);


    const renderParticipantInfo = vote => (
			<div style={{ minWidth: '7em' }}>
				<span style={{ fontWeight: '700' }}>
                    <React.Fragment>
                        {`${vote.author.name} ${vote.author.surname || ''} ${vote.author.position ? ` - ${vote.author.position}` : ''}`}
                        {vote.author.voteDenied
                            && <Tooltip title={vote.author.voteDeniedReason}>
                                <span style={{ color: 'red', fontWeight: '700' }}>
                                    (Voto denegado)
                                </span>
                            </Tooltip>
                        }
                    </React.Fragment>

					{!!vote.author.representative
						&& <React.Fragment>
                            <br/>
							{`${translate.represented_by} ${vote.author.representative.name} ${vote.author.representative.surname || ''} ${vote.author.representative.position ? ` - ${vote.author.representative.position}` : ''}`}
                        </React.Fragment>
                    }
				</span>
                <React.Fragment>
					{!!vote.author.delegatedVotes
						&& vote.author.delegatedVotes.filter(vote => vote.state !== PARTICIPANT_STATES.REPRESENTATED).map(delegatedVote => (
							<React.Fragment key={`delegatedVote_${delegatedVote.id}`}>
                                <br/>
								{`${delegatedVote.name} ${delegatedVote.surname || ''} ${delegatedVote.position ? ` - ${delegatedVote.position}` : ''} (Ha delegado su voto) ${isMobile ? ` - ${showNumParticipations(delegatedVote.numParticipations, props.company)} ` : ''}`}
							</React.Fragment>
						))
					}
				</React.Fragment>
			</div>
		);


    if (loading) {
        return '';
    }


    return (
        <>
            <Table
                forceMobileTable={true}
                headers={[
                    { name: translate.in_favor },
                    { name: translate.against },
                    { name: translate.abstentions }
                ]}
            >
                <TableRow>
                    <TableCell>
                        {showNumParticipations(recount.positive, props.company, props.council.statute)}
                    </TableCell>
                    <TableCell>
                        {showNumParticipations(recount.negative, props.company, props.council.statute)}
                    </TableCell>
                    <TableCell>
                        {showNumParticipations(recount.abstention, props.company, props.council.statute)}
                    </TableCell>
                </TableRow>
            </Table>

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
                            {vote.author.numParticipations === 0 && vote.represented && vote.represented[0].author.numParticipations === 0 ?
                                '-'
                                : <div
                                    style={{
                                        display: 'flex',
                                        flexDirection:
                                            'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    {vote.delegateId && vote.author.state !== PARTICIPANT_STATES.REPRESENTATED ?
                                        translate.customer_delegated
                                        : <React.Fragment>
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
                            {vote.numParticipations === 0 ?
                                translate.cant_vote_this_point
                            : <>
                                    {(vote.author.numParticipations > 0 ? `${showNumParticipations(vote.author.numParticipations, props.company, props.council.statute)} ${printPercentage(vote.author.numParticipations)}` : 0)}
                                    {(vote.author.state == PARTICIPANT_STATES.REPRESENTATED)
                                        && <>
                                            <br/>
                                            {vote.author.representative.numParticipations > 0 ? `${showNumParticipations(vote.author.representative.numParticipations, props.company, props.council.statute)} ${printPercentage(vote.author.representative.numParticipations)}` : '-'}
                                        </>
                                    }
                                    {!!vote.author.delegatedVotes
                                        && vote.author.delegatedVotes.filter(vote => vote.state !== PARTICIPANT_STATES.REPRESENTATED).map(delegatedVote => (
                                            <React.Fragment key={`delegatedVote_${delegatedVote.id}`}>
                                                <br/>
                                                {`${showNumParticipations(delegatedVote.numParticipations, props.company, props.council.statute)} ${printPercentage(delegatedVote.numParticipations)}`}
                                            </React.Fragment>
                                        ))
                                    }
                                </>
                            }
                        </TableCell>
                    </TableRow>
                ))}
            </Table>
            <div
                style={{
                    width: '90%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '1em',
                    paddinRight: '10em'
                }}
            >
                {/* <PaginationFooter
                    page={props.page}
                    translate={translate}
                    length={earlyVotes.length}
                    total={earlyVotes.length}
                    changePage={props.changePage}
                /> */}
            </div>
        </>
    );
};

export default withApollo(withSharedProps()(EarlyVotes));
