import React, { Component, Fragment } from "react";
import { TableRow, TableCell } from 'material-ui/Table';
import { Tooltip } from 'material-ui';
import { getPrimary, getSecondary } from '../../../styles/colors';
import * as CBX from '../../../utils/CBX';
import {
    EnhancedTable, DeleteIcon, Grid, GridItem, ButtonIcon, BasicButton, AlertConfirm
} from '../../../displayComponents';
import { graphql, compose } from "react-apollo";
import {
 updateNotificationsStatus, downloadCBXData
} from '../../../queries';
import {
    convenedcouncilParticipants, deleteParticipant,
} from '../../../queries/councilParticipant';
import EditParticipantModal from './EditParticipantModal';
import { PARTICIPANTS_LIMITS } from '../../../constants';
import NotificationFilters from './NotificationFilters';
import NewParticipantForm from '../editor/census/NewParticipantForm';
import DownloadCBXDataButton from './DownloadCBXDataButton';


class ConvenedParticipantsTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editParticipant: false,
            addParticipant: false,
            showModal: false,
            editIndex: null,
            activeStatusFilter: ''
        }
    }

    _renderDeleteIcon(participantID) {
        const primary = getPrimary();

        return (<DeleteIcon
            style={{ color: primary }}
            onClick={() => this.deleteParticipant(participantID)}
        />);
    }

    componentDidUpdate() {
        this.props.data.refetch();
    }

    deleteParticipant = async (id) => {
        const response = await this.props.mutate({
            variables: {
                participantId: id,
                councilId: this.props.councilId
            }
        });

        if (response) {
            this.table.refresh();
        }
    };

    refresh = (object) => {
        this.table.refresh(object);
    };


    refreshEmailStates = async () => {
        const response = await this.props.updateNotificationsStatus({
            variables: {
                councilId: this.props.councilId
            }
        });

        if (response.data.updateNotificationsStatus.success) {
            this.table.refresh();
        }
    };


    render() {
        const { translate, totalVotes, socialCapital } = this.props;
        const { loading } = this.props.data;
        const councilParticipants = this.props.data.councilParticipantsWithNotifications;

        let headers = [ {
            text: translate.name,
            name: 'name',
            canOrder: true
        }, {
            text: translate.dni,
            name: 'dni',
            canOrder: true
        }, //     {
            //     text: translate.email,
            //     name: 'email',
            //     canOrder: true
            // },
            { text: translate.position }, {
                text: translate.votes,
                name: 'numParticipations',
                canOrder: true
            }, {
                text: translate.census_type_social_capital,
                name: 'socialCapital',
                canOrder: true
            }, {
                text: translate.convene
            }
        ];

        if (!this.props.participations) {
            headers.splice(3,1);
        }

        if (this.state.editParticipant && this.props.editable) {
            return (<Grid>

                {councilParticipants.list[ this.state.editIndex ].name}
            </Grid>)
        }

        return (<div style={{ width: '100%' }}>
            {!!councilParticipants && <React.Fragment>
                <Grid style={{ margin: '0.5em 0' }}>
                    <GridItem xs={12} lg={6} md={6}>
                        <NotificationFilters
                            translate={translate}
                            refetch={this.refresh}
                        />
                    </GridItem>
                    <GridItem xs={6} lg={6} md={6}>
                        <Tooltip title={translate.tooltip_refresh_convene_email_state_assistance}>
                            <BasicButton
                                floatRight
                                text={translate.refresh_convened}
                                color={getSecondary()}
                                buttonStyle={{
                                    margin: '0',
                                }}
                                textStyle={{
                                    color: 'white',
                                    fontWeight: '700',
                                    fontSize: '0.9em',
                                    textTransform: 'none'
                                }}
                                icon={<ButtonIcon color='white' type="refresh"/>}
                                textPosition="after"
                                onClick={() => this.refreshEmailStates()}
                            />
                        </Tooltip>
                        <BasicButton
                            floatRight
                            text={translate.add_participant}
                            color={getPrimary()}
                            buttonStyle={{
                                margin: '0',
                                marginRight: '0.2em'
                            }}
                            textStyle={{
                                color: 'white',
                                fontWeight: '700',
                                fontSize: '0.9em',
                                textTransform: 'none'
                            }}
                            icon={<ButtonIcon color='white' type="add"/>}
                            textPosition="after"
                            onClick={() => this.setState({
                                showModal: true
                            })}
                        />
                        <AlertConfirm
                            requestClose={() => this.setState({ showModal: false })}
                            open={this.state.showModal}
                            bodyText={<div style={{
                                maxWidth: '850px',
                                padding: '1em'
                            }}>
                                <NewParticipantForm
                                    translate={translate}
                                    requestClose={() => this.setState({
                                        showModal: false
                                    })}
                                    convened={true}
                                    participations={CBX.hasParticipations(this.props.council)}
                                    councilID={this.props.councilId}
                                />
                            </div>}
                        />
                    </GridItem>
                </Grid>
                <EnhancedTable
                    ref={(table) => this.table = table}
                    translate={translate}
                    defaultLimit={PARTICIPANTS_LIMITS[ 0 ]}
                    defaultFilter={'fullName'}
                    defaultOrder={[ 'name', 'asc' ]}
                    limits={PARTICIPANTS_LIMITS}
                    page={1}
                    loading={loading}
                    length={councilParticipants.list.length}
                    total={councilParticipants.total}
                    refetch={this.props.data.refetch}
                    action={this._renderDeleteIcon}
                    fields={[ {
                        value: 'fullName',
                        translation: translate.participant_data
                    }, {
                        value: 'dni',
                        translation: translate.dni
                    }, //     {
                        //     value: 'email',
                        //     translation: translate.email
                        // },
                        {
                            value: 'position',
                            translation: translate.position
                        } ]}
                    headers={headers}
                >
                    {councilParticipants.list.map((participant, index) => {
                        return (<Fragment key={`participant${participant.id}`}>
                            <TableRow
                                hover={true}
                                onClick={() => this.setState({
                                    editParticipant: true,
                                    editIndex: index
                                })}
                                style={{
                                    cursor: 'pointer',
                                    width: '800px',
                                    backgroundColor: CBX.isRepresentative(participant) ? 'WhiteSmoke' : 'transparent'
                                }}
                            >
                                <TableCell>
                                    {`${participant.name} ${participant.surname}`}
                                </TableCell>
                                <TableCell>
                                    {participant.dni}
                                </TableCell>
                                {/*<TableCell>*/}
                                {/*{participant.email}*/}
                                {/*</TableCell>*/}
                                <TableCell>
                                    {participant.position}
                                </TableCell>
                                <TableCell>
                                    {!CBX.isRepresentative(participant) && `${participant.numParticipations} (${((participant.numParticipations / totalVotes) * 100).toFixed(2)}%)`}
                                </TableCell>
                                {this.props.participations && <TableCell>
                                    {!CBX.isRepresentative(participant) && `${participant.socialCapital} (${((participant.socialCapital / socialCapital) * 100).toFixed(2)}%)`}
                                </TableCell>}
                                <TableCell>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {participant.notifications.length > 0 ? <Tooltip
                                            title={translate[ CBX.getTranslationReqCode(participant.notifications[ 0 ].reqCode) ]}>
                                            <img
                                                style={{
                                                    height: '2.1em',
                                                    width: 'auto'
                                                }}
                                                src={CBX.getEmailIconByReqCode(participant.notifications[ 0 ].reqCode)}
                                                alt="email-state-icon"
                                            />
                                        </Tooltip> : '-'}
                                        <DownloadCBXDataButton
                                            translate={translate}
                                            participantId={participant.id}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                            {!!participant.representative && <TableRow
                                hover={true}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: 'WhiteSmoke'
                                }}
                                onClick={() => this.setState({
                                    editParticipant: true,
                                    editIndex: index
                                })}
                            >
                                <TableCell>
                                    <div style={{
                                        fontSize: '0.9em',
                                        width: '100%'
                                    }}>
                                        {`${translate.represented_by}: ${participant.representative.name} ${participant.representative.surname}`}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div style={{
                                        fontSize: '0.9em',
                                        width: '100%'
                                    }}>
                                        {participant.representative.dni}
                                    </div>
                                </TableCell>
                                {/*<TableCell>*/}
                                    {/*<div style={{*/}
                                        {/*fontSize: '0.9em',*/}
                                        {/*width: '100%'*/}
                                    {/*}}>*/}
                                        {/*{participant.representative.email}*/}
                                    {/*</div>*/}
                                {/*</TableCell>*/}
                                <TableCell>
                                    <div style={{
                                        fontSize: '0.9em',
                                        width: '100%'
                                    }}>
                                        {participant.representative.position}
                                    </div>
                                </TableCell>
                                <TableCell>
                                </TableCell>
                                <TableCell>
                                    {participant.representative.notifications.length > 0 ? <Tooltip
                                        title={translate[ CBX.getTranslationReqCode(participant.representative.notifications[ 0 ].reqCode) ]}>
                                        <img
                                            style={{
                                                height: '2.1em',
                                                width: 'auto'
                                            }}
                                            src={CBX.getEmailIconByReqCode(participant.representative.notifications[ 0 ].reqCode)}
                                            alt="email-state-icon"
                                        />
                                    </Tooltip> : '-'}
                                </TableCell>
                            </TableRow>}
                        </Fragment>)
                    })}
                </EnhancedTable>
                <EditParticipantModal
                    requestClose={() => this.setState({ editParticipant: false })}
                    open={this.state.editParticipant}
                    participations={CBX.hasParticipations(this.props.council)}
                    participant={councilParticipants.list[ this.state.editIndex ]}
                    translate={translate}
                />
            </React.Fragment>}
            {this.props.children}
        </div>);
    }
}

export default compose(graphql(deleteParticipant), graphql(updateNotificationsStatus, {
    name: 'updateNotificationsStatus'
}), graphql(downloadCBXData, {
    name: 'downloadCBXData'
}), graphql(convenedcouncilParticipants, {
    options: (props) => ({
        variables: {
            councilId: props.councilId,
            options: {
                limit: PARTICIPANTS_LIMITS[ 0 ],
                offset: 0
            }
        },
        forceFetch: true
    })
}))(ConvenedParticipantsTable);