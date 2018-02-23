import React, { Component, Fragment } from 'react';
import moment from 'moment/min/moment-with-locales';
import { urlParser } from '../../utils';
import { graphql } from 'react-apollo';
import { openRoom } from '../../queries';
import { BasicButton, AlertConfirm } from '../displayComponents';
import { primary } from '../../styles/colors';
import { FontIcon, Checkbox } from 'material-ui';

class OpenRoomButton extends Component {

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

    openRoom = async () => { 
        const { council } = this.props;
        const response = await this.props.openRoom({
            variables: {
                data: urlParser({
                    data: {
                        id: council.id,
                        state: 20,
                        noVideoEmails: !this.state.sendCredentials,
                        name: council.name,
                        timezone: moment().utcOffset(),
                        language: council.language,
                        councilType: council.council_type
                    }
                })
            }
        });
        if(response){
            this.props.refetch();
        }
    }

    render(){
        const { translate } = this.props;

        return(
            <Fragment>
                <div className="col-lg-6 col-md-12 col-xs-12" style={{marginTop: '0.6em'}}>
                    <BasicButton
                        text={translate.open_room}
                        color={primary}
                        onClick={() => this.setState({ confirmModal: true})}
                        textPosition="before"
                        icon={<FontIcon className="material-icons" style={{fontSize: '1.1em' }} color={'white'}>play_arrow</FontIcon>}                                    
                        buttonStyle={{width: '11em'}}                                    
                        textStyle={{color: 'white', fontSize: '0.65em', fontWeight: '700', textTransform: 'none'}}
                    />
                </div>
                <AlertConfirm 
                    title={translate.open_room}
                    bodyText={
                        <Fragment>
                            <div>{translate.open_room_continue}</div>
                            <Checkbox
                                label={translate.send_video_credentials}
                                checked={this.state.sendCredentials}
                                onCheck={(event, isInputChecked) => this.setState({
                                    sendCredentials: isInputChecked
                                })}
                            />
                            <a href="https://video.councilbox.com/#/videoInstructions/es" target="_blank"><div 
                                dangerouslySetInnerHTML={{__html: translate.room_permits_firs_time_msg}}
                                style={{color: primary}}
                            /></a>
                        </Fragment>
                    }
                    open={this.state.confirmModal}
                    buttonAccept={translate.accept}
                    buttonCancel={translate.cancel}
                    modal={true}
                    acceptAction={this.openRoom}
                    requestClose={() => this.setState({ confirmModal: false})}
                />
            </Fragment>

        );
    }

}

export default graphql(openRoom, {
    name: 'openRoom'
}) (OpenRoomButton);