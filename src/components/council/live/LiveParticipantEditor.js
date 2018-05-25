import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { liveParticipant, updateLiveParticipant, updateLiveParticipantSends } from '../../../queries';
import { getPrimary, getSecondary } from '../../../styles/colors';
import { Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from 'material-ui';
import { BasicButton, CloseIcon, Grid, GridItem, LoadingSection } from '../../../displayComponents';
import * as CBX from '../../../utils/CBX';
import ParticipantStateSelector from './ParticipantStateSelector';
import moment from 'moment';

class LiveParticipantEditor extends Component {

    refreshEmailStates = async () => {
        this.setState({
            loadingSends: true
        });
        const response = await this.props.updateLiveParticipantSends({
            variables: {
                participantId: this.props.data.liveParticipant.id
            }
        });

        if (response.data.updateLiveParticipantSends.success) {
            this.props.data.refetch();
            this.setState({
                loadingSends: false
            });
        }
    }
    removeDelegatedVote = async (id) => {

        const response = await this.props.updateLiveParticipant({
            variables: {
                participant: {
                    id: id,
                    state: 0,
                    delegateId: null,
                    councilId: this.props.council.id
                }
            }
        });

        if (response) {
            this.props.data.refetch();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            loadingSends: false
        }
    }

    componentDidMount() {
        this.props.data.refetch();
    }

    render() {
        const { translate } = this.props;

        if (this.props.data.loading) {
            return (<LoadingSection/>)
        }

        const participant = this.props.data.liveParticipant;
        const secondary = getSecondary();

        return (<Grid style={{
            height: '100%',
            padding: '2em'
        }}>
            <GridItem xs={12} lg={12} md={12}>
                <BasicButton
                    text={translate.back_list}
                    color={'white'}
                    textStyle={{
                        color: secondary,
                        fontWeight: '700',
                        fontSize: '0.9em',
                        textTransform: 'none'
                    }}
                    textPosition="after"
                    onClick={this.props.requestClose}
                    buttonStyle={{
                        marginRight: '1em',
                        border: `2px solid ${secondary}`
                    }}
                />
            </GridItem>
            <GridItem xs={12} lg={12} md={12}>
                <ParticipantTable
                    participant={participant}
                    translate={translate}
                    council={this.props.council}
                />
            </GridItem>
            <GridItem xs={12} lg={12} md={12}>
                <Typography variant="body2" style={{ marginTop: '1.2em' }}>
                    <span style={{ fontWeight: '700' }}>{`${translate.current_status}:  `}</span>
                    {translate[ CBX.getParticipantStateField(participant) ]}
                </Typography>
            </GridItem>
            <GridItem xs={12} lg={12} md={12} style={{
                display: 'flex',
                flexDirection: 'row'
            }}>
                    <span style={{ padding: '0.3em' }}>
                        <ParticipantStateSelector
                            participant={participant}
                            council={this.props.council}
                            translate={translate}
                            refetch={this.props.data.refetch}
                        />
                    </span>
            </GridItem>
            {CBX.isRepresented(participant) && <React.Fragment>
                <GridItem xs={12} lg={12} md={12} style={{
                    display: 'flex',
                    flexDirection: 'row'
                }}>
                    {translate.represented_by}
                </GridItem>
                <GridItem xs={12} lg={12} md={12}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    {translate.participant_data}
                                </TableCell>
                                <TableCell>
                                    {translate.dni}
                                </TableCell>
                                <TableCell>
                                    {translate.email}
                                </TableCell>
                                <TableCell>
                                    {translate.phone}
                                </TableCell>
                                <TableCell>
                                    {translate.position}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    {`${participant.representative.name} ${participant.representative.surname}`}
                                </TableCell>
                                <TableCell>
                                    {participant.representative.dni}
                                </TableCell>
                                <TableCell>
                                    {participant.representative.email}
                                </TableCell>
                                <TableCell>
                                    {participant.representative.phone}
                                </TableCell>
                                <TableCell>
                                    {participant.representative.position}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </GridItem>
            </React.Fragment>}

            {CBX.hasHisVoteDelegated(participant) && <React.Fragment>
                <GridItem xs={12} lg={12} md={12} style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginTop: '1.2em'
                }}>
                    {translate.voting_delegate}
                </GridItem>
                <GridItem xs={12} lg={12} md={12}>
                    <ParticipantTable
                        participant={participant.representative}
                        translate={translate}
                        delegate={true}
                        council={this.props.council}
                    />
                </GridItem>
            </React.Fragment>}

            {participant.delegatedVotes.length > 0 && <React.Fragment>
                <GridItem xs={12} lg={12} md={12} style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginTop: '1.2em'
                }}>
                    {translate.delegated_votes}
                </GridItem>
                <GridItem xs={12} lg={12} md={12}>
                    <DelegatedTable
                        participants={participant.delegatedVotes}
                        translate={translate}
                        removeDelegatedVote={this.removeDelegatedVote}
                        delegate={true}
                        council={this.props.council}
                    />
                </GridItem>
            </React.Fragment>}
            {participant.notifications.length > 0 && <React.Fragment>
                <GridItem xs={12} lg={12} md={12} style={{ marginTop: '1.7em' }}>
                    <Typography>
                        {translate.sends}
                    </Typography>

                    <BasicButton
                        text={translate.refresh_emails}
                        color={'white'}
                        loading={this.state.loadingSends}
                        loadingColor={secondary}
                        textStyle={{
                            color: secondary,
                            fontWeight: '700',
                            fontSize: '0.9em',
                            textTransform: 'none'
                        }}
                        textPosition="after"
                        onClick={this.refreshEmailStates}
                        buttonStyle={{
                            marginRight: '1em',
                            border: `2px solid ${secondary}`
                        }}
                    />
                </GridItem>
                <GridItem xs={12} lg={12} md={12}>
                    <NotificationsTable
                        notifications={participant.notifications}
                        translate={translate}
                    />
                </GridItem>
            </React.Fragment>}


        </Grid>)
    }
}

