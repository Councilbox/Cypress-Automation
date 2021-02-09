import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { Table, TableHead, TableCell, TableRow, TableBody, MenuItem } from 'material-ui';
import { DropDownMenu, LoadingSection } from '../../../../displayComponents';
import { moment } from '../../../../containers/App';
import { getSecondary } from '../../../../styles/colors';
import { useDownloadHTMLAsPDF } from '../../../../hooks';


const CommenWallList = ({ council, translate, client }) => {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const { downloadHTMLAsPDF, downloading } = useDownloadHTMLAsPDF();
    const secondary = getSecondary();

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
    }, [council.id]);

    React.useEffect(() => {
        getData();
    }, [getData]);

    const downloadPDF = async () => {
        await downloadHTMLAsPDF({
            name: `${translate.council_comments}_${council.id}`,
            companyId: council.companyId,
            html: document.getElementById('toDownload').innerHTML
        });
    };


    if (loading) {
        return <LoadingSection />;
    }

    if (data.participantComments.length === 0) {
        return translate.no_results;
    }

    return (
        <div style={{ width: '95%', margin: 'auto', paddingBottom: '5em', marginTop: '1em' }}>
            {data.participantComments.length === 0 ?
                translate.no_results
            : <>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                        <DropDownMenu
                            color="transparent"
                            id={'user-menu-trigger'}
                            loading={downloading}
                            loadingColor={secondary}
                            text={translate.to_export}
                            textStyle={{ color: secondary }}
                            type="flat"
                            buttonStyle={{ border: `1px solid ${secondary}` }}
                            icon={
                                <i className="fa fa-download" style={{
                                    fontSize: '1em',
                                    color: secondary,
                                    marginLeft: '0.3em'
                                }}
                                />
                            }
                            items={
                                <React.Fragment>
                                    <MenuItem onClick={downloadPDF}>
                                        <div
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'space-between'
                                            }}
                                        >
                                            <i className="fa fa-file-pdf-o" style={{
                                                fontSize: '1em',
                                                color: secondary,
                                                marginLeft: '0.3em'
                                            }}
                                            />
                                            <span style={{ marginLeft: '2.5em', marginRight: '0.8em' }}>
                                                PDF
                                            </span>
                                        </div>
                                    </MenuItem>
                                </React.Fragment>
                            }
                        />
                    </div>
                    <div id="toDownload">
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
                    </div>
                </>
            }
         </div>
    );
};

export default withApollo(CommenWallList);
