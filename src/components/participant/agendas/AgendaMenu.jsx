import React from 'react';
import { BasicButton, AlertConfirm } from '../../../displayComponents';
import ActHTML from '../../council/writing/actViewer/ActHTML';
import * as CBX from '../../../utils/CBX';
import { Typography } from 'material-ui';
import { getSecondary } from '../../../styles/colors';
import AttachmentDownload from '../../attachments/AttachmentDownload';
import { PARTICIPANT_TYPE } from '../../../constants';
import VotingSection from './VotingSection';
import CustomPointVotingMenu from './CustomPointVotingMenu';
import { isMobile } from '../../../utils/screen';


class AgendaMenu extends React.Component {

    state = {
        voting: true,
        open: false,
        showModal: false,
        reopen: false
    }

    toggle = () => {
        this.setState({
            open: !this.state.open
        })
    }

    activateVoting = () => {
        if (this.state.voting) {
            this.toggle();
        } else {
            if (this.state.open) {
                this.setState({
                    open: false,
                    reopen: true
                });
            } else {
                this.setState({
                    open: true,
                    voting: true
                });
            }
        }
    }


    activateComment = () => {
        if (!this.state.voting) {
            this.toggle(() => { });
        } else {
            if (this.state.open) {
                this.setState({
                    open: false,
                    reopen: true
                });
            } else {
                this.setState({
                    open: true,
                    voting: false
                });
            }
        }
    }

    agendaStateIcon = () => {
        const { agenda } = this.props;
        let icon = 'fa fa-lock colorRed';
        if (CBX.agendaPointNotOpened(agenda)) icon = "fa fa-lock colorRed";
        if (CBX.agendaPointOpened(agenda)) icon = "fa fa-unlock-alt colorGreen";
        if (CBX.agendaClosed(agenda)) icon = "fa fa-lock colorRed";
        return <i className={icon} aria-hidden="true" style={{ marginRight: '0.6em' }}></i>;
    }

    agendaVotingIcon = () => {
        const { agenda } = this.props;
        let icon = 'fa fa-lock colorRed';
        if (CBX.agendaVotingsOpened(agenda)) icon = "fa fa-unlock-alt colorGreen";
        return <i className={icon} aria-hidden="true" style={{ marginRight: '0.6em' }}></i>;
    }

    agendaVotingMessage = () => {
        const { translate, agenda } = this.props;
        if (!CBX.agendaVotingsOpened(agenda)) return translate.agenda_votations_closed;
        return translate.voting_open;
    }

    canComment = (agenda, participant) => {
        return true;
    }

    agendaStateMessage = () => {
        const { translate, agenda } = this.props;
        if (CBX.agendaPointNotOpened(agenda)) return translate.discussion_not_started;
        if (CBX.agendaPointOpened(agenda)) return translate.in_discussion;
        if (CBX.agendaClosed(agenda)) return translate.closed;
        if (CBX.agendaVotingsOpened(agenda)) return translate.agenda_votations_closed;
    }

    render() {
        const { translate, agenda, council} = this.props;
        const secondary = getSecondary();
        const ownVote = CBX.findOwnVote(agenda.votings, this.props.participant);
        // CBX.councilHasVideo(council)
        return (
            <div>
                <Typography style={{ fontWeight: '700', fontSize: '16px' }}>
                    {/* {this.agendaStateIcon()} */}
                    {/* {this.agendaStateMessage()} */}
                </Typography>
                {agenda.attachments &&
                    agenda.attachments.filter(attachment => attachment.state !== 2).map(attachment =>
                        <AttachmentDownload attachment={attachment} key={`attachment_${attachment.id}`} agenda />
                    )
                }
                {CBX.hasVotation(agenda.subjectType) && agenda.subjectType !== CBX.getActPointSubjectType() && this.props.participant.type !== PARTICIPANT_TYPE.GUEST &&
                    <React.Fragment>
                        <div style={{ marginTop: '0.8em', paddingRight: '2em' }}>
                            <Typography style={{ fontWeight: '700', fontSize: '16px' }}>
                                {/* {this.agendaVotingIcon()} */}
                                {/* {this.agendaVotingMessage()} */}
                            </Typography>
                        </div>
                        <React.Fragment>
                            {((agenda.votings && agenda.votings.length > 0) && ownVote) ?
                                <React.Fragment>
                                    {checkVotings(agenda.votings) &&
                                        <React.Fragment>
                                            {!!ownVote.delegateId && (ownVote.delegateId !== this.props.participant.id) ?
                                                translate.your_vote_is_delegated
                                                :
                                                <React.Fragment>
                                                    {CBX.isCustomPoint(agenda.subjectType) ?
                                                        <CustomPointVotingMenu
                                                            agenda={agenda}
                                                            refetch={this.props.refetch}
                                                            ownVote={ownVote}
                                                            council={this.props.council}
                                                            translate={translate}
                                                        />
                                                        :
                                                        <VotingSection
                                                            disabledColor={!CBX.agendaVotingsOpened(agenda)}
                                                            agenda={agenda}
                                                            ownVote={ownVote}
                                                            open={this.state.open}
                                                            council={this.props.council}
                                                            voting={this.state.voting}
                                                            translate={translate}
                                                            activateVoting={this.activateVoting}
                                                            refetch={this.props.refetch}
                                                            toggle={this.toggle}
                                                            hasVideo={council.councilType}
                                                        />
                                                    }
                                                </React.Fragment>
                                            }
                                        </React.Fragment>
                                    }
                                </React.Fragment>
                                :
                                
                                <>
                                    {(agenda.votingState > 0 &&
                                        !ownVote &&
                                        !(this.props.participant.type === PARTICIPANT_TYPE.PARTICIPANT && this.props.participant.numParticipations === 0)
                                        ) &&
                                        translate.cant_exercise_vote
                                    }
                                    <VotingSection
                                        disabledColor={!CBX.agendaVotingsOpened(agenda) || !ownVote}
                                        agenda={agenda}
                                        ownVote={ownVote}
                                        open={this.state.open}
                                        council={this.props.council}
                                        voting={this.state.voting}
                                        translate={translate}
                                        activateVoting={this.activateVoting}
                                        refetch={this.props.refetch}
                                        toggle={this.toggle}
                                    />
                                </>
                            }
                        </React.Fragment>
                    </React.Fragment>
                }
                {agenda.subjectType === CBX.getActPointSubjectType() && this.props.participant.type !== PARTICIPANT_TYPE.GUEST &&
                    <div style={{ marginTop: '0.8em', paddingRight: '2em' }}>

                        {!CBX.agendaVotingsOpened(agenda) ?
                            <Typography variant="caption" style={{ fontSize: '0.8rem' }}>{translate.agenda_votations_closed}</Typography>
                            :
                            <React.Fragment>
                                <BasicButton
                                    text={this.props.translate.show_act_draft}
                                    textStyle={{ color: secondary, fontWeight: '700' }}
                                    buttonStyle={{ border: `2px solid ${secondary}`, marginBottom: '1.2em' }}
                                    color={'white'}
                                    onClick={() => this.setState({
                                        showModal: true
                                    })}
                                />
                                <div style={{ marginTop: '0.8em', paddingRight: '2em' }}>
                                    <Typography style={{ fontWeight: '700', fontSize: '16px' }}>
                                        {/* {this.agendaVotingIcon()} */}
                                        {/* {this.agendaVotingMessage()} */}
                                    </Typography>
                                </div>
                                {CBX.agendaVotingsOpened(agenda) &&
                                    <React.Fragment>
                                        {(agenda.votings && agenda.votings.length > 0) ?
                                            <React.Fragment>
                                                {checkVotings(agenda.votings) &&
                                                    <VotingSection
                                                        agenda={agenda}
                                                        disabledColor={!CBX.agendaVotingsOpened(agenda) || !ownVote}
                                                        ownVote={ownVote}
                                                        open={this.state.open}
                                                        council={this.props.council}
                                                        voting={this.state.voting}
                                                        translate={translate}
                                                        activateVoting={this.activateVoting}
                                                        refetch={this.props.refetch}
                                                        toggle={this.toggle}
                                                    />
                                                }
                                            </React.Fragment>
                                            :
                                            translate.cant_exercise_vote
                                        }
                                    </React.Fragment>
                                }
                            </React.Fragment>
                        }
                    </div>
                }
                <AlertConfirm
                    requestClose={() => this.setState({ showModal: false })}
                    open={this.state.showModal}
                    acceptAction={() => this.setState({ showModal: false })}
                    buttonAccept={translate.accept}
                    PaperProps={isMobile ? {
                        style: {
                            width: '100vw',
                            margin: '0'
                        }
                    } : {}}
                    bodyText={
                        <div>
                            <ActHTML
                                council={this.props.council}
                            />
                        </div>
                    }
                    title={translate.edit}
                />
            </div>
        )
    }
}

const checkVotings = votings => {
    const result = votings.find(voting => voting.numParticipations > 0);
    return !!result;
}

export default AgendaMenu;