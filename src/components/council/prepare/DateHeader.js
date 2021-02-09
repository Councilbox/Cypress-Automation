import React from 'react';
import { Paper } from 'material-ui';
import { hasSecondCall } from '../../../utils/CBX';
import { moment } from '../containers/App';


const DateHeader = ({ council, button, translate }) => (
	<Paper
		style={{
			padding: '1.5em',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between'
		}}
		elevation={2}
	>
		<div
			style={{
				display: 'flex',
				flexDirection: 'column'
			}}
		>
			<h5>{council.name}</h5>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row'
				}}
			>
				{`${translate['1st_call_date']}: ${moment(
					council.dateStart
				).format('LLL')}`}
			</div>
			{hasSecondCall(council.statute)
				&& `${translate['2nd_call_date']}: ${moment(
					council.dateStart2NdCall
				).format('LLL')}`}
			<h6>
				<b>{`${translate.new_location_of_celebrate}: `}</b>
				{council.remoteCelebration === 1 ?
					translate.remote_celebration
					: `${council.street}, ${council.country}`}
			</h6>
		</div>
		<div>{button}</div>
	</Paper>
);

export default DateHeader;
