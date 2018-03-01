import React, { Component, Fragment } from 'react';
import { graphql, compose } from 'react-apollo';
import { openAgenda, closeAgenda } from '../../queries';
import { BasicButton } from '../displayComponents';
import { getPrimary } from '../../styles/colors';
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

    openAgenda = async () => {
        const { agenda } = this.props;
        const response = await this.props.openAgenda({
            variables: {
                agenda: {
                    id: agenda.id,
                    council_id: agenda.council_id,
                    point_state: 1,
                    date_start: new Date().toISOString()
                }
            }
        });
        if(response){
            this.props.refetch();
        }
    }

    closeAgenda = async () => {
        const { agenda } = this.props;
        const response = await this.props.closeAgenda({
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
        const { translate, agenda, active } = this.props;
        const primary = getPrimary();

        return(
            <Fragment>
                {agenda.point_state === 0?
                    active?
                        <BasicButton
                            text={translate.discuss_agenda}
                            color={'white'}
                            textPosition="before"
                            icon={<FontIcon className="material-icons" style={{fontSize: '1.1em' }}color={primary}>lock_open</FontIcon>}
                            buttonStyle={{width: '11em'}}
                            onClick={this.openAgenda}
                            textStyle={{fontSize: '0.65em', fontWeight: '700', textTransform: 'none', color: primary}}
                        />
                    :
                        <span>{translate.warning_unclosed_agenda}</span>
                :
                    <BasicButton
                        text={translate.close_point}
                        color={primary}
                        textPosition="before"
                        icon={<FontIcon className="material-icons" style={{fontSize: '1.1em' }} color={'white'}>lock_open</FontIcon>}
                        buttonStyle={{width: '11em'}}
                        onClick={this.closeAgenda}
                        textStyle={{fontSize: '0.65em', fontWeight: '700', textTransform: 'none', color: 'white'}}
                    />
                }                
            </Fragment>

        );
    }

}

export default compose(
    graphql(openAgenda, {
        name: 'openAgenda'
    }),

    graphql(closeAgenda, {
        name: 'closeAgenda'
    })
 ) (ToggleAgendaButton);