import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { usePolling } from '../../../../hooks';
import { getPrimary } from '../../../../styles/colors';
import pausedImg from '../../../../assets/img/paused.png';


const PausedCouncilPage = ({ council, client, translate, heightImg = '15em' }) => {
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
    }, [getData]);

    usePolling(getData, 12000);


    return (
        <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            backgroundColor: 'white',
            display: 'flex',
            overflow: 'auto',
            margin: 'auto',
            flexDirection: 'column'
        }}>
            <div style={{ margin: 'auto', textAlign: 'center' }}>
                <h5 style={{ color: primary, fontWeight: '700' }}>{translate.council_paused.toUpperCase()}</h5>
                <div
                    dangerouslySetInnerHTML={{ __html: message }}
                ></div>
                <img src={pausedImg} style={{ height: heightImg, width: 'auto', marginLeft: '7%', marginTop: '0.6em' }} alt="Council paused img" />
            </div>
        </div>
    );
};

export default withApollo(PausedCouncilPage);
