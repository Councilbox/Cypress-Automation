import React, { Component, Fragment } from 'react';
import moment from 'moment/min/moment-with-locales';
import { urlParser } from '../../utils';
import { graphql } from 'react-apollo';
import { openCouncilRoom } from '../../queries';
import { BasicButton, AlertConfirm, Checkbox, Icon } from '../displayComponents';
import { getPrimary } from '../../styles/colors';

class openCouncilRoomButton extends Component {

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

    openCouncilRoom = async () => { 
        const { council } = this.props;
        const response = await this.props.openCouncilRoom({
            variables: {
                council: {
                    id: council.id,
                    name: council.name,
                    language: council.language,
                    councilType: council.councilType
                },
                timezone: moment().utcOffset(),
                noVideoEmails: !this.state.sendCredentials

            }
        });
        if(response){
            this.props.refetch();
        }
    }

    render(){
        const { translate } = this.props;
        const primary = getPrimary();

        return(
            <Fragment>
                <div className="col-lg-6 col-md-12 col-xs-12" style={{marginTop: '0.6em'}}>
                    <BasicButton
                        text={translate.open_room}
                        color={primary}
                        onClick={() => this.setState({ confirmModal: true})}
                        textPosition="before"
                        icon={<Icon className="material-icons" style={{fontSize: '1.1em', color: 'white' }}>play_arrow</Icon>}                                    
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
                                value={this.state.sendCredentials}
                                onChange={(event, isInputChecked) => this.setState({
                                    sendCredentials: isInputChecked
                                })}
                            />
                            <a 
                                href="https://video.councilbox.com/#/videoInstructions/es"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <div 
                                    dangerouslySetInnerHTML={{__html: translate.room_permits_firs_time_msg}}
                                    style={{color: primary}}

                                />
                            </a>
                        </Fragment>
                    }
                    open={this.state.confirmModal}
                    buttonAccept={translate.accept}
                    buttonCancel={translate.cancel}
                    modal={true}
                    acceptAction={this.openCouncilRoom}
                    requestClose={() => this.setState({ confirmModal: false})}
                />
            </Fragment>

        );
    }

}

export default graphql(openCouncilRoom, {
    name: 'openCouncilRoom'
}) (openCouncilRoomButton);