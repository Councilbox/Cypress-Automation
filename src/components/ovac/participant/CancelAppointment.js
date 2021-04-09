import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { AlertConfirm } from '../../../displayComponents';
import { moment } from '../../../containers/App';


const CancelAppointment = ({ trigger, translate, appointment, client, refetch }) => {
	const [modal, setModal] = React.useState(false);

	const cancelAppointment = async () => {
		await client.mutate({
			mutation: gql`
				mutation cancelAppointment($councilId: Int!){
					cancelAppointment(councilId: $councilId) {
						success
						message
					}
				}
			`,
			variables: {
				councilId: appointment.id
			}
		});
		refetch();
	};

	return (
		<>
			<div onClick={() => setModal(true)}>
				{trigger}
			</div>
			<AlertConfirm
				open={modal}
				requestClose={() => setModal(false)}
				buttonAccept={translate.accept}
				acceptAction={cancelAppointment}
				buttonCancel={translate.cancel}
				title={translate.cancel_appointment}
				bodyText={
					<div
						dangerouslySetInnerHTML={{
							__html: translate.cancel_appointment_warning.replace(/{{name}}/, appointment.name).replace(/{{date}}/, moment(appointment.dateStart).format('LLL'))
						}}
					/>
				}
			/>
		</>
	);
};

export default withApollo(CancelAppointment);