const ParticipantTable = ({ participant, translate, council, delegate }) => (<Table>
    <TableHead>
        <TableRow>
            <TableCell>
                {translate.participant_data}
            </TableCell>
            <TableCell>
                {translate.dni}
            </TableCell>
            <TableCell>
                {translate.email}
            </TableCell>
            <TableCell>
                {translate.phone}
            </TableCell>
            <TableCell>
                {translate.position}
            </TableCell>
            {!CBX.participantIsGuest(participant) && !delegate && <React.Fragment>
                <TableCell>
                    {translate.votes}
                </TableCell>
                {CBX.hasParticipations(council.statute) && <TableCell>
                    {translate.num_participations}
                </TableCell>}
            </React.Fragment>}
        </TableRow>
    </TableHead>
    <TableBody>
        <TableRow>
            <TableCell>
                {`${participant.name} ${participant.surname}`}
            </TableCell>
            <TableCell>
                {participant.dni}
            </TableCell>
            <TableCell>
                {participant.email}
            </TableCell>
            <TableCell>
                {participant.phone}
            </TableCell>
            <TableCell>
                {participant.position}
            </TableCell>
            {!CBX.participantIsGuest(participant) && !delegate && <React.Fragment>
                <TableCell>
                    {participant.numParticipations}
                </TableCell>
                {CBX.hasParticipations(council.statute) && <TableCell>
                    {participant.socialCapital}
                </TableCell>}
            </React.Fragment>}
        </TableRow>
    </TableBody>
</Table>)

const DelegatedTable = ({ participants, translate, council, removeDelegatedVote }) => (<Table>
    <TableHead>
        <TableRow>
            <TableCell>
                {translate.participant_data}
            </TableCell>
            <TableCell>
                {translate.dni}
            </TableCell>
            <TableCell>
                {translate.email}
            </TableCell>
            <TableCell>
                {translate.phone}
            </TableCell>
            <TableCell>
                {translate.position}
            </TableCell>
            <TableCell>
            </TableCell>
        </TableRow>
    </TableHead>
    <TableBody>
        {participants.map((participant) => (<TableRow>
            <TableCell>
                {`${participant.name} ${participant.surname}`}
            </TableCell>
            <TableCell>
                {participant.dni}
            </TableCell>
            <TableCell>
                {participant.email}
            </TableCell>
            <TableCell>
                {participant.phone}
            </TableCell>
            <TableCell>
                {participant.position}
            </TableCell>
            <TableCell>
                <CloseIcon
                    style={{ color: getPrimary() }}
                    onClick={(event) => {
                        removeDelegatedVote(participant.id);
                        event.stopPropagation();
                    }}
                />
            </TableCell>
        </TableRow>))}
    </TableBody>
</Table>)

const NotificationsTable = ({ notifications, translate }) => (<Table>
    <TableHead>
        <TableRow>
            <TableCell>
                {translate.current_status}
            </TableCell>
            <TableCell>
                {translate.send_type}
            </TableCell>
            <TableCell>
                {translate.send_date}
            </TableCell>
            <TableCell>
                {translate.last_date_updated}
            </TableCell>
        </TableRow>
    </TableHead>
    <TableBody>
        {notifications.map((notification) => (<TableRow key={`notification_${notification.id}`}>
            <TableCell>
                <Tooltip title={translate[ CBX.getTranslationReqCode(notification.reqCode) ]}>
                    <img
                        style={{
                            height: '2.1em',
                            width: 'auto'
                        }}
                        src={CBX.getEmailIconByReqCode(notification.reqCode)}
                        alt="email-state-icon"
                    />
                </Tooltip>
            </TableCell>
            <TableCell>
                {translate[ CBX.getSendType(notification.sendType) ]}
            </TableCell>
            <TableCell>
                {moment(notification.sendDate).isValid() ? moment(notification.sendDate).format('LLL') : '-'}
            </TableCell>
            <TableCell>
                {moment(notification.refreshDate).isValid() ? moment(notification.refreshDate).format('LLL') : '-'}
            </TableCell>
        </TableRow>))}
    </TableBody>
</Table>)

export default compose(graphql(liveParticipant, {
    options: (props) => ({
        variables: {
            participantId: props.id
        }
    })
}), graphql(updateLiveParticipant, {
    name: 'updateLiveParticipant'
}), graphql(updateLiveParticipantSends, {
    name: 'updateLiveParticipantSends'
}))(LiveParticipantEditor);