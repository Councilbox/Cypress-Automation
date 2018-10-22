import React from 'react';
import { CollapsibleSection, BasicButton, ButtonIcon, AlertConfirm } from '../../../displayComponents';
import ActHTML from '../../council/writing/actViewer/ActHTML';
import VotingMenu from './VotingMenu';
import CommentMenu from './CommentMenu';
import * as CBX from '../../../utils/CBX';
import { Typography } from 'material-ui';
import { getPrimary, getSecondary } from '../../../styles/colors';
import AttachmentDownload from '../../attachments/AttachmentDownload';
import { PARTICIPANT_TYPE } from '../../../constants';


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
        if(this.state.voting){
            this.toggle();
        }else{
            if(this.state.open){
                this.setState({
                    open: false,
                    reopen: true
                });
            }else{
                this.setState({
                    open: true,
                    voting: true
                });
            }
        }
    }


    activateComment = () => {
        if(!this.state.voting){
            this.toggle(() => {});
        }else{
            if(this.state.open){
                this.setState({
                    open: false,
                    reopen: true
                });
            }else{
                this.setState({
                    open: true,
                    voting: false
                });
            }
        }
    }

    agendaStateIcon = () => {
        const { agenda } = this.props;
        let icon = 'fa fa-lock';
        if(CBX.agendaPointNotOpened(agenda)) icon ="fa fa-lock";
        if(CBX.agendaPointOpened(agenda)) icon = "fa fa-unlock-alt";
        if(CBX.agendaClosed(agenda)) icon = "fa fa-lock";
        //if(CBX.agendaVotingsOpened(agenda)) icon = "fa fa-lock";
        return <i className={icon} aria-hidden="true" style={{marginRight: '0.6em'}}></i>;
    }

    agendaVotingIcon = () => {
        const { agenda } = this.props;
        let icon = 'fa fa-lock';
        if(CBX.agendaVotingsOpened(agenda)) icon ="fa fa-unlock-alt";
        return <i className={icon} aria-hidden="true" style={{marginRight: '0.6em'}}></i>;
    }

    agendaVotingMessage = () => {
        const { translate, agenda } = this.props;
        if(!CBX.agendaVotingsOpened(agenda)) return translate.agenda_votations_closed;
        return translate.voting_open;
    }

    canComment = (agenda, participant) => {
        return true;
    }

    agendaStateMessage = () => {
        const { translate, agenda } = this.props;
        if(CBX.agendaPointNotOpened(agenda)) return translate.discussion_not_started;
        if(CBX.agendaPointOpened(agenda)) return translate.in_discussion;
        if(CBX.agendaClosed(agenda)) return translate.closed;
        if(CBX.agendaVotingsOpened(agenda)) return translate.agenda_votations_closed;
    }

    render(){
        const { translate, agenda } = this.props;
        const secondary = getSecondary();
        const primary = getPrimary();

        return(
            <div>
                <Typography style={{ fontWeight: '700', fontSize: '16px'}}>
                    {this.agendaStateIcon()}
                    {this.agendaStateMessage()}
                </Typography>
                {agenda.attachments &&
                    agenda.attachments.map(attachment =>
                        <AttachmentDownload attachment={attachment} key={`attachment_${attachment.id}`} agenda/>
                    )
                }
                {CBX.hasVotation(agenda.subjectType) && this.props.participant.type !== PARTICIPANT_TYPE.GUEST &&
                    <React.Fragment>
                        <div style={{marginTop: '0.8em', paddingRight: '2em'}}>
                            <Typography style={{ fontWeight: '700', fontSize: '16px'}}>
                                {this.agendaVotingIcon()}
                                {this.agendaVotingMessage()}
                            </Typography>
                        </div>
                        {CBX.agendaVotingsOpened(agenda) &&
                            <React.Fragment>
                                {(agenda.votings && agenda.votings.length > 0)?
                                    <React.Fragment>
                                        <div style={{display: 'flex', alignItems: 'center', marginTop: '0.6em'}}>
                                            <Typography style={{ fontWeight: '700', fontSize: '14px'}}>
                                                {agenda.votings[0].vote === -1 &&
                                                    translate.you_havent_voted_yet
                                                }
                                                {agenda.votings[0].vote === 0 &&
                                                    <React.Fragment>
                                                        {`${translate.you_have_voted}: ${translate.against_btn}`}
                                                    </React.Fragment>
                                                }
                                                {agenda.votings[0].vote === 1 &&
                                                    <React.Fragment>
                                                        {`${translate.you_have_voted}: ${translate.in_favor_btn}`}
                                                    </React.Fragment>
                                                }
                                                {agenda.votings[0].vote === 2 &&
                                                    <React.Fragment>
                                                        {`${translate.you_have_voted}: ${translate.abstention_btn}`}
                                                    </React.Fragment>
                                                }
                                            </Typography>
                                            <BasicButton
                                                color={this.state.voting && this.state.open? primary : 'white'}
                                                text={agenda.votings[0].vote === -1? this.props.translate.exercise_voting : translate.change_vote}
                                                textStyle={{
                                                    color: this.state.voting && this.state.open? 'white' : primary,
                                                    fontWeight: '700',
                                                    fontSize: '14px'
                                                }}
                                                buttonStyle={{
                                                    float: 'left',
                                                    marginLeft: '0.6em',
                                                    padding: '0.3em',
                                                    border: `2px solid ${primary}`
                                                }}
                                                icon={<ButtonIcon type="thumbs_up_down" color={this.state.voting && this.state.open? 'white' : primary}/>}
                                                onClick={this.activateVoting}
                                            />
                                        </div>
                                        <CollapsibleSection
                                            trigger={() => <span/>}
                                            onTriggerClick={() => {}}
                                            open={this.state.open}
                                            collapse={() =>
                                                <VotingMenu
                                                    translate={this.props.translate}
                                                    close={this.toggle}
                                                    refetch={this.props.refetch}
                                                    agenda={agenda}
                                                />
                                            }
                                        />
                                        {this.canComment(agenda, this.props.participant) &&
                                            <CommentMenu
                                                agenda={agenda}
                                                participant={this.props.participant}
                                                translate={this.props.translate}
                                                refetch={this.props.refetch}
                                            />
                                        }
                                    </React.Fragment>//TRADUCCION
                                :
                                    'No puedes ejercer el voto por no estar presente en el momento de apertura de votaciones'
                                }
                            </React.Fragment>
                        }
                    </React.Fragment>
                }
                {agenda.subjectType === CBX.getActPointSubjectType() && this.props.participant.type !== PARTICIPANT_TYPE.GUEST &&
                    <div style={{marginTop: '0.8em', paddingRight: '2em'}}>

                    {!CBX.agendaVotingsOpened(agenda)?
                            <Typography variant="caption" style={{fontSize: '0.8rem'}}>{translate.agenda_votations_closed}</Typography>
                        :
                            <React.Fragment>
                                <BasicButton
                                    text={this.props.translate.show_act_draft}
                                    textStyle={{color: secondary, fontWeight: '700'}}
                                    buttonStyle={{border: `2px solid ${secondary}`, marginBottom: '1.2em'}}
                                    color={'white'}
                                    onClick={() => this.setState({
                                        showModal: true
                                    })}
                                />
                                <CollapsibleSection
                                    open={this.state.open}
                                    onTriggerClick={() => {}}
                                    onClose={() => {
                                        if(this.state.reopen){
                                            this.setState({
                                                open: true,
                                                voting: !this.state.voting,
                                                reopen: false
                                            })
                                        }
                                    }}
                                    style={{
                                        cursor: 'auto'
                                    }}
                                    trigger={() =>
                                        <div style={{
                                            width: '100%',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}>
                                            <BasicButton
                                                color={this.state.voting && this.state.open? primary : 'white'}
                                                text={this.props.translate.exercise_voting}
                                                textStyle={{
                                                    color: this.state.voting && this.state.open? 'white' : primary,
                                                    fontWeight: '700',
                                                    fontSize: '14px'
                                                }}
                                                buttonStyle={{
                                                    float: 'left',
                                                    border: `2px solid ${primary}`
                                                }}
                                                icon={<ButtonIcon type="thumbs_up_down" color={this.state.voting && this.state.open? 'white' : primary}/>}
                                                onClick={this.activateVoting}
                                            />
                                            {CBX.councilHasComments(this.props.council.statute) &&
                                                <BasicButton
                                                    color={!this.state.voting && this.state.open? primary : 'white'}
                                                    text={translate.act_comment_btn}
                                                    textStyle={{
                                                        color: !this.state.voting && this.state.open? 'white' : primary,
                                                        fontWeight: '700',
                                                        fontSize: '14px'
                                                    }}
                                                    buttonStyle={{
                                                        float: 'left',
                                                        border: `2px solid ${primary}`
                                                    }}
                                                    icon={<ButtonIcon type="mode_edit" color={!this.state.voting && this.state.open? 'white' : primary}/>}
                                                    onClick={this.activateComment}
                                                />
                                            }
                                        </div>
                                    }
                                    collapse={() => this.state.voting?
                                        <VotingMenu
                                            translate={this.props.translate}
                                            refetch={this.props.refetch}
                                            agenda={agenda}
                                        />
                                    :
                                        <CommentMenu
                                            agenda={agenda}
                                            translate={this.props.translate}
                                            refetch={this.props.refetch}
                                        />
                                    }
                                />
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

export default AgendaMenu;

/*
<CollapsibleSection
    open={this.state.open}
    onTriggerClick={() => {}}
    onClose={() => {
        if(this.state.reopen){
            this.setState({
                open: true,
                voting: !this.state.voting,
                reopen: false
            })
        }
    }}
    style={{
        cursor: 'auto'
    }}
    trigger={() =>
        <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
        }}>
            
            {CBX.councilHasComments(this.props.council.statute) &&
                <BasicButton
                    color={!this.state.voting && this.state.open? primary : 'white'}
                    text={translate.act_comment_btn}
                    textStyle={{
                        color: !this.state.voting && this.state.open? 'white' : primary,
                        fontWeight: '700',
                        fontSize: '14px'
                    }}
                    buttonStyle={{
                        float: 'left',
                        border: `2px solid ${primary}`
                    }}
                    icon={<ButtonIcon type="mode_edit" color={!this.state.voting && this.state.open? 'white' : primary}/>}
                    onClick={this.activateComment}
                />
            }
        </div>
    }
    collapse={() => this.state.voting?
        <React.Fragment>
            
        </React.Fragment>
    :
        
    }
/>
*/