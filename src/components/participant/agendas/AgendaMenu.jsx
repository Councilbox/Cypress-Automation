import React from 'react';
import { CollapsibleSection, BasicButton } from '../../../displayComponents';
import VotingMenu from './VotingMenu';
import * as CBX from '../../../utils/CBX';
import { Typography } from 'material-ui';
import { getPrimary, getSecondary } from '../../../styles/colors';

class AgendaMenu extends React.Component {

    state = {
        voting: true,
        open: false,
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
            this.setState({
                open: false,
                reopen: true
            });
        }
    }


    activateComment = () => {
        if(!this.state.voting){
            this.toggle(() => {});
        }else{
            this.setState({
                open: false,
                reopen: true
            });
        }
    }

    agendaStateMessage = () => {
        const { translate, agenda } = this.props;
        if(CBX.agendaPointNotOpened(agenda)) return 'Discusión no iniciada'//TRADUCCION
        if(CBX.agendaPointOpened(agenda)) return translate.in_discussion;
        if(CBX.agendaClosed(agenda)) return translate.closed;
        if(CBX.agendaVotingsOpened(agenda)) return translate.agenda_votations_closed;
    }

    render(){
        const { translate, agenda } = this.props;
        const secondary = getSecondary();
        const primary = getPrimary();
        console.log(agenda);

        return(
            <div>
                <Typography variant="body1" style={{color: secondary, fontWeight: '700'}}>
                    {translate[CBX.getAgendaTypeLabel(agenda)]}
                </Typography>
                <Typography variant="caption" style={{fontSize: '0.8rem'}}>{this.agendaStateMessage()}</Typography>
                {CBX.hasVotation(agenda.subjectType) &&
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
                                            color={primary}
                                            text={'Votar'}
                                            textStyle={{color: 'white'}}
                                            buttonStyle={{
                                                float: 'left'
                                            }}
                                            onClick={this.activateVoting}
                                        />
                                        <BasicButton
                                            color={primary}
                                            text={'Comentar'}
                                            textStyle={{color: 'white'}}
                                            buttonStyle={{
                                                float: 'left'
                                            }}
                                            onClick={this.activateComment}
                                        />
                                    </div>
                                }
                                collapse={() => this.state.voting?
                                    <VotingMenu
                                        translate={this.props.translate}
                                        agenda={agenda}
                                    />
                                :
                                    <div
                                        style={{
                                            width: '100%',
                                            backgroundColor: 'white',
                                            height: '6em',
                                            display: 'flex',
                                            flexDirection: 'row'
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: '100%',
                                                width: '33.3333%',
                                                backgroundColor: 'black'
                                            }}
                                        >
                                            SI
                                        </div>
                                        <div
                                            style={{
                                                height: '100%',
                                                width: '33.3333%',
                                                backgroundColor: 'white'
                                            }}
                                        >
                                            NO
                                        </div>
                                        <div
                                            style={{
                                                height: '100%',
                                                width: '33.3333%',
                                                backgroundColor: 'grey'
                                            }}
                                        >
                                            ABSTENCION
                                        </div>
                                    </div>
                                }
                            />
                    }
                    </div>
                }
            </div>
        )
    }
}

export default AgendaMenu;