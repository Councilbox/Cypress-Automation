import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import gql from 'graphql-tag';
import { TextInput, BasicButton } from '../../../../displayComponents';
import { getSecondary } from '../../../../styles/colors';
import { resendRoomEmails as changeResendRoomEmails } from '../../../../queries/liveParticipant';
import { moment } from '../../../../containers/App';
import { useOldState } from '../../../../hooks';
import { updateParticipantSends as changeParticipantSends } from '../../../../queries';
import { hasAccessKey } from '../../../../utils/CBX';


const ParticipantContactEditor = ({
	translate, council, client, updateParticipantSends, sendAccessKey, participant, ...props
}) => {
	const [state, setState] = useOldState({
		email: participant.email,
		phone: participant.phone,
		sendsLoading: false,
		loading: false
	});
	const [roomLink, setRoomLink] = React.useState('');
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
		});
		setState({
			loading: false
		});
	};

	const getParticipantRoomLink = async () => {
		const response = await client.query({
			query: gql`
				query ParticipantRoomLink($participantId: Int!){
					participantRoomLink(participantId: $participantId)
				}
			`,
			variables: {
				participantId: participant.id
			}
		});
		setRoomLink(response.data.participantRoomLink);
	};

	const resendRoomEmails = async () => {
		setState({
			sendsLoading: true
		});

		await props.resendRoomEmails({
			variables: {
				councilId: council.id,
				timezone: moment().utcOffset().toString(),
				participantsIds: [participant.id]
			}
		});

		props.refetch();

		setState({
			sendsLoading: false
		});
	};

	const sendParticipantPortalAccessMail = async () => {
		await client.mutate({
			mutation: gql`
				mutation sendPortalConfirmation($participantId: Int!, $type: String){
					sendShareholderConfirmation(participantId: $participantId, type: $type){
						success
					}
				}
			`,
			variables: {
				participantId: participant.participantId,
				type: 'ACCESS'
			}
		});
	};

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
				timezone: moment().utcOffset().toString()
			}
		});

		if (response.errors) {
			if (response.errors[0].message === 'Invalid phone number') {
				setState({
					phoneError: translate.invalid_phone,
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
	};

	const updateEmail = event => {
		setState({
			email: event.target.value
		});
	};

	const updatePhone = event => {
		setState({
			phone: event.target.value
		});
	};

	return (
		<div>
			<div style={{ display: 'flex', alignItems: 'center', paddingBottom: '10px' }}>
				<TextInput
					value={state.email}
					floatingText={translate.email}
					onChange={updateEmail}
				/>
			</div>
			<div style={{ display: 'flex', alignItems: 'center', paddingBottom: '10px' }}>
				<TextInput
					value={state.phone}
					floatingText={translate.phone}
					onChange={updatePhone}
				/>
			</div>
			<div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px' }}>
				<BasicButton
					color={secondary}
					text="Reenviar credenciales a este participante"
					textStyle={{ color: 'white', fontWeight: '700' }}
					loading={state.sendsLoading}
					onClick={resendRoomEmails}
				/>
				<BasicButton
					color={secondary}
					text="Obtener link de acceso"
					textStyle={{ color: 'white', fontWeight: '700' }}
					loading={state.sendsLoading}
					onClick={getParticipantRoomLink}
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
					loading={state.loading}
					textStyle={{ color: 'white', fontWeight: '700' }}
				/>
			</div>
			<BasicButton
				color={secondary}
				text="Email email acceso del portal"
				textStyle={{ color: 'white', fontWeight: '700' }}
				// loading={state.sendsLoading}
				onClick={sendParticipantPortalAccessMail}
			/>
			{roomLink
				&& <>
					<div style={{ wordWrap: 'break-word', width: '100%' }}>
						{roomLink}
					</div>
				</>
			}
			{hasAccessKey(council)
				&& <BasicButton
					color={secondary}
					text="Enviar contraseña de entrada"
					onClick={resendRoomAccessKey}
					loading={state.sendsLoading}
					textStyle={{ color: 'white', fontWeight: '700' }}
				/>
			}
		</div>
	);
};


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
	graphql(changeParticipantSends, {
		name: 'updateParticipantSends'
	}),
	graphql(changeResendRoomEmails, {
		name: 'resendRoomEmails'
	}),
	graphql(sendParticipantRoomKey, {
		name: 'sendAccessKey'
	}),
	withApollo
)(ParticipantContactEditor);
