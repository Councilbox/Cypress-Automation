import gql from 'graphql-tag';
import React from 'react';
import { withApollo } from 'react-apollo';
import { AlertConfirm, BasicButton } from '../../../../../displayComponents';
import { getSecondary } from '../../../../../styles/colors';


const DeleteAgendaButton = ({ agenda, council, translate, client, refetch, requestClose }) => {
	const [modal, setModal] = React.useState(false);

	const removeAgendaPoint = async () => {
		const response = await client.mutate({
			mutation: gql`
				mutation removeAgenda($councilId: Int!, $agendaId: Int!) {
					removeAgenda(councilId: $councilId, agendaId: $agendaId) {
						id
					}
				}
			`,
			variables: {
				councilId: council.id,
				agendaId: agenda.id
			}
		});
		refetch();
		if(requestClose){
			requestClose();
		}
		setModal(false);
	}

	return (
		<>
			<AlertConfirm
				open={modal}
				bodyText={translate.remove_agenda_point_warning.replace(/{{subject}}/, agenda.agendaSubject)}
				title={translate.warning}
				buttonAccept={translate.accept}
				buttonCancel={translate.cancel}
				acceptAction={removeAgendaPoint}
				requestClose={() => setModal(false)}
			/>
			<BasicButton
				text={translate.remove_agenda_point}
				color="white"
				buttonStyle={{
					border: `1px solid ${getSecondary()}`
				}}
				textStyle={{
					color: getSecondary()
				}}
				onClick={() => setModal(true)}
			/>
		</>
	)
}

export default withApollo(DeleteAgendaButton)