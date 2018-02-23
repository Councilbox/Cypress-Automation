import React, { Component, Fragment } from 'react';
import { graphql, compose } from 'react-apollo';
import { openVoting, closeVoting } from '../../queries';
import { BasicButton } from '../displayComponents';
import { primary } from '../../styles/colors';
import { FontIcon } from 'material-ui';

class ToggleAgendaButton extends Component {

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
                sendCredentials: !nextProps.council.video_emails_date
            })
        }
    }

    openVoting = async () => {
        const { council, agenda } = this.props;
        const response = await this.props.openVoting({
            variables: {
                agenda: {
                    id: agenda.id, 
                    council_id: agenda.council_id,
                    subject_type: agenda.subject_type,
                    voting_state: 1,
                    date_start_votation: new Date().toISOString(),
                    send_points_mode: council.send_points_mode,
                    notify_points: 0,
                    language: council.language
                }
            }
        });
        if(response){
            this.props.refetch();
        }
    }

    closeVoting = async () => {
        const { agenda } = this.props.council;
        const response = await this.props.closeVoting({
            variables: {
                agenda: {
                    id: agenda.id,
                    council_id: agenda.council_id,
                    point_state: 2,
                    date_end: new Date().toISOString()
                }
            }
        });
        if(response){
            this.props.refetch();
        }
    }

    render(){
        const { translate, agenda } = this.props;

        return(
            <Fragment>
                {agenda.voting_state === 0?
                    <BasicButton
                        text={translate.active_votings}
                        color={'white'}
                        onClick={this.openVoting}
                        textPosition="before"
                        icon={<FontIcon className="material-icons" style={{fontSize: '1.1em' }}color={primary}>thumbs_up_down</FontIcon>}                                    
                        buttonStyle={{width: '11em'}}                                    
                        textStyle={{fontSize: '0.65em', fontWeight: '700', textTransform: 'none', color: primary}}
                    />
                :
                    <BasicButton
                        text={translate.close_point}
                        color={primary}
                        textPosition="before"
                        icon={<FontIcon className="material-icons" style={{fontSize: '1.1em' }} color={'white'}>lock_open</FontIcon>}
                        buttonStyle={{width: '11em'}}
                        onClick={this.closeVoting}
                        textStyle={{fontSize: '0.65em', fontWeight: '700', textTransform: 'none', color: 'white'}}
                    />
                }                
            </Fragment>

        );
    }

}

export default compose(
    graphql(openVoting, {
        name: 'openVoting'
    }),

    graphql(closeVoting, {
        name: 'closeVoting'
    })
 ) (ToggleAgendaButton);