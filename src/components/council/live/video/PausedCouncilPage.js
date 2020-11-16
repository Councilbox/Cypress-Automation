import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { usePolling } from '../../../../hooks';
import { getPrimary } from '../../../../styles/colors';


const PausedCouncilPage = ({ council, client, translate }) => {
    const [message, setMessage] = React.useState('');
    const primary = getPrimary();

    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: gql`
                query CouncilPausedMessage($councilId: Int!){
                    councilPausedMessage(councilId: $councilId)
                }
            `,
            variables: {
                councilId: council.id
            }
        });
        setMessage(response.data.councilPausedMessage);
    }, [council.id]);

    React.useEffect(() => {
        getData();
    }, [getData])

    usePolling(getData, 12000);


    return (
        <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{ textAlign: 'center' }}>
                <h5 style={{ color: primary, fontWeight: '700' }}>{translate.council_paused.toUpperCase()}</h5>
                <div
                    dangerouslySetInnerHTML={{ __html: message }}
                ></div>
            </div>
        </div>
    )
}

export default withApollo(PausedCouncilPage);
