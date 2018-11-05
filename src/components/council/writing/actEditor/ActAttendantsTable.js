import React from 'react';
import { downloadConnectionsExcel } from "../../../../queries";
import { graphql, withApollo } from 'react-apollo';
import { LoadingSection, EnhancedTable, BasicButton, Scrollbar } from '../../../../displayComponents';
import FontAwesome from 'react-fontawesome';
import { TableRow, TableCell } from 'material-ui';
import { PARTICIPANTS_LIMITS } from '../../../../constants';
import * as CBX from '../../../../utils/CBX';
import DownloadCBXDataButton from '../../prepare/DownloadCBXDataButton';
import { getSecondary } from '../../../../styles/colors';
import { moment } from '../../../../containers/App';
import { councilAttendants } from '../../../../queries/council';
import DownloadAttendantsPDF from './DownloadAttendantsPDF';
import StateIcon from '../../live/participants/StateIcon';

class ActAttendantsTable extends React.Component {

    state = {
        downloadingPDF: false,
        downloadingExcel: false
    }

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
                                <DownloadAttendantsPDF
                                    translate={translate}
                                    color={secondary}
                                    council={this.props.council}
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
                                                        <HoverableRow
                                                            translate={translate}
                                                            participant={participant}
                                                        />
                                                        {!!participant.delegationsAndRepresentations && (
                                                            participant.delegationsAndRepresentations.map(delegatedVote =>
                                                                <TableRow style={{
                                                                    backgroundColor:
                                                                        "WhiteSmoke"
                                                                }}
                                                                    key={`delegatedVote_${delegatedVote.dni}`}
                                                                    >
                                                                    <TableCell style={{ fontSize: "0.9em" }}>
                                                                        <StateIcon translate={translate} state={delegatedVote.state}/>
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

class HoverableRow extends React.Component {

    state = {
        showActions: false,
        loading: false
    }

    mouseEnterHandler = () => {
        this.setState({
            showActions: true
        });
    }

    mouseLeaveHandler = () => {
        this.setState({
            showActions: false
        });
    }

    updateState = object => {
        this.setState({
            ...object
        })
    }

    render(){
        const { translate, participant } = this.props;

        return (
            <TableRow
                onMouseOver={this.mouseEnterHandler}
                onMouseLeave={this.mouseLeaveHandler}
            >
                <TableCell>
                    <StateIcon translate={translate} state={participant.state}/>
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
                    <div style={{width: '4em'}}>
                        {(this.state.showActions || this.props.loading) &&
                            <DownloadCBXDataButton
                                updateState={this.updateState}
                                translate={translate}
                                participantId={
                                    participant.id
                                }
                            />
                        }
                    </div>
                </TableCell>
            </TableRow>
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