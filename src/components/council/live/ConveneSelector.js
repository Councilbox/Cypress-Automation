import React from 'react';
import { DateWrapper } from '../../../displayComponents';
import * as CBX from '../../../utils/CBX';
import QuorumWrapper from '../quorum/QuorumWrapper';
import { Card } from 'material-ui';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { usePolling } from '../../../hooks';

const ActualQuorum = withApollo(({ council, translate, client, socialCapital, totalVotes }) => {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const getPercentage = value => {
        let base = totalVotes;
        if(CBX.hasParticipations(council)){
            base = socialCapital;
        }

        return ((value / base) * 100).toFixed(3);
    }


    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: gql`
                query ActualQuorumRecount($councilId: Int!){
                    actualQuorumRecount(councilId: $councilId){
                        remote
                        delegated
                        earlyVotes
                        present
                        total
                    }
                }
            `,
            variables: {
                councilId: council.id
            }
        });

        setData(response.data.actualQuorumRecount);
        setLoading(false);
    }, [council.id]);

    React.useEffect(() => {
        getData();
    }, [getData]);

    usePolling(getData, 10000);


    if(loading){
        return '';
    }

    return (
        <div style={{fontSize: '1em'}}>
            <b>{translate.quorum}:</b> {data.total} ({getPercentage(data.total)}%)<br/>
            <b>{translate.face_to_face}:</b> {data.present} ({getPercentage(data.present)}%) | <b>{translate.remotes}:</b> {data.remote} ({getPercentage(data.remote)}%)
            | <b>{translate.delegated_plural}:</b> {data.delegated} ({getPercentage(data.delegated)}%) {
                council.statute.canEarlyVote === 1 &&
                    <>
                        | <b>{translate.quorum_early_votes}:</b> {data.earlyVotes} ({getPercentage(data.earlyVotes)}%)
                    </>
            }
        </div>
    )

})


const ConveneSelector = ({ translate, council, recount, convene, changeConvene }) => {
    const renderParticipationsText = () => {
        return `${recount.socialCapitalRightVoting} (${((recount.socialCapitalRightVoting / recount.socialCapitalTotal) * 100).toFixed(3)}%) ${translate.social_capital.toLowerCase()}`
    }

    return (
        <React.Fragment>
            <Card style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: '0.8em',
                cursor: 'pointer',
                fontSize: '0.9rem',
                backgroundColor: convene === 1 && 'gainsboro',
                outline: 'none'
            }}
                elevation={convene === 1 ? 0 : 1}
                tabIndex="0"
                onClick={() => changeConvene(1)}
            >
                <span style={{ fontWeight: '700' }}>{`${translate.first_call} ${' '}`}</span>
                <DateWrapper date={council.dateStart} format="DD/MM/YYYY HH:mm" />
                <QuorumWrapper council={council} translate={translate} recount={recount} />
            </Card>
            {CBX.hasSecondCall(council.statute) &&
                <Card
                    style={{
                        width: '100%',
                        display: 'flex',
                        cursor: 'pointer',
                        flexDirection: 'column',
                        padding: '0.8em',
                        fontSize: '0.9rem',
                        marginTop: '0.5em',
                        outline: 'none',
                        backgroundColor: convene !== 1 && 'gainsboro'
                    }}
                    elevation={convene === 1 ? 1 : 0}
                    tabIndex="0"
                    onClick={() => changeConvene(2)}
                >
                    <span style={{ fontWeight: '700' }}>{`${translate.second_call} ${' '}`}</span>
                    <DateWrapper date={council.dateStart2NdCall} format="DD/MM/YYYY HH:mm" />
                    <QuorumWrapper council={council} translate={translate} recount={recount} secondCall={true} />
                </Card>
            }
            <div style={{ fontSize: '0.85em', marginTop: '0.8em' }}>
                <ActualQuorum
                    council={council}
                    translate={translate}
                    totalVotes={recount.partTotal}
                    socialCapital={recount.socialCapitalTotal}
                />
                <div>
                    {`${translate.council_will_be_started} `}
                    <DateWrapper date={Date.now()} format="LLL" />
                    <div>
                        {CBX.hasSecondCall(council.statute) ?
                            convene === 1 ?
                                `${translate['1st_call']} ${
                                council.statute.firstCallQuorumType !== -1 ?
                                    `${translate.with_current_quorum} ${
                                    CBX.hasParticipations(council) ?
                                        renderParticipationsText()
                                        :
                                        `${recount.numRightVoting} ${translate.participants.toLowerCase()}`
                                    }`
                                    :
                                    ''
                                }`

                                :
                                `${translate['2nd_call']} ${
                                council.statute.secondCallQuorumType !== -1 ?
                                    `${translate.with_current_quorum} ${
                                        CBX.hasParticipations(council) ?
                                        renderParticipationsText()
                                        :
                                        `${recount.numRightVoting} ${translate.participants.toLowerCase()}`
                                    }`
                                    :
                                    ''
                                }`
                            :
                            `${translate.with_current_quorum} ${
                                CBX.hasParticipations(council) ?
                                renderParticipationsText()
                                :
                                `${recount.numRightVoting} ${translate.participants.toLowerCase()}`
                            }`
                        }
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default ConveneSelector;