import React from 'react';
import { graphql, compose } from 'react-apollo';
import { councilParticipantsActSends } from '../../../../queries';
import { LoadingSection, EnhancedTable } from '../../../../displayComponents';
import { PARTICIPANTS_LIMITS } from '../../../../constants';
import { TableRow, TableCell, Tooltip } from 'material-ui';
import * as CBX from '../../../../utils/CBX';
import AttendIntentionIcon from '../../live/participants/AttendIntentionIcon';
import DownloadCBXDataButton from '../../../council/prepare/DownloadCBXDataButton';
import gql from 'graphql-tag';


const refreshAllSends = gql`
    mutation refreshAllSends($councilId: Int!){
        refreshAllSends(councilId: $councilId){
            success
            message
        }
    }
`;


class ParticipantsWithActTable extends React.Component {

    async componentDidMount(){
        const response = await this.props.refreshAllSends({
            variables: {
                councilId: this.props.council.id
            }
        });
        this.props.data.refetch();

        console.log(response);
    }

    render(){
        const { translate, council } = this.props;

        return(
            <div>
                <EnhancedTable
                    ref={table => (this.table = table)}
                    translate={translate}
                    defaultLimit={PARTICIPANTS_LIMITS[0]}
                    defaultFilter={"fullName"}
                    defaultOrder={["name", "asc"]}
                    limits={PARTICIPANTS_LIMITS}
                    page={1}
                    loading={this.props.data.loading}
                    length={this.props.data.loading? [] : this.props.data.councilParticipantsActSends.list.length}
                    total={this.props.data.loading? [] : this.props.data.councilParticipantsActSends.total}
                    refetch={this.props.data.refetch}
                    action={this._renderDeleteIcon}
                    headers={[]}
                >
                    {this.props.data.loading?
                        <LoadingSection />
                    : (
                        this.props.data.councilParticipantsActSends.list.map(
                            (participant, index) => {
                                return (
                                    <React.Fragment
                                        key={`participant${participant.id}`}
                                    >
                                        <TableRow
                                            hover
                                            onClick={() =>
                                                this.setState({
                                                    editingParticipant: true,
                                                    participant: participant
                                                })
                                            }
                                            style={{
                                                cursor: "pointer"
                                            }}
                                        >
                                            <TableCell>
                                                {`${participant.name} ${
                                                    participant.surname
                                                }`}
                                            </TableCell>
                                            <TableCell>
                                                {participant.dni}
                                            </TableCell>
                                            <TableCell>
                                                {participant.position}
                                            </TableCell>
                                            <TableCell>
                                                {participant.actNotifications
                                                    .length > 0 ? (
                                                    <Tooltip
                                                        title={
                                                            translate[
                                                                CBX.getTranslationReqCode(
                                                                    participant
                                                                        .actNotifications[0]
                                                                        .reqCode
                                                                )
                                                            ]
                                                        }
                                                    >
                                                        <img
                                                            style={{
                                                                height:
                                                                    "2.1em",
                                                                width:
                                                                    "auto"
                                                            }}
                                                            src={CBX.getEmailIconByReqCode(
                                                                participant
                                                                    .actNotifications[0]
                                                                    .reqCode
                                                            )}
                                                            alt="email-state-icon"
                                                        />
                                                    </Tooltip>
                                                ) : (
                                                    ""
                                                )}
                                            </TableCell>
                                            {CBX.councilHasAssistanceConfirmation(
                                                council
                                            ) && (
                                                <TableCell>
                                                    <AttendIntentionIcon
                                                        participant={participant.live}
                                                        translate={translate}
                                                        size="2em"
                                                    />
                                                </TableCell>
                                            )}
                                        
                                            <TableCell>
                                                <DownloadCBXDataButton
                                                    translate={translate}
                                                    participantId={
                                                        participant.id
                                                    }
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                );
                            }
                        )                  
                    )}
                </EnhancedTable>
            </div>
        )
    }
}


export default compose(
    graphql(councilParticipantsActSends, {
        options: props => ({
            variables: {
                councilId: props.council.id,
                options: {
                    limit: 10,
                    offset: 0
                },
                notificationStatus: 6
            }
        })
    }),
    graphql(refreshAllSends, {
        name: 'refreshAllSends'
    })
)(ParticipantsWithActTable);