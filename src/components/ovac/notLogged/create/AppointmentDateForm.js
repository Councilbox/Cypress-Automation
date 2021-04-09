import { Card } from 'material-ui';
import React from 'react';
import Calendar from 'react-calendar';
import { withApollo } from 'react-apollo';
import { getPrimary } from '../../../../styles/colors';
import { Grid, Scrollbar } from '../../../../displayComponents';
import { moment } from '../../../../containers/App';
import OVACTextInput from '../../UI/TextInput';

const getDateOptions = initialDate => {
	const initial = moment(initialDate);
	const actualDate = new Date();

	initial.set({
		hours: initial.day() === actualDate.getDay() ? actualDate.getHours() : 0,
		min: initial.day() === actualDate.getDay() ? actualDate.getMinutes() : 0,
	});

	let initialHours = initial.hours();

	if (initialHours < 9) {
		initialHours = 9;
	}

	const initialMins = initial.minutes();

	const nextMinSection = (Math.floor((initialMins + 15) / 15) * 15) % 60;

	const date = moment(initialDate).set({
		hours: nextMinSection === 0 ? initialHours + 1 : initialHours,
		minutes: nextMinSection
	});

	const endDate = moment(initialDate).set({
		hours: 14,
		minutes: '00'
	});

	const hours = [];

	while (endDate.isAfter(date)) {
		hours.push(date.format('HH:mm'));
		date.add('minutes', 15);
	}

	return hours;
};


const AppointmentDateForm = ({ style, appointment, setState, errors, translate }) => {
	const [scrollHeight, setScrollHeight] = React.useState(null);
	const containerRef = React.useRef();
	const primary = getPrimary();

	React.useLayoutEffect(() => {
		if (containerRef.current) {
			setScrollHeight(containerRef.current.offsetHeight);
		}
	}, [containerRef]);

	let dateText = '-';

	if (appointment.date && appointment.time) {
		const date = moment(appointment.date);
		const time = appointment.time.split(':');

		date.set({
			hours: time[0],
			minutes: time[1]
		});

		dateText = `${date.format('DD / MMMM / yyyy - hh:mm')}h`;
	}

	return (
		<Card
			elevation={4}
			style={{
				padding: '1.5em',
				border: `1px solid ${primary}`,
				...style
			}}
		>
			<h6 style={{
				fontWeight: '700',
				color: primary
			}}>{translate.appointment_date_time}</h6>
			{errors.date &&
				<div style={{ color: 'red' }}>{errors.date}</div>
			}
			{errors.time &&
				<div style={{ color: 'red' }}>{errors.time}</div>
			}
			<OVACTextInput
				value={dateText}
				labelNone
				style={{
					marginTop: 0
				}}
			/>
			<Grid spacing={0}>
				<div ref={containerRef} style={{ border: '2px solid silver', padding: '1em', width: '60%', borderRadius: '5px' }}>
					<Calendar
						showNeighboringMonth={false}
						prevLabel={
							<div>
								<i className="fa fa-angle-left" ></i>
							</div>
						}
						nextLabel={
							<div>
								<i className="fa fa-angle-right" >
								</i>
							</div>
						}
						onChange={date => setState({ date, time: null })}
						value={appointment.date}
						minDetail={'month'}
					/>
				</div>
				<div
					style={{
						width: '40%',
						paddingLeft: '20px',
						height: '100%',
						overflow: 'hidden',
						...(scrollHeight ? {
							height: `${scrollHeight}px`
						} : {}),
					}}
				>
					<Scrollbar>
						<div style={{ flexGrow: 1 }}>
							{getDateOptions(appointment.date, appointment.time).map(time => (
								<DateButton
									key={time}
									date={time}
									selected={appointment.time === time}
									onClick={() => setState({
										time
									})}
									time={appointment.time}
								/>
							))}
						</div>
					</Scrollbar>
				</div>
			</Grid>

		</Card>
	);
};


const DateButton = ({ date, onClick, selected }) => {
	const primary = getPrimary();

	return (
		<div
			onClick={onClick}
			style={{
				border: '2px solid #979797',
				borderRadius: '5px',
				width: '100%',
				height: 'calc(16.6666% - 5px)',
				padding: '0.6em',
				fontWeight: '500',
				cursor: 'pointer',
				userSelect: 'none',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				marginBottom: '5px',
				...(selected ? {
					color: 'white',
					backgroundColor: primary
				} : {})
			}}
		>
			{date}
		</div>
	);
};

export default withApollo(AppointmentDateForm);
