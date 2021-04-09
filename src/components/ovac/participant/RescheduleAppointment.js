import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { AlertConfirm } from '../../../displayComponents';
import { moment } from '../../../containers/App';
import AppointmentDateForm from '../notLogged/create/AppointmentDateForm';

const cleanErrors = {
	date: '',
	time: ''
};

const RescheduleAppointment = ({ trigger, translate, appointment, client, refetch }) => {
	const [{
		date,
		time
	}, setState] = React.useState({
		date: new Date(appointment.dateStart),
		time: moment(appointment.dateStart).format('HH:mm'),
	});
	const [errors, setErrors] = React.useState(cleanErrors);

	const [modal, setModal] = React.useState(false);

	const checkValidDateTime = () => {
		const newErrors = {};

		if (!date) {
			newErrors.date = translate.appointment_date_is_required;
		}

		if (!time) {
			newErrors.time = translate.appointment_time_is_required;
		}

		const hasError = Object.keys(newErrors).length > 0;

		if (hasError) {
			setErrors(newErrors);
		} else {
			setErrors(cleanErrors);
		}

		return !hasError;
	};

	const rescheduleAppointment = async () => {
		if (checkValidDateTime()) {
			const day = moment(date);
			const hour = time.split(':');

			day.set({
				hours: hour[0],
				minutes: hour[1]
			});

			const newDate = day.toISOString();
			await client.mutate({
				mutation: gql`
					mutation RescheduleAppointment($councilId: ID!, $newDate: String!) {
						rescheduleAppointment(councilId: $councilId, newDate: $newDate) {
							success
						}
					}
				`,
				variables: {
					councilId: appointment.id,
					newDate
				}
			});
			await refetch();
			setModal(false);
		}
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
				acceptAction={rescheduleAppointment}
				buttonCancel={translate.cancel}
				title={translate.appointment_reschedule}
				bodyText={
					<div>
						<AppointmentDateForm
							errors={errors}
							translate={translate}
							appointment={{
								...appointment,
								date,
								time
							}}
							setState={object => setState({ date, time, ...object })}
							style={{
								marginTop: '1em'
							}}
						/>
					</div>
				}
			/>
		</>
	);
};

export default withApollo(RescheduleAppointment);
