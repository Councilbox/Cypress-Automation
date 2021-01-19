import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { BasicButton, LoadingSection } from '../../../../displayComponents';
import { moment } from '../../../../containers/App';
import { Table, TableHead, TableCell, TableRow, TableBody } from 'material-ui';


const CommenWallList = ({ council, translate, client }) => {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: gql`
                query ParticipantComments($councilId: Int!){
                    participantComments(councilId: $councilId){
                        id
                        participantId
                        text
                        date
                        author {
                            name
                            participantId
                            surname
                            position
                            id
                        }
                    }
                }
            `,
            variables: {
                councilId: council.id
            }
        });

        setData(response.data);
        setLoading(false);
    }, [council.id])

    React.useEffect(() => {
        getData();
    }, [getData])


    if(loading){
        return <LoadingSection />;
    }

    if(data.participantComments.length === 0) {
        return translate.no_results;
    }

    return (
        <div style={{ width: '95%', margin: 'auto', paddingBottom: '5em', marginTop: '1em'}}>
            {data.participantComments.length === 0 ?
                translate.no_results
            :
                <>
                    <Table>
                        <TableHead>
                            <TableCell>
                                {translate.participant_data}
                            </TableCell>
                            <TableCell>
                                {translate.content}
                            </TableCell>
                            <TableCell>
                                {translate.date}
                            </TableCell>
                        </TableHead>
                        <TableBody>
                            {data.participantComments.map(comment => (
                                <TableRow key={`comment_${comment.id}`}>
                                    <TableCell>
                                        {comment.author.name} {comment.author.surname || ''}
                                    </TableCell>
                                    <TableCell>
                                        <div dangerouslySetInnerHTML={{ __html: comment.text }}></div>
                                    </TableCell>
                                    <TableCell>
                                        {moment(comment.date).format('LLL')}
                                    </TableCell>
                                    
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </>
            }
         </div>
    )
}

export default withApollo(CommenWallList);