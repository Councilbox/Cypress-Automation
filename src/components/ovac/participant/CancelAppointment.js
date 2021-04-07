import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { AlertConfirm } from '../../../displayComponents';
import { moment } from '../../../containers/App';


const CancelAppointment = ({ trigger, translate, appointment, client, refetch }) => {
	const [modal, setModal] = React.useState(false);

	const cancelAppointment = async () => {
		const response = await client.mutate({
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

		console.log(response);

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
				title={'Cancelar cita'}
				bodyText={
					<div>
						Esta acción cancelará la reunión <b>{appointment.name}</b> fijada para el día <b>{moment(appointment.dateStart).format('LLL')}.</b>
					</div>
				}
			/>
		</>
	);
};

export default withApollo(CancelAppointment);
