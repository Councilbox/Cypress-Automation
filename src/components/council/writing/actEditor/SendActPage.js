import React from 'react';
import SendActModal from './SendActModal';
import ParticipantsWithActTable from './ParticipantsWithActTable';
import { getPrimary } from '../../../../styles/colors';
import { BasicButton, DropDownMenu, AlertConfirm, SuccessMessage } from '../../../../displayComponents';
import { Typography, MenuItem } from 'material-ui';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { moment } from '../../../../containers/App';

class SendActPage extends React.Component {

    state = {
        sendAct: false,
        updating: false,
        attendants: false,
        allConvened: false,
        loading: false
    }

    random = Math.random();

    closeAllConvened = () => {
        this.setState({
            allConvened: false,
        }, () => this.setState({
            success: false,
            loading: false,
            error: false
        }));
    }

    closeAttendants = () => {
        this.setState({
            attendants: false,
        }, () => this.setState({
            success: false,
            loading: false,
            error: false
        }));
    }

    sendActAllConvened = () => {
        this.sendAct('convened');
    }

    sendActAttendants = () => {
        this.sendAct('attendants');
    }

    sendAct = async group => {
        this.setState({
            loading: true
        });
        const response = await this.props.sendAct({
            variables: {
                councilId: this.props.council.id,
                group: group
            }
        })

        if(response.data.sendCouncilAct){
            if(response.data.sendCouncilAct.success){
                this.setState({
                    loading: false,
                    success: true
                });
                this.random = Math.random();
                this.props.refetch();
            }
        }

        if(response.errors){
            this.setState({
                loading: false,
                error: true,
                success: false
            })
        }
    }

    render(){
        const primary = getPrimary();
        const { translate, council } = this.props;

        return(
            <div style={{width: '100%', padding: '1.2em', display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Typography style={{marginRight: '0.6em'}}>
                        {!!council.sendActDate?
                            `${translate.last_time_sent_act}: ${moment(new Date(council.sendActDate)).format('LLL')}`
                        :
                            this.props.translate.act_has_not_been_sent
                        }
                    </Typography>
                    <div>
                        <DropDownMenu
                            color="transparent"
                            Component={() =>
                                <BasicButton
                                    text={!!council.sendActDate? translate.resend_act : translate.send_act}
                                    loading={this.state.updating}
                                    loadingColor={primary}
                                    disabled={this.state.updating}
                                    color={"white"}
                                    textStyle={{
                                        color: primary,
                                        fontWeight: "700",
                                        fontSize: "0.9em",
                                        textTransform: "none"
                                    }}
                                    buttonStyle={{
                                        marginRight: "1em",
                                        border: `2px solid ${primary}`
                                    }}
                                />
                            }
                            textStyle={{ color: primary }}
                            type="flat"
                            items={
                                <React.Fragment>
                                    <MenuItem
                                        onClick={() =>
                                            this.setState({
                                                sendAct: true
                                            })
                                        }
                                    >
                                        {translate.send_to_selected_participants}
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() =>
                                            this.setState({
                                                allConvened: true
                                            })
                                        }
                                    >
                                        {translate.send_to_all_convened}
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() =>
                                            this.setState({
                                                attendants: true
                                            })
                                        }
                                    >
                                        {translate.send_to_all_attendants}
                                    </MenuItem>
                                </React.Fragment>
                            }
                        />
                    </div>
                </div>
                {!!council.sendActDate &&
                    <ParticipantsWithActTable
                        council={council}
                        key={this.random}
                        translate={translate}
                    />

                }
                <AlertConfirm
                    requestClose={this.closeAllConvened}
                    open={this.state.allConvened}
                    acceptAction={this.sendActAllConvened}
                    loadingAction={this.state.loading}
                    hideAccept={this.state.success || this.state.error}
                    buttonAccept={translate.send}
                    cancelAction={this.closeAllConvened}
                    buttonCancel={translate.close}
                    bodyText={this.state.success?
                        <SuccessMessage /> :
                        this.state.error?
                            translate.no_participants_to_send_act
                        :
                            translate.will_send_email_with_act
                    }
                    title={translate.sending_the_minutes}
                />
                <AlertConfirm
                    requestClose={this.closeAttendants}
                    open={this.state.attendants}
                    acceptAction={this.sendActAttendants}
                    loadingAction={this.state.loading}
                    hideAccept={this.state.success || this.state.error}
                    buttonAccept={translate.send}
                    cancelAction={this.closeAttendants}
                    buttonCancel={translate.close}
                    bodyText={this.state.success?
                        <SuccessMessage /> :
                        this.state.error?
                            translate.no_attendees
                        :
                            translate.will_send_email_to_attendees
                    }
                    title={translate.sending_the_minutes}
                />
                <SendActModal
					council={council}
					translate={translate}
					show={this.state.sendAct}
                    refetch={this.props.refetch}
					requestClose={() => this.setState({ sendAct: false, success: false })}
				/>
            </div>
        )
    }
}

export const sendAct = gql`
	mutation SendCouncilAct($councilId: Int!, $participantsIds: [Int], $group: String) {
		sendCouncilAct(
			councilId: $councilId
            participantsIds: $participantsIds,
            group: $group
		) {
			success
			message
		}
	}
`;

export default graphql(sendAct, {
    name: 'sendAct'
})(SendActPage);