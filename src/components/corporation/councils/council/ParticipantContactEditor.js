import React from 'react';
import { TextInput, BasicButton } from '../../../../displayComponents';
import { getSecondary } from '../../../../styles/colors';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { resendRoomEmails } from "../../../../queries/liveParticipant";
import { moment } from '../../../../containers/App';

class ParticipantContactEditor extends React.Component {

    state = {
        email: this.props.participant.email,
        phone: this.props.participant.phone,
        sendsLoading: false,
        loading: false
    }

    updateParticipantContactInfo = async () => {
        this.setState({
            loading: true
        });

        const response = await this.props.updateParticipantContactInfo({
            variables: {
                participantId: this.props.participant.id,
                email: this.state.email,
                phone: this.state.phone
            }
        })
        this.setState({
            loading: false
        });
    }

    resendRoomEmails = async () => {
        this.setState({
            sendsLoading: true
        });

        await this.props.resendRoomEmails({
			variables: {
				councilId: this.props.council.id,
				timezone: moment().utcOffset(),
				participantsIds: [this.props.participant.id]
			}
		});

        this.setState({
            sendsLoading: false
        });
    }

    updateEmail = event => {
        this.setState({
            email: event.target.value
        });
    }

    updatePhone = event => {
        this.setState({
            phone: event.target.value
        });
    }

    render(){
        const secondary = getSecondary();

        return (
            <div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextInput
                        value={this.state.email}
                        floatingText={this.props.translate.email}
                        onChange={this.updateEmail}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextInput
                        value={this.state.phone}
                        floatingText={this.props.translate.phone}
                        onChange={this.updatePhone}
                    />
                </div>
                <div style={{display: 'flex'}}>
                    <BasicButton
                        color={secondary}
                        text="Reenviar credenciales a este participante"
                        textStyle={{ color: 'white', fontWeight: '700' }}
                        loading={this.state.sendsLoading}
                        onClick={this.resendRoomEmails}
                    />
                    <BasicButton
                        color={secondary}
                        text="Guardar"
                        onClick={this.updateParticipantContactInfo}
                        loading={this.state.loading}
                        textStyle={{ color: 'white', fontWeight: '700' }}
                    />
                </div>
            </div>
        )
    }
}

const updateParticipantContactInfo = gql`
    mutation UpdateParticipantContactInfo($participantId: Int!, $email: String!, $phone: String!){
        updateParticipantContactInfo(participantId: $participantId, email: $email, phone: $phone){
            success
            message
        }
    }
`;

export default compose(
    graphql(updateParticipantContactInfo, {
        name: 'updateParticipantContactInfo'
    }),
    graphql(resendRoomEmails, {
        name: 'resendRoomEmails'
    })
)(ParticipantContactEditor);