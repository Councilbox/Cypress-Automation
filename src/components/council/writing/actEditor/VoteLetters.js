import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { Card } from 'material-ui';
import { LoadingSection } from '../../../../displayComponents';
import { moment } from '../../../../containers/App';
import DownloadParticipantVoteLetter from '../../prepare/DownloadParticipantVoteLetter';


const DelegationDocuments = ({ council, translate, client }) => {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: gql`
                query CouncilVoteLetters($councilId: Int!){
                    councilVoteLetters(councilId: $councilId){
                        list {
                            date
                            signer {
                                id
                                name
                                surname
                            }
                            participant {
                                id
                                name
                                surname
                            }
                        }
                        total
                        totalShares
                        quorum
                    }
                }
            `,
            variables: {
                councilId: council.id
            }
        });

        setData(response.data.councilVoteLetters);
        setLoading(false);
    }, [council.id]);

    React.useEffect(() => {
        getData();
    }, [getData]);

    return (
        <div style={{
 width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column'
}}>
            {loading ?
                <LoadingSection />
            : <>
                    <div>
                        {translate.number_of_letters_issued} {data.total} / {translate.participation_number}: {data.totalShares} ({((data.totalShares / data.quorum) * 100).toFixed(2)}%)
                    </div>
                    {data.list.map(item => (
                        <Card key={item.participant.id} style={{ marginTop: '1em', width: '70%', padding: '0.6em' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexGrow: 1 }}>
                                <div>
                                    <span style={{ fontWeight: '700' }}>{translate.participant}:</span>
                                        {` ${item.participant.name} ${item.participant.surname || ''}`}
                                    <br/>
                                    {item.participant.id !== item.signer.id
                                        && <>
                                            <br/>
                                            <span style={{ fontWeight: '700' }}>{translate.signed}:</span>
                                            {` ${item.signer.name} ${item.signer.surname || ''}, ${moment(item.date).format('LLL')}`}
                                        </>
                                    }
                                </div>
                                <div>
                                    <DownloadParticipantVoteLetter
                                        participantId={item.participant.id}
                                        participant={item.participant}
                                        translate={translate}
                                    />
                                </div>
                            </div>
                        </Card>
                    ))}
                </>
            }
        </div>
    );
};

export default withApollo(DelegationDocuments);
