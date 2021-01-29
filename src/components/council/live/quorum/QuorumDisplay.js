import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { Table, TableBody, TableHead, TableRow, TableCell, MenuItem } from 'material-ui';
import { showNumParticipations, councilHasSession, hasParticipations, hasVotation, isConfirmationRequest, isCustomPoint } from '../../../../utils/CBX';
import { getSecondary } from '../../../../styles/colors';
import { useDownloadHTMLAsPDF, usePolling } from '../../../../hooks';
import { AlertConfirm, DropDownMenu, Scrollbar } from '../../../../displayComponents';
import { moment } from '../../../../containers/App';
import { COUNCIL_TYPES } from '../../../../constants';



const QuorumDisplay = ({ council, recount, translate, company }) => {
    const secondary = getSecondary();
    const [modal, setModal] = React.useState(false);

    const councilStarted = () => (council.state === 20 || council.state === 30) && council.councilStarted == 1

    if(council.councilType === COUNCIL_TYPES.ONE_ON_ONE){
        return null;
    }

    return (
        <>
            {council.statute.quorumPrototype === 0 ?
                <b>{`${translate.current_quorum}: ${showNumParticipations(recount.partRightVoting, company, council.statute)} (${((recount.partRightVoting / (recount.partTotal ? recount.partTotal : 1)) * 100).toFixed(3)}%)${(councilStarted() && council.councilStarted === 1 && councilHasSession(council)) ?
                    ` / ${translate.initial_quorum}: ${council.initialQuorum ? showNumParticipations(council.initialQuorum, company, council.statute) : showNumParticipations(council.currentQuorum, company, council.statute)
                    } (${((council.initialQuorum / (recount.partTotal ? recount.partTotal : 1) * 100).toFixed(3))}%)`
                    :
                    ''
                    }`}</b>
                :
                <b>{`${translate.current_quorum}: ${showNumParticipations(recount.socialCapitalRightVoting, company, council.statute)} (${((recount.socialCapitalRightVoting / (recount.socialCapitalTotal ? recount.socialCapitalTotal : 1)) * 100).toFixed(3)}%)${(councilStarted() && council.councilStarted === 1 && councilHasSession(council)) ?
                    ` / ${translate.initial_quorum}: ${council.initialQuorum ? showNumParticipations(council.initialQuorum, company, council.statute) : showNumParticipations(council.currentQuorum, company, council.statute)
                    } (${((council.initialQuorum / (recount.socialCapitalTotal ? recount.socialCapitalTotal : 1) * 100).toFixed(3))}%)`
                    :
                    ''
                    }`}</b>
            }
            <div
                style={{ color: secondary, paddingLeft: '0.6em', cursor: 'pointer' }}
                onClick={() => setModal(true)}
            >
                <i
                    className="fa fa-info"
                    aria-hidden="true"
                ></i>
            </div>

            {modal &&
                <AlertConfirm
                    title={'Quorum info'}
                    open={modal}
                    bodyStyle={{ height: '450px', minWidth: "50vw" }}
                    bodyText={
                        <QuorumDetails
                            council={council}
                            recount={recount}
                            company={company}
                            translate={translate}
                            socialCapital={recount.socialCapitalTotal}
                            totalVotes={recount.partTotal}
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

const mainRowsStyle = {
    fontWeight: '700',
    fontSize: '14px'
}

export const QuorumDetails = withApollo(({ council, renderVotingsTable, agendas = [], company, translate, recount, totalVotes, socialCapital, client }) => {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const secondary = getSecondary();
    const { downloadHTMLAsPDF } = useDownloadHTMLAsPDF();

    const SC = hasParticipations(council.statute);

    const getPercentage = (value, defaultBase) => {
        let base = defaultBase || totalVotes;
        if (SC) {
            base = defaultBase || socialCapital;
        }

        return ((value / base) * 100).toFixed(3);
    }

    const getVotingPercentage = value => ((value / totalVotes) * 100).toFixed(3)

    const downloadPDF = async () => {
        await downloadHTMLAsPDF({
            name: `Quorum_${council.name.replace(/\s/g, '_')}_${moment().format('DD/MM/YYYY_hh_mm_ss')}`,
            companyId: council.companyId,
            html: document.getElementById("quorumTable").innerHTML
        });
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
        <div style={{ fontSize: '1em', height: '100%' }}>
            <Scrollbar>
                <div>
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
                </div>
                <div style={{}}>
                    <div id="quorumTable" style={{}}>
                        <Table style={{ minWidth: '100%' }}>
                            <TableHead>
                                <TableCell>

                                </TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: '700' }}>
                                    {translate.participants}
                                </TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: '700' }}>
                                    {SC ? translate.census_type_social_capital : translate.votes}
                                </TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: '700' }}>
                                    %
                        </TableCell>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell style={mainRowsStyle}>
                                        Total
                            </TableCell>
                                    <TableCell style={mainRowsStyle}>
                                        {data.numTotal}
                                    </TableCell>
                                    <TableCell style={mainRowsStyle}>
                                        {showNumParticipations(SC ? recount.socialCapitalRightVoting : recount.partRightVoting, company, council.statute)}
                                    </TableCell>
                                    <TableCell style={mainRowsStyle}>
                                        {getPercentage(SC ? recount.socialCapitalRightVoting : recount.partRightVoting)}%
                            </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={mainRowsStyle}>
                                        {translate.presents}
                                    </TableCell>
                                    <TableCell style={mainRowsStyle}>
                                        {data.numPresent + data.numRemote + data.numEarlyVotes}
                                    </TableCell>
                                    <TableCell style={mainRowsStyle}>
                                        {showNumParticipations(data.present + data.remote + data.earlyVotes + data.withoutVote, company, council.statute)}
                                    </TableCell>
                                    <TableCell style={mainRowsStyle}>
                                        {getPercentage(data.present + data.remote + data.earlyVotes)}%
                            </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        -{translate.face_to_face}
                                    </TableCell>
                                    <TableCell>
                                        {data.numPresent}
                                    </TableCell>
                                    <TableCell>
                                        {showNumParticipations(data.present, company, council.statute)}
                                    </TableCell>
                                    <TableCell>
                                        {getPercentage(data.present)}%
                            </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        -{translate.remotes}
                                    </TableCell>
                                    <TableCell>
                                        {data.numRemote}
                                    </TableCell>
                                    <TableCell>
                                        {showNumParticipations(data.remote, company, council.statute)}
                                    </TableCell>
                                    <TableCell>
                                        {getPercentage(data.remote)}%
                            </TableCell>
                                </TableRow>
                                {council.statute.canEarlyVote === 1 &&
                                    <TableRow>
                                        <TableCell>
                                            -{council.councilType !== COUNCIL_TYPES.BOARD_WITHOUT_SESSION ? translate.vote_letter : translate.quorum_early_votes}
                                        </TableCell>
                                        <TableCell>
                                            {data.numEarlyVotes}
                                        </TableCell>
                                        <TableCell>
                                            {showNumParticipations(data.earlyVotes, company, council.statute)}
                                        </TableCell>
                                        <TableCell>
                                            {getPercentage(data.earlyVotes)}%
                                </TableCell>
                                    </TableRow>
                                }
                                <TableRow>
                                    <TableCell>
                                        -{translate.no_voting_rights}
                                    </TableCell>
                                    <TableCell>
                                        {data.numWithoutVote}
                                    </TableCell>
                                    <TableCell>
                                        {showNumParticipations(data.withoutVote, company, council.statute)}
                                    </TableCell>
                                    <TableCell>
                                        {getPercentage(data.withoutVote)}%
                            </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={mainRowsStyle}>
                                        {translate.delegated_plural}
                                    </TableCell>
                                    <TableCell style={mainRowsStyle}>
                                        {data.numDelegated}
                                    </TableCell>
                                    <TableCell style={mainRowsStyle}>
                                        {showNumParticipations(data.delegated, company, council.statute)}
                                    </TableCell>
                                    <TableCell style={mainRowsStyle}>
                                        {getPercentage(data.delegated)}%
                            </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={mainRowsStyle}>
                                        {translate.others}
                                    </TableCell>
                                    <TableCell style={mainRowsStyle}>
                                        {data.numOthers}
                                    </TableCell>
                                    <TableCell style={mainRowsStyle}>
                                        -
                            </TableCell>
                                    <TableCell style={mainRowsStyle}>
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
                                            {(hasVotation(point.subjectType) && !isCustomPoint(point.subjectType)) ?
                                                <>
                                                    {isConfirmationRequest(point.subjectType) ?
                                                        <>
                                                            <TableCell>
                                                                {point.positiveVotings + point.positiveManual}
                                                            </TableCell>
                                                            <TableCell>
                                                                {`${getPercentage(point.positiveVotings + point.positiveManual, point.positiveVotings + point.positiveManual + point.negativeVotings + point.negativeManual + point.noVoteVotings + point.noVoteManual)}%`}
                                                            </TableCell>
                                                            <TableCell>
                                                                {point.negativeVotings + point.negativeManual}
                                                            </TableCell>
                                                            <TableCell>
                                                                {`${getPercentage(point.negativeVotings + point.negativeManual, point.positiveVotings + point.positiveManual + point.negativeVotings + point.negativeManual + point.noVoteVotings + point.noVoteManual)}%`}
                                                            </TableCell>
                                                            <TableCell colSpan={2} align="center">
                                                                -
                                                    </TableCell>
                                                        </>
                                                        :
                                                        <>
                                                            <TableCell>
                                                                {showNumParticipations(point.positiveVotings + point.positiveManual, company, council.statute)}
                                                            </TableCell>
                                                            <TableCell>
                                                                {`${getVotingPercentage(point.positiveVotings + point.positiveManual)}%`}
                                                            </TableCell>
                                                            <TableCell>
                                                                {showNumParticipations(point.negativeVotings + point.negativeManual, company, council.statute)}
                                                            </TableCell>
                                                            <TableCell>
                                                                {`${getVotingPercentage(point.negativeVotings + point.negativeManual)}%`}
                                                            </TableCell>
                                                            <TableCell>
                                                                {showNumParticipations(point.abstentionVotings + point.abstentionManual, company, council.statute)}
                                                            </TableCell>
                                                            <TableCell>
                                                                {`${getVotingPercentage(point.abstentionVotings + point.abstentionManual)}%`}
                                                            </TableCell>
                                                        </>
                                                    }
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

            </Scrollbar>
        </div>
    )
})

export default QuorumDisplay;
