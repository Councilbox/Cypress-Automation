import { Card } from 'material-ui';
import React from 'react';
import Calendar from 'react-calendar';
import { withApollo } from 'react-apollo';
import { getPrimary } from '../../../../styles/colors';
import { Grid, Scrollbar } from '../../../../displayComponents';


const AppointmentDateForm = ({ style, appointment, setState }) => {
	const [scrollHeight, setScrollHeight] = React.useState(null);
	const containerRef = React.useRef();
	const primary = getPrimary();

	React.useLayoutEffect(() => {
		if (containerRef.current) {
			setScrollHeight(containerRef.current.offsetHeight);
		}
	}, [containerRef]);

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
			}}>Fecha y hora de la cita</h6>
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
						onChange={date => setState({ date })}
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
							{['10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00'].map(time => (
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
