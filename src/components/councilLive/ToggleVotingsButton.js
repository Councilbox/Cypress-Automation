import React, { Component, Fragment } from 'react';
import { graphql, compose } from 'react-apollo';
import { openVoting, closeVoting } from '../../queries';
import { BasicButton, Icon } from '../displayComponents';
import { getPrimary } from '../../styles/colors';

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
        const { agenda } = this.props;
        const response = await this.props.closeVoting({
            variables: {
                agenda: {
                    id: agenda.id,
                    council_id: agenda.council_id,
                    voting_state: 1,
                    subject_type: agenda.subject_type
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
                {agenda.voting_state === 0?
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
 ) (ToggleVotingsButton);