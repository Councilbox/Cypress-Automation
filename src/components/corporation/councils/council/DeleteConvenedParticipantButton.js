import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { AlertConfirm, BasicButton } from '../../../../displayComponents';
import { getSecondary } from '../../../../styles/colors';


const DeleteConvenedParticipantButton = ({
	translate, participant, client, refetch
}) => {
	const [modal, setModal] = React.useState(false);

	const killParticipant = async () => {
		await client.mutate({
			mutation: gql`
				mutation removeConvenedParticipant($participantId: Int!){
					removeConvenedParticipant(participantId: $participantId){
						success
						message
					}
				}
			`,
			variables: {
				participantId: participant.id
			}
		});
		refetch();
		setModal(false);
	};

	return (
		<>
			<BasicButton
				text="Eliminar"
				color="white"
				buttonStyle={{
					border: `1px solid ${getSecondary()}`
				}}
				textStyle={{
					color: getSecondary()
				}}
				onClick={() => setModal(true)}
			/>
			<AlertConfirm
				open={modal}
				requestClose={() => setModal(false)}
				title={translate.warning}
				acceptAction={killParticipant}
				buttonAccept={translate.accept}
				buttonCancel={translate.close}
				bodyText={ `Estás seguro que quieres elimitar al participante ${participant.name} ${participant.surname || ''}`}
			/>
		</>
	);
};

export default withApollo(DeleteConvenedParticipantButton);
