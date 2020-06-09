import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { LoadingSection } from '../../../../displayComponents';


const ShareholdersRequestsPage = ({ council, translate, client }) => {
    const [data, setData] = React.useState(null);
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

        console.log(response);
        setData(response.data.shareholdersRequests);
        setLoading(false);
    })

    React.useEffect(() => {
        getData();
    }, [getData])

    if(loading){
        return <LoadingSection />
    }

    console.log(data);

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
                </div>
            ))}
        </div>
    )
}

export default withApollo(ShareholdersRequestsPage);