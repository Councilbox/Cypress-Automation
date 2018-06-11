import React from 'react';
import SendActModal from './SendActModal';
import ParticipantsWithActTable from './ParticipantsWithActTable';
import { getPrimary } from '../../../../styles/colors';
import { BasicButton } from '../../../../displayComponents';
import moment from 'moment';
import { Typography } from 'material-ui';

class SendActPage extends React.Component {

    state = {
        sendAct: false,
        updating: false
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
                            onClick={() => this.setState({
                                sendAct: true
                            })}
                            buttonStyle={{
                                marginRight: "1em",
                                border: `2px solid ${primary}`
                            }}
                        />
                    </div>
                </div>
                {!!council.sendActDate &&
                    <ParticipantsWithActTable
                        council={council}
                        translate={translate}
                    />

                }
                
                <SendActModal
					council={council}
					translate={translate}
					show={this.state.sendAct}
                    refetch={this.props.refetch}
					requestClose={() => this.setState({ sendAct: false })}
				/>
            </div>
        )
    }
}

export default SendActPage;