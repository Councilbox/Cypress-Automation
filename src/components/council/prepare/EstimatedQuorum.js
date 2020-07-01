import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { hasParticipations } from '../../../utils/CBX';
import { usePolling } from '../../../hooks';
import { COUNCIL_TYPES } from '../../../constants';


const EstimatedQuorum = ({ council, translate, client, socialCapital, totalVotes }) => {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const getPercentage = value => {
        let base = totalVotes;
        if(hasParticipations(council)){
            base = socialCapital;
        }

        return ((value / base) * 100).toFixed(3);
    }


    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: gql`
                query EstimatedQuorumRecount($councilId: Int!){
                    estimatedQuorumRecount(councilId: $councilId){
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

        setData(response.data.estimatedQuorumRecount);
        setLoading(false);
    }, [council.id]);

    React.useEffect(() => {
        getData();
    }, [getData]);

    usePolling(getData, 10000);


    if(loading){
        return '';
    }

    //TRADUCCION
    return (
        <div style={{fontSize: '0.9em'}}>
            <b>{translate.quorum_estimated}:</b> {data.total} ({getPercentage(data.total)}%)<br/>
            <b>{translate.face_to_face}:</b> {data.present} ({getPercentage(data.present)}%) | <b>{translate.remotes}:</b> {data.remote} ({getPercentage(data.remote)}%)
            | <b>{translate.delegated_plural}:</b> {data.delegated} ({getPercentage(data.delegated)}%) {
                council.statute.canEarlyVote === 1 &&
                    <>
                        | <b>{council.councilType === COUNCIL_TYPES.BOARD_WITHOUT_SESSION? 'Carta de voto' : translate.quorum_early_votes}:</b> {data.earlyVotes} ({getPercentage(data.earlyVotes)}%)
                    </>
            }
        </div>
    )

}

export default withApollo(EstimatedQuorum);