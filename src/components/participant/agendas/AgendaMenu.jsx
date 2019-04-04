import React from 'react';
import { CollapsibleSection, BasicButton, ButtonIcon, AlertConfirm } from '../../../displayComponents';
import ActHTML from '../../council/writing/actViewer/ActHTML';
import CommentMenu from './CommentMenu';
import * as CBX from '../../../utils/CBX';
import { Typography } from 'material-ui';
import { getPrimary, getSecondary } from '../../../styles/colors';
import AttachmentDownload from '../../attachments/AttachmentDownload';
import { PARTICIPANT_TYPE } from '../../../constants';
import VotingSection from './VotingSection';
import VotingMenu from './VotingMenu';
import CustomPointVotingMenu from './CustomPointVotingMenu';



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
        if (CBX.agendaPointOpened(agenda)) icon = "fa fa-unlock-alt colorGren";
        if (CBX.agendaClosed(agenda)) icon = "fa fa-lock colorRed";
        return <i className={icon} aria-hidden="true" style={{ marginRight: '0.6em' }}></i>;
    }

    findOwnVote = (votings, participant) => {
        return votings.find(voting => (
            voting.participantId === participant.id
            || voting.delegateId === participant.id ||
            voting.author.representative.id === participant.id
        ));
    }

    agendaVotingIcon = () => {
        const { agenda } = this.props;
        let icon = 'fa fa-lock colorRed';
        if (CBX.agendaVotingsOpened(agenda)) icon = "fa fa-unlock-alt colorGren";
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
        const { translate, agenda, horizontal } = this.props;
        const secondary = getSecondary();
        const primary = getPrimary();

        const ownVote = this.findOwnVote(agenda.votings, this.props.participant);
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
                {CBX.hasVotation(agenda.subjectType) && this.props.participant.type !== PARTICIPANT_TYPE.GUEST &&
                    <React.Fragment>
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
                                            <React.Fragment>
                                                {!!ownVote.delegateId && (ownVote.delegateId !== this.props.participant.id) ?
                                                    translate.your_vote_is_delegated
                                                    :
                                                    <CustomPointVotingMenu
                                                        // agenda={agenda}
                                                        translate={translate}
                                                    />
                                                    // <VotingSection
                                                    //     agenda={agenda}
                                                    //     open={this.state.open}
                                                    //     council={this.props.council}
                                                    //     voting={this.state.voting}
                                                    //     translate={translate}
                                                    //     activateVoting={this.activateVoting}
                                                    //     refetch={this.props.refetch}
                                                    //     toggle={this.toggle}
                                                    // />
                                                }
                                            </React.Fragment>
                                        }
                                        {/**Esto es el comentario a la votacion */}
                                        {/* {this.canComment(agenda, this.props.participant) && CBX.councilHasComments(this.props.council.statute) &&
                                            <CommentMenu
                                                agenda={agenda}
                                                participant={this.props.participant}
                                                translate={this.props.translate}
                                                refetch={this.props.refetch}
                                            />
                                        } */}
                                    </React.Fragment>
                                    :
                                    translate.cant_exercise_vote
                                }
                            </React.Fragment>
                        }
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
                                                        open={this.state.open}
                                                        council={this.props.council}
                                                        voting={this.state.voting}
                                                        translate={translate}
                                                        activateVoting={this.activateVoting}
                                                        refetch={this.props.refetch}
                                                        toggle={this.toggle}
                                                    />
                                                }
                                                {this.canComment(agenda, this.props.participant) && CBX.councilHasComments(this.props.council.statute) &&
                                                    <CommentMenu
                                                        agenda={agenda}
                                                        participant={this.props.participant}
                                                        translate={this.props.translate}
                                                        refetch={this.props.refetch}
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