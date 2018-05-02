import React, { Component } from 'react';
import { Checkbox, AlertConfirm, Icon } from "../../../displayComponents";
import { Typography } from 'material-ui';
import { graphql } from 'react-apollo';
import { sendConveneReminder } from '../../../queries';


class ReminderModal extends Component {

    constructor(props){
        super(props);
        this.state = {
            success: '',
            error: '',
            sendAgenda: false
        };
    }

    close = () => {
        this.props.requestClose();
        this.setState({
            success: false,
            sending: false,
            error: false,
            sendAgenda: false
        });
    };

    sendReminder = async () => {
        this.setState({
            sending: true
        });
        const response = await this.props.sendConveneReminder({
            variables: {
                councilId: this.props.council.id,
                includeAgenda: this.state.sendAgenda? 1 : 0,
                confirmAssistance: this.props.council.confirmAssistance
            }
        });
        if(response.data.sendConveneReminder.success){
            this.setState({
                sending: false,
                success: true
            });
        }else{
            this.setState({
                sending: false,
                error: true
            });
        }
    };

    _renderReminderBody(){
        const { translate } = this.props;

        if(this.state.sending){
            return(
                <div>
                    {translate.sending_convene_reminder}
                </div>
            )
        }

        if(this.state.success){
            return(
                <SuccessMessage message={translate.sent} />
            )
        }

        return(
            <div>
                <Checkbox
                    label={translate.include_agenda_points}
                    value={this.state.sendAgenda}
                    onChange={(event, isInputChecked) => this.setState({
                            sendAgenda: isInputChecked
                        })
                    }
                />
            </div>
        )
    }

    render() {
        const { translate } = this.props;

        return(
            <AlertConfirm
                requestClose={this.close}
                open={this.props.show}
                acceptAction={this.state.success? () => this.close() : this.sendReminder}
                buttonAccept={this.state.success? translate.accept : translate.send}
                buttonCancel={translate.close}
                bodyText={this._renderReminderBody()}
                title={translate.send_convene_reminder}
            />
        );
    }
}

export default graphql(
    sendConveneReminder, {
        name: 'sendConveneReminder' 
    }
)(ReminderModal);

const SuccessMessage = ({ message }) => (
    <div style={{width: '500px', display: 'flex', alignItems: 'center', alignContent: 'center', flexDirection: 'column'}}>
        <Icon className="material-icons" style={{fontSize: '6em', color: 'green'}}>
            check_circle
        </Icon>
        <Typography variant="subheading">
            {message}
        </Typography>
    </div>
);