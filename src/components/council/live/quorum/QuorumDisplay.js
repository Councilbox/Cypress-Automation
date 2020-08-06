import React from 'react';
import { showNumParticipations, councilHasSession, hasParticipations, hasVotation } from '../../../../utils/CBX';
import { getSecondary } from '../../../../styles/colors';
import { AlertConfirm, DropDownMenu } from '../../../../displayComponents';
import { usePolling } from '../../../../hooks';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { Table, TableBody, TableHead, TableRow, TableCell, MenuItem, Divider } from 'material-ui';
import FileSaver from 'file-saver';
import { SERVER_URL } from '../../../../config';
import { moment } from '../../../../containers/App';
import { COUNCIL_TYPES } from '../../../../constants';



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
                            company={company}
                            translate={translate}
                            socialCapital={recount.socialCapitalTotal}
                            totalVotes={recount.partRightVoting}
                        />
                    }
                    buttonCancel={translate.close}
                    cancelAction={() => setModal(false)}
                    requestClose={() => setModal(false)}
                />
            }
        </>
    )
}

export const QuorumDetails = withApollo(({ council, renderVotingsTable, agendas = [], company, translate, recount, totalVotes, socialCapital, client }) => {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const secondary = getSecondary();

    const getPercentage = value => {
        let base = totalVotes;
        if (hasParticipations(council)) {
            base = socialCapital;
        }

        return ((value / base) * 100).toFixed(3);
    }

    const getVotingPercentage = value => {
        return ((value / totalVotes) * 100).toFixed(3);
    }

    const downloadPDF = async () => {
        const html = document.getElementById("quorumTable").innerHTML;
        const response = await fetch(`${SERVER_URL}/pdf/build`, {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                html,
                companyId: council.companyId
            })
        });

        const blob = await response.blob();

        FileSaver.saveAs(blob, `Quorum_${council.name.replace(/\s/g, '_')}_${moment().format('DD/MM/YYYY_hh_mm_ss')}.pdf`);

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
                        withoutVote
                        numWithoutVote
                        numPresent
                        numTotal
                        others
                        numOthers
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

    usePolling(getData, council.state < 40 ? 10000 : 60000);

    if (loading) {
        return '';
    }

    return (
        <div style={{ fontSize: '1em' }}>
            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1em'
            }}>
                <b>{translate.quorum}:</b>

                <DropDownMenu
                    color="transparent"
                    id={'user-menu-trigger'}
                    loading={loading}
                    loadingColor={secondary}
                    text={translate.to_export}
                    textStyle={{ color: secondary }}
                    type="flat"
                    buttonStyle={{ border: `1px solid ${secondary}` }}
                    icon={
                        <i className="fa fa-download" style={{
                            fontSize: "1em",
                            color: secondary,
                            marginLeft: "0.3em"
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
                                        fontSize: "1em",
                                        color: secondary,
                                        marginLeft: "0.3em"
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
            <div id="quorumTable">
                <Table>
                    <TableHead>
                        <TableCell>

                        </TableCell>
                        <TableCell style={{ fontSize: '16px', fontWeight: '700' }}>
                            {translate.participants}
                        </TableCell>
                        <TableCell style={{ fontSize: '16px', fontWeight: '700' }}>
                            {translate.census_type_social_capital}
                        </TableCell>
                        <TableCell style={{ fontSize: '16px', fontWeight: '700' }}>
                            % {translate.social_capital_desc}
                        </TableCell>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                Total
                            </TableCell>
                            <TableCell>
                                {showNumParticipations(data.numTotal, company)}
                            </TableCell>
                            <TableCell>
                                {showNumParticipations(data.total, company)}
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
                                {showNumParticipations(data.numPresent, company)}
                            </TableCell>
                            <TableCell>
                                {showNumParticipations(data.present, company)}
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
                                {showNumParticipations(data.numRemote, company)}
                            </TableCell>
                            <TableCell>
                                {showNumParticipations(data.remote, company)}
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
                                {showNumParticipations(data.numDelegated, company)}
                            </TableCell>
                            <TableCell>
                                {showNumParticipations(data.delegated, company)}
                            </TableCell>
                            <TableCell>
                                {getPercentage(data.delegated)}%
                            </TableCell>
                        </TableRow>
                        {council.statute.canEarlyVote === 1 &&
                            <TableRow>
                                <TableCell>
                                    {council.councilType !== COUNCIL_TYPES.BOARD_WITHOUT_SESSION ? translate.vote_letter : translate.quorum_early_votes}
                                </TableCell>
                                <TableCell>
                                    {showNumParticipations(data.numEarlyVotes, company)}
                                </TableCell>
                                <TableCell>
                                    {showNumParticipations(data.earlyVotes, company)}
                                </TableCell>
                                <TableCell>
                                    {getPercentage(data.earlyVotes)}%
                                </TableCell>
                            </TableRow>
                        }
                        <TableRow>
                            <TableCell>
                                {translate.no_voting_rights}
                            </TableCell>
                            <TableCell>
                                {showNumParticipations(data.numWithoutVote, company)}
                            </TableCell>
                            <TableCell>
                                {showNumParticipations(data.withoutVote, company)}
                            </TableCell>
                            <TableCell>
                                {getPercentage(data.withoutVote)}%
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                {translate.others}
                            </TableCell>
                            <TableCell>
                                {showNumParticipations(data.numOthers, company)}
                            </TableCell>
                            <TableCell>
                                -
                            </TableCell>
                            <TableCell>
                                -
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                {renderVotingsTable &&
                    <Table style={{ marginTop: '3em' }}>
                        <TableHead>
                            <TableCell style={{ fontSize: '16px', fontWeight: '700' }}>
                                {translate.title}
                            </TableCell>
                            <TableCell colSpan={2} style={{ fontSize: '16px', fontWeight: '700' }}>
                                {translate.in_favor_btn}
                            </TableCell>
                            <TableCell colSpan={2} style={{ fontSize: '16px', fontWeight: '700' }}>
                                {translate.against_btn}
                            </TableCell>
                            <TableCell colSpan={2} style={{ fontSize: '16px', fontWeight: '700' }}>
                                {translate.abstention_btn}
                            </TableCell>
                        </TableHead>
                        <TableBody>
                            {agendas.map(point => (
                                <TableRow>
                                    <TableCell>
                                        <div className="truncate" style={{ width: '6em' }}>
                                            {point.agendaSubject.substr(0, 10)}
                                        </div>
                                    </TableCell>
                                    {hasVotation(point.subjectType) ?
                                        <>
                                            <TableCell>
                                                {showNumParticipations(point.positiveVotings + point.positiveManual, company)}
                                            </TableCell>
                                            <TableCell>
                                                {`${getVotingPercentage(point.positiveVotings + point.positiveManual)}%`}
                                            </TableCell>
                                            <TableCell>
                                                {showNumParticipations(point.negativeVotings + point.negativeManual, company)}
                                            </TableCell>
                                            <TableCell>
                                                {`${getVotingPercentage(point.negativeVotings + point.negativeManual)}%`}
                                            </TableCell>
                                            <TableCell>
                                                {showNumParticipations(point.abstentionVotings + point.abstentionManual, company)}
                                            </TableCell>
                                            <TableCell>
                                                {`${getVotingPercentage(point.abstentionVotings + point.abstentionManual)}%`}
                                            </TableCell>
                                        </>
                                        :
                                        <>
                                            <TableCell colSpan={2} align="center">
                                                -
                                            </TableCell>
                                            <TableCell colSpan={2} align="center">
                                                -
                                            </TableCell>
                                            <TableCell colSpan={2} align="center">
                                                -
                                            </TableCell>
                                        </>

                                    }

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                }
            </div>

        </div>
    )
})

export default QuorumDisplay;