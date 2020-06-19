import React from 'react';
import { showNumParticipations, councilHasSession, hasParticipations } from '../../../../utils/CBX';
import { getSecondary } from '../../../../styles/colors';
import { AlertConfirm, DropDownMenu } from '../../../../displayComponents';
import { usePolling } from '../../../../hooks';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { Table, TableBody, TableHead, TableRow, TableCell, MenuItem, Divider } from 'material-ui';
import FileSaver from 'file-saver';

const QuorumDisplay = ({ council, recount, translate, company }) => {
    const secondary = getSecondary();
    const [modal, setModal] = React.useState(false);

    const councilStarted = () => {
        return (council.state === 20 || council.state === 30) && council.councilStarted == 1;
    }


    return (
        <>
            {council.quorumPrototype === 0 ?
                <b>{`${translate.current_quorum}: ${showNumParticipations(recount.partRightVoting, company)} (${((recount.partRightVoting / (recount.partTotal ? recount.partTotal : 1)) * 100).toFixed(3)}%)${
                    (councilStarted() && council.councilStarted === 1 && councilHasSession(council)) ?
                        ` / ${translate.initial_quorum}: ${
                        council.initialQuorum ? showNumParticipations(council.initialQuorum, company) : showNumParticipations(council.currentQuorum, company)
                        } (${((council.initialQuorum / (recount.partTotal ? recount.partTotal : 1) * 100).toFixed(3))}%)`
                        :
                        ''
                    }`}</b>
                :
                <b>{`${translate.current_quorum}: ${showNumParticipations(recount.socialCapitalRightVoting, company)} (${((recount.socialCapitalRightVoting / (recount.socialCapitalTotal ? recount.socialCapitalTotal : 1)) * 100).toFixed(3)}%)${
                    (councilStarted() && council.councilStarted === 1 && councilHasSession(council)) ?
                        ` / ${translate.initial_quorum}: ${
                        council.initialQuorum ? showNumParticipations(council.initialQuorum, company) : showNumParticipations(council.currentQuorum, company)
                        } (${((council.initialQuorum / (recount.socialCapitalTotal ? recount.socialCapitalTotal : 1) * 100).toFixed(3))}%)`
                        :
                        ''
                    }`}</b>
            }
            <div
                style={{ color: secondary, paddingLeft: '0.6em', cursor: 'pointer' }}
            >
                <i
                    class="fa fa-info"
                    aria-hidden="true"
                    onClick={() => setModal(true)}
                ></i>
            </div>

            {modal &&
                <AlertConfirm
                    title={'Quorum info'}
                    open={modal}
                    bodyText={
                        <QuorumDetails
                            council={council}
                            recount={recount}
                            translate={translate}
                            socialCapital={recount.socialCapitalTotal}
                            totalVotes={recount.partRightVoting}
                        />
                    }
                    buttonCancel={'Cerrar'}
                    cancelAction={() => setModal(false)}
                    requestClose={() => setModal(false)}
                />
            }
        </>
    )
}

const QuorumDetails = withApollo(({ council, translate, recount, totalVotes, socialCapital, client }) => {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const secondary = getSecondary();

    const getPercentage = value => {
        let base = totalVotes;
        if(hasParticipations(council)){
            base = socialCapital;
        }

        return ((value / base) * 100).toFixed(3);
    }

    const copyQuorumTable = () => {
        const html = document.createElement('textarea');
        document.body.appendChild(html);
        html.value = `
            <table>
                <th>
                    <td>
                        ${translate.participants}
                    </td>
                    <td>
                        Participaciones
                    </td>
                    <td>    
                        %                    
                    </td>
                </th>
            </table>
        `;
        html.select();
        document.execCommand('copy');
    }

    const exportToDoc = () => {
        const preHtml = "<!DOCTYPE html type=\"text/html\"><html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta http-equiv='Content-Type' content='text/html;charset=UTF-8'><title>Export HTML To Doc</title></head><body style='font-family: Arial;'>";
        const postHtml = "</body></html>";
        const body = `
            <table>
                <th>
                    <td>
                        ${translate.participants}
                    </td>
                    <td>
                        Participaciones
                    </td>
                    <td>    
                        %                    
                    </td>
                </th>
            </table>
        `
        const html = preHtml+body+postHtml;
        const css = (`\
            <style>\
            body {font-family: Arial; font-size: 12pt;}\
            html {font-family: Arial; font-size: 12pt;}
            div {font-family: Arial; font-size: 12pt;}
            h3 {font-family: Arial; font-size: 12pt;}
            h4 {font-family: Arial; font-size: 12pt;}
            b {font-family: Arial; font-size: 12pt;}
            </style>\
        `);

        let filename = `Quorum - ${council.name}.doc`;
        const blob = new Blob(['\ufeff', css+html], {
            type: 'application/msword'
        });
        FileSaver.saveAs(blob, filename);
    }


    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: gql`
                query ActualQuorumRecount($councilId: Int!){
                    actualQuorumRecount(councilId: $councilId){
                        remote
                        numRemote
                        delegated
                        numDelegated
                        earlyVotes
                        numEarlyVotes
                        present
                        numPresent
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

    console.log(data);


    if(loading){
        return '';
    }

    return (
        <div style={{fontSize: '1em'}}>
            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1em'
            }}>
                <b>{translate.quorum}:</b>

            </div>
            <Table>
                <TableHead>
                    <TableCell>

                    </TableCell>
                    <TableCell>
                        {translate.participants}
                    </TableCell>
                    <TableCell>
                        Participaciones
                    </TableCell>
                    <TableCell>
                        % Capital social
                    </TableCell>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            Total
                        </TableCell>
                        <TableCell>
                            {recount.numRightVoting}
                        </TableCell>
                        <TableCell>
                            {data.total}
                        </TableCell>
                        <TableCell>
                            {getPercentage(data.total)}%
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            {translate.face_to_face}
                        </TableCell>
                        <TableCell>
                            {data.numPresent}
                        </TableCell>
                        <TableCell>
                            {data.present}
                        </TableCell>
                        <TableCell>
                            {getPercentage(data.present)}%
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            {translate.remotes}
                        </TableCell>
                        <TableCell>
                            {data.numRemote}
                        </TableCell>
                        <TableCell>
                            {data.remote}
                        </TableCell>
                        <TableCell>
                            {getPercentage(data.remote)}%
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            {translate.delegated_plural}
                        </TableCell>
                        <TableCell>
                            {data.numDelegated}
                        </TableCell>
                        <TableCell>
                            {data.delegated}
                        </TableCell>
                        <TableCell>
                            {getPercentage(data.delegated)}%
                        </TableCell>
                    </TableRow>
                    {council.statute.canEarlyVote === 1 &&
                        <TableRow>
                            <TableCell>
                                {translate.quorum_early_votes}
                            </TableCell>
                            <TableCell>
                                {data.numEarlyVotes}
                            </TableCell>
                            <TableCell>
                                {data.earlyVotes}
                            </TableCell>
                            <TableCell>
                                {getPercentage(data.earlyVotes)}%
                            </TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
        </div>
    )
})

export default QuorumDisplay;