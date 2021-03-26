import { Card } from 'material-ui';
import React from 'react';
import Calendar from 'react-calendar';
import { withApollo } from 'react-apollo';
import { getPrimary } from '../../../../styles/colors';
import { Grid, Scrollbar } from '../../../../displayComponents';


const AppointmentDateForm = ({ style }) => {
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
						//onChange={onChangeDay}
						//value={filters.selectedDay}
						minDetail={'month'}
						//tileClassName={date => getTileClassName(date)}
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
						<div>
							{['10:30', '10:45', '11:00', '11:00', '11:00', '11:00', '11:00', '11:00', '11:00', '11:00', '11:00', '11:00', '11:00', '11:00', '11:00', '11:00',].map(date => (
								<DateButton
									key={date}
									date={date}
								/>
							))}
						</div>
					</Scrollbar>
				</div>
			</Grid>

		</Card>
	);
};

const DateButton = ({ date, onClick }) => (
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
			marginBottom: '5px'
		}}
	>
		{date}
	</div>
);

export default withApollo(AppointmentDateForm);
