import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { LoadingSection } from '../../../../displayComponents';
import { usePolling } from '../../../../hooks';
import ApproveRequestButton from './ApproveRequestButton';
import ShareholderEditor from './ShareholderEditor';


const ShareholdersRequestsPage = ({ council, translate, client }) => {
    const [data, setData] = React.useState(null);
    const [modal, setModal] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: gql`
                query ShareholdersRequest($councilId: Int!){
                    shareholdersRequests(councilId: $councilId){
                        councilId
                        id
                        data
                    }
                }
            `,
            variables: {
                councilId: council.id
            }
        });
        setData(response.data.shareholdersRequests);
        setLoading(false);
    }, [council.id])

    usePolling(getData, 12000);

    React.useEffect(() => {
        getData();
    }, [getData])

    if(loading){
        return <LoadingSection />
    }

    console.log(data, modal);

    return (
        <div>
            {data.map(request => (
                <div key={`request_${request.id}`}>
                    {`${request.data.name} - ${request.data.email}`}
                    {request.data.attachments && request.data.attachments.map(attachment => (
                        <div>
                            {attachment.filename}
                        </div>
                    ))}
                    <ApproveRequestButton
                        request={request}
                        translate={translate}
                    />
                </div>
            ))}
        </div>
    )
}

export default withApollo(ShareholdersRequestsPage);