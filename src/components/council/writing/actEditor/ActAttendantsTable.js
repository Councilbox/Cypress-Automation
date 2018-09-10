import React from 'react';
import { downloadAttendPDF, downloadConnectionsExcel } from "../../../../queries";
import { graphql, withApollo } from 'react-apollo';
import { LoadingSection, EnhancedTable, BasicButton, Scrollbar } from '../../../../displayComponents';
import FontAwesome from 'react-fontawesome';
import { TableRow, TableCell } from 'material-ui';
import { PARTICIPANTS_LIMITS, PARTICIPANT_STATES } from '../../../../constants';
import * as CBX from '../../../../utils/CBX';
import DownloadCBXDataButton from '../../prepare/DownloadCBXDataButton';
import { getSecondary } from '../../../../styles/colors';
import { moment } from '../../../../containers/App';
import { councilAttendants } from '../../../../queries/council';

class ActAttendantsTable extends React.Component {

    state = {
        downloadingPDF: false,
        downloadingExcel: false
    }

    downloadPDF = async () => {
        this.setState({
            downloadingPDF: true
        })
        const response = await this.props.client.query({
            query: downloadAttendPDF,
            variables: {
                councilId: this.props.council.id,
                timezone: moment().utcOffset(),
            }
        });

        if (response) {
            if (response.data.downloadAttendPDF) {
                this.setState({
                    downloadingPDF: false
                });
                CBX.downloadFile(
                    response.data.downloadAttendPDF,
                    "application/pdf",
                    `${this.props.translate.convene.replace(/ /g, '_')}-${
                    this.props.council.name.replace(/ /g, '_')
                    }`
                );
            }
        }
    };

    downloadExcel = async () => {
        this.setState({
            downloadingExcel: true
        })
        const response = await this.props.client.query({
            query: downloadConnectionsExcel,
            variables: {
                councilId: this.props.council.id
            }
        });

        if (response) {
            if (response.data.downloadConnectionsExcel) {
                this.setState({
                    downloadingExcel: false
                });
                CBX.downloadFile(
                    response.data.downloadConnectionsExcel,
                    "excel",
                    `${this.props.translate.convene.replace(/ /g, '_')}-${
                    this.props.council.name.replace(/ /g, '_')
                    }`
                );
            }
        }
    };

    render() {
        const { translate } = this.props;
        const { loading } = this.props.data;
        const secondary = getSecondary();

        const { councilAttendants } = this.props.data;

        return (
            <div style={{ height: "100%", overflow: 'hidden', position: 'relative' }}>
                <Scrollbar>
                    <div style={{ padding: '1.5em', overflow: 'hidden' }}>
                        {!!councilAttendants && (
                            <React.Fragment>
                                <BasicButton
                                    text={translate.export_participants}
                                    color={secondary}
                                    loading={this.state.downloadingPDF}
                                    buttonStyle={{ marginTop: "0.5em", marginBottom: '1.4em' }}
                                    textStyle={{
                                        color: "white",
                                        fontWeight: "700",
                                        fontSize: "0.9em",
                                        textTransform: "none"
                                    }}
                                    icon={
                                        <FontAwesome
                                            name={"file-pdf-o"}
                                            style={{
                                                fontSize: "1em",
                                                color: "white",
                                                marginLeft: "0.3em"
                                            }}
                                        />
                                    }
                                    textPosition="after"
                                    onClick={this.downloadPDF}
                                />
                                <EnhancedTable
                                    ref={table => (this.table = table)}
                                    translate={translate}
                                    defaultLimit={PARTICIPANTS_LIMITS[0]}
                                    defaultFilter={"fullName"}
                                    defaultOrder={["name", "asc"]}
                                    limits={PARTICIPANTS_LIMITS}
                                    page={1}
                                    loading={loading}
                                    length={councilAttendants.list.length}
                                    total={councilAttendants.total}
                                    refetch={this.props.data.refetch}
                                    fields={[
                                        {
                                            value: "fullName",
                                            translation: translate.participant_data
                                        },
                                        {
                                            value: "dni",
                                            translation: translate.dni
                                        },
                                        {
                                            value: "position",
                                            translation: translate.position
                                        }
                                    ]}
                                    headers={[
                                        {
                                            text: '',
                                            name: 'icon',
                                            canOrder: false
                                        },
                                        {
                                            text: translate.participant_data,
                                            name: 'surname',
                                            canOrder: true
                                        },
                                        {
                                            text: translate.dni,
                                            name: 'dni',
                                            canOrder: true

                                        },
                                        {
                                            text: translate.position,
                                            name: 'position',
                                            canOrder: true
                                        },
                                        {
                                            text: '',
                                            name: 'download',
                                            canOrder: false
                                        }
                                    ]}
                                >
                                    {loading ?
                                        <LoadingSection />
                                        :

                                        councilAttendants.list.map(
                                            (participant, index) => {
                                                return (
                                                    <React.Fragment
                                                        key={`participant${participant.id}`}
                                                    >
                                                        <TableRow>
                                                            <TableCell>
                                                                {participant.state === PARTICIPANT_STATES.REMOTE ?
                                                                    'REMOTE ICON'
                                                                    :
                                                                    'PRESENT ICON'
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {`${participant.name} ${participant.surname}`}
                                                            </TableCell>
                                                            <TableCell>
                                                                {participant.dni}
                                                            </TableCell>
                                                            <TableCell>
                                                                {participant.position}
                                                            </TableCell>
                                                            <TableCell>
                                                                <DownloadCBXDataButton
                                                                    translate={translate}
                                                                    participantId={
                                                                        participant.participantId
                                                                    }
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                        {!!participant.delegationsAndRepresentations && (
                                                            participant.delegationsAndRepresentations.map(delegatedVote =>
                                                                <TableRow style={{
                                                                    backgroundColor:
                                                                        "WhiteSmoke"
                                                                }} >
                                                                    <TableCell style={{ fontSize: "0.9em" }}>
                                                                        {delegatedVote.state === PARTICIPANT_STATES.REPRESENTATED ? 'REPRESENTADO' : 'DELEGADO'}
                                                                    </TableCell>
                                                                    <TableCell style={{ fontSize: "0.9em" }}>
                                                                        {`${delegatedVote.name} ${delegatedVote.surname}`}
                                                                    </TableCell>
                                                                    <TableCell style={{ fontSize: "0.9em" }}>
                                                                        {delegatedVote.dni}
                                                                    </TableCell>
                                                                    <TableCell style={{ fontSize: "0.9em" }}>
                                                                        {delegatedVote.position}
                                                                    </TableCell>
                                                                    <TableCell />
                                                                </TableRow>
                                                            )
                                                        )}
                                                    </React.Fragment>
                                                );
                                            }
                                        )}
                                </EnhancedTable>
                            </React.Fragment>
                        )}
                        {this.props.children}
                    </div>
                </Scrollbar>
            </div>
        )
    }
}

export default graphql(councilAttendants, {
    options: props => ({
        variables: {
            councilId: props.council.id
        }
    })
})(withApollo(ActAttendantsTable));