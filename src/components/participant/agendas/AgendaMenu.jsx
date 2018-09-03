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

    agendaStateMessage = () => {
        const { translate, agenda } = this.props;
        if(CBX.agendaPointNotOpened(agenda)) return translate.discussion_not_started
        if(CBX.agendaPointOpened(agenda)) return translate.in_discussion;
        if(CBX.agendaClosed(agenda)) return translate.closed;
        if(CBX.agendaVotingsOpened(agenda)) return translate.agenda_votations_closed;
    }

    render(){
        const { translate, agenda } = this.props;
        const secondary = getSecondary();
        const primary = getPrimary()

        return(
            <div>
                <Typography variant="body1" style={{color: secondary, fontWeight: '700'}}>
                    {translate[CBX.getAgendaTypeLabel(agenda)]}
                </Typography>
                <Typography variant="caption" style={{fontSize: '0.8rem'}}>{this.agendaStateMessage()}</Typography>
                {agenda.attachments &&
                    agenda.attachments.map(attachment =>
                        <AttachmentDownload attachment={attachment} key={`attachment_${attachment.id}`} agenda/>
                    )
                }
                {CBX.hasVotation(agenda.subjectType) && this.props.participant.type !== PARTICIPANT_TYPE.GUEST &&
                    <div style={{marginTop: '0.8em', paddingRight: '2em'}}>
                    {!CBX.agendaVotingsOpened(agenda)?
                            <Typography variant="caption" style={{fontSize: '0.8rem'}}>{translate.agenda_votations_closed}</Typography>
                        :
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
                    }
                    </div>
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