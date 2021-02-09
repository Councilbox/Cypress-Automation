import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { hasParticipations, showNumParticipations } from '../../../utils/CBX';
import { usePolling } from '../../../hooks';
import { COUNCIL_TYPES } from '../../../constants';


const EstimatedQuorum = ({ council, translate, client, socialCapital, totalVotes, company }) => {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const getPercentage = value => {
        let base = totalVotes;

        if (totalVotes === 0) {
            return '-';
        }

        if (hasParticipations(council)) {
            base = socialCapital;
        }

        return ((value / base) * 100).toFixed(3);
    };


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


    if (loading) {
        return '';
    }

    // TRADUCCION
    return (
        <div style={{ fontSize: '0.9em' }}>
            <b>{translate.quorum_estimated}:</b> {showNumParticipations(data.total, company, council.statute)} ({getPercentage(data.total)}%)<br/>
            <b>{translate.face_to_face}:</b> {showNumParticipations(data.present, company, council.statute)} ({getPercentage(data.present)}%) | <b>{translate.remotes}:</b> {showNumParticipations(data.remote, company, council.statute)} ({getPercentage(data.remote)}%)
            | <b>{translate.delegated_plural}:</b> {showNumParticipations(data.delegated, company, council.statute)} ({getPercentage(data.delegated)}%) {
                council.statute.canEarlyVote === 1
                    && <>
                        | <b>{council.councilType === COUNCIL_TYPES.BOARD_WITHOUT_SESSION ? translate.vote_letter : translate.quorum_early_votes}:</b> {showNumParticipations(data.earlyVotes, company, council.statute)} ({getPercentage(data.earlyVotes)}%)
                    </>
            }
        </div>
    );
};

export default withApollo(EstimatedQuorum);
