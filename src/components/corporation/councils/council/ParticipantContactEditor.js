import React from 'react';
import { TextInput, BasicButton } from '../../../../displayComponents';
import { getSecondary } from '../../../../styles/colors';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { resendRoomEmails } from "../../../../queries/liveParticipant";
import { moment } from '../../../../containers/App';
import { useOldState } from '../../../../hooks';
import { updateParticipantSends } from '../../../../queries';

const ParticipantContactEditor = ({ translate, council, updateParticipantSends, sendAccessKey, participant, ...props }) => {
    const [state, setState] = useOldState({
        email: participant.email,
        phone: participant.phone,
        sendsLoading: false,
        loading: false
    });
    const secondary = getSecondary();


    const updateParticipantContactInfo = async () => {
        setState({
            loading: true
        });

        await props.updateParticipantContactInfo({
            variables: {
                participantId: participant.id,
                email: state.email,
                phone: state.phone
            }
        })
        setState({
            loading: false
        });
    }

    const resendRoomEmails = async () => {
        setState({
            sendsLoading: true
        });

        await props.resendRoomEmails({
			variables: {
				councilId: council.id,
				timezone: moment().utcOffset(),
				participantsIds: [participant.id]
			}
        });

        props.refetch();

        setState({
            sendsLoading: false
        });
    }

    const refreshEmailStates = async () => {
		setState({
			sendsLoading: true
		});
		const response = await updateParticipantSends({
			variables: {
				participantId: participant.id
			}
		});

		if (response.data.updateParticipantSends.success) {
			props.refetch();
			setState({
				sendsLoading: false
			});
		}
	};

    const resendRoomAccessKey = async () => {
        setState({
            sendsLoading: true
        });
        const response = await sendAccessKey({
            variables: {
                councilId: council.id,
                participantIds: [participant.id],
                timezone: moment().utcOffset()
            }
        });

        if(response.errors){
            if(response.errors[0].message = 'Invalid phone number'){
                setState({
                    phoneError: translate.invalid_phone_number,
                    loading: false
                });
            }
        } else {
            setState({
                sendsLoading: false,
                phoneError: ''
            });
            props.refetch();
        }
    }

    const updateEmail = event => {
        setState({
            email: event.target.value
        });
    }

    const updatePhone = event => {
        setState({
            phone: event.target.value
        });
    }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextInput
                    value={state.email}
                    floatingText={translate.email}
                    onChange={updateEmail}
                />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextInput
                    value={state.phone}
                    floatingText={translate.phone}
                    onChange={updatePhone}
                />
            </div>
            <div style={{display: 'flex'}}>
                <BasicButton
                    color={secondary}
                    text="Reenviar credenciales a este participante"
                    textStyle={{ color: 'white', fontWeight: '700' }}
                    loading={state.sendsLoading}
                    onClick={resendRoomEmails}
                />
                <BasicButton
                    color={secondary}
                    text="Guardar"
                    onClick={updateParticipantContactInfo}
                    loading={state.loading}
                    textStyle={{ color: 'white', fontWeight: '700' }}
                />
                <BasicButton
                    color={secondary}
                    text="Actualizar"
                    onClick={refreshEmailStates}
                    loading={state.sendsLoading}
                    textStyle={{ color: 'white', fontWeight: '700' }}
                />
                {council.securityType !== 0 &&
                    <BasicButton
                        color={secondary}
                        text="Enviar contraseña de entrada"
                        onClick={resendRoomAccessKey}
                        loading={state.sendsLoading}
                        textStyle={{ color: 'white', fontWeight: '700' }}
                    />
                }
            </div>
        </div>
    )
}


const updateParticipantContactInfo = gql`
    mutation UpdateParticipantContactInfo($participantId: Int!, $email: String!, $phone: String!){
        updateParticipantContactInfo(participantId: $participantId, email: $email, phone: $phone){
            success
            message
        }
    }
`;

const sendParticipantRoomKey = gql`
    mutation SendParticipantRoomKey($participantIds: [Int]!, $councilId: Int!, $timezone: String!){
        sendParticipantRoomKey(participantsIds: $participantIds, councilId: $councilId, timezone: $timezone){
            success
        }
    }
`;


export default compose(
    graphql(updateParticipantContactInfo, {
        name: 'updateParticipantContactInfo'
    }),
    graphql(updateParticipantSends, {
		name: "updateParticipantSends"
	}),
    graphql(resendRoomEmails, {
        name: 'resendRoomEmails'
    }),
    graphql(sendParticipantRoomKey, {
        name: 'sendAccessKey'
    })
)(ParticipantContactEditor);