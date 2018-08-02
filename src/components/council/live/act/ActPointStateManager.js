import React from 'react';
import { BasicButton } from '../../../../displayComponents';
import { AGENDA_STATES } from '../../../../constants';
import { getPrimary } from '../../../../styles/colors';
import ApproveActButton from './ApproveActButton';
import SendActToVote from './SendActToVote';
import ToggleAgendaButton from '../ToggleAgendaButton';
import ToggleVotingsButton from '../ToggleVotingsButton';


class ActPointStateManager extends React.PureComponent {

    state = {
        sendActToVote: false
    }

    render(){
        const { agenda, council, translate, refetch } = this.props;
        const primary = getPrimary();
        
        return (
            <React.Fragment>
                {agenda.pointState === AGENDA_STATES.INITIAL &&
                    <div>
                        <ToggleAgendaButton
                            agenda={agenda}
                            translate={translate}
                            refetch={refetch}
                            active={true}
                        />
                    </div>
                }
                {agenda.votingState === AGENDA_STATES.DISCUSSION &&
                    <ToggleVotingsButton
                        council={council}
                        agenda={agenda}
                        translate={translate}
                        refetch={refetch}
                    />
                }

                 {agenda.votingState === AGENDA_STATES.CLOSED &&
                    <ApproveActButton
                        council={council}
                        agenda={agenda}
                        translate={translate}
                        refetch={refetch}
                    />
                }

                {agenda.pointState === AGENDA_STATES.DISCUSSION && agenda.votingState === AGENDA_STATES.INITIAL &&
                    <React.Fragment>
                        <BasicButton
                            text={translate.save_preview_act}
                            color={primary}
                            textStyle={{
                                color: 'white',
                                fontWeight: "700",
                                fontSize: "0.9em",
                                textTransform: "none"
                            }}
                            onClick={() => this.setState({
                                sendActToVote: true
                            })}
                            buttonStyle={{
                                marginRight: "1em",
                                border: `2px solid ${primary}`
                            }}
                        />
                        <SendActToVote
                            council={council}
                            agenda={agenda}
                            refetch={this.props.refetch}
                            translate={translate}
                            show={this.state.sendActToVote}
                            requestClose={() => this.setState({ sendActToVote: false})}
                        />
                    </React.Fragment>

                }
            </React.Fragment>
        )
    }
}

export default ActPointStateManager;