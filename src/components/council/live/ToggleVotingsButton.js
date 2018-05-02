import React, { Component, Fragment } from 'react';
import { graphql, compose } from 'react-apollo';
import { openAgendaVoting, closeAgendaVoting } from '../../../queries';
import { BasicButton, Icon } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';

class ToggleVotingsButton extends Component {

    constructor(props){
        super(props);
        this.state = {
            sendCredentials: true,
            confirmModal: false
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.council){
            this.setState({
                sendCredentials: !nextProps.council.videoEmailsDate
            })
        }
    }

    openVoting = async () => {
        const { council, agenda } = this.props;
        const response = await this.props.openAgendaVoting({
            variables: {
                agenda: {
                    id: agenda.id, 
                    councilId: agenda.councilId,
                    subjectType: agenda.subjectType,
                    language: council.language
                }
            }
        });
        if(response){
            this.props.refetch();
        }
    }

    closeAgendaVoting = async () => {
        const { agenda } = this.props;
        const response = await this.props.closeAgendaVoting({
            variables: {
                agenda: {
                    id: agenda.id,
                    councilId: agenda.councilId,
                    votingState: 1,
                    subjectType: agenda.subjectType
                }
            }
        });
        if(response){
            this.props.refetch();
        }
    }

    render(){
        const { translate, agenda } = this.props;
        const primary = getPrimary();

        return(
            <Fragment>
                {agenda.votingState === 0?
                    <BasicButton
                        text={translate.active_votings}
                        color={'white'}
                        onClick={this.openVoting}
                        textPosition="before"
                        icon={<Icon className="material-icons" style={{fontSize: '1.1em', color: primary }}>thumbs_up_down</Icon>}                                    
                        buttonStyle={{minWidth: '11em'}}                                    
                        textStyle={{fontSize: '0.65em', fontWeight: '700', textTransform: 'none', color: primary}}
                    />
                :
                    <BasicButton
                        text={translate.close_point_votations}
                        color={primary}
                        textPosition="before"
                        icon={<Icon className="material-icons" style={{fontSize: '1.1em', color: 'white' }}>lock_open</Icon>}
                        buttonStyle={{width: '15em'}}
                        onClick={this.closeAgendaVoting}
                        textStyle={{fontSize: '0.65em', fontWeight: '700', textTransform: 'none', color: 'white'}}
                    />
                }                
            </Fragment>

        );
    }

}

export default compose(
    graphql(openAgendaVoting, {
        name: 'openAgendaVoting'
    }),

    graphql(closeAgendaVoting, {
        name: 'closeAgendaVoting'
    })
 ) (ToggleVotingsButton);