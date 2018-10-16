import React from 'react';
import { Table, TableBody, TableCell, TableRow, TableHead } from 'material-ui';
import * as CBX from '../../utils/CBX';
import { moment } from '../../containers/App';
import EmailIcon from '../council/live/participants/EmailIcon';

const tableCellStyle = {padding:'0.2em'};

const NotificationsTable = ({ notifications, translate }) => (
	<Table style={{maxWidth: '100%'}}>
		<TableHead>
			<TableRow>
				<TableCell style={tableCellStyle}>{translate.current_status}</TableCell>
				<TableCell style={tableCellStyle}>{translate.send_type}</TableCell>
				<TableCell style={tableCellStyle}>{translate.email}</TableCell>
				<TableCell style={tableCellStyle}>{translate.send_date}</TableCell>
				<TableCell style={tableCellStyle}>{translate.last_date_updated}</TableCell>
			</TableRow>
		</TableHead>
		<TableBody>
			{notifications.map((notification, index) => (
				<TableRow key={`notification_${index}`}>
					<TableCell style={tableCellStyle}>
						<EmailIcon
							translate={translate}
							reqCode={notification.reqCode}
						/>
					</TableCell>
					<TableCell style={tableCellStyle}>
						{translate[CBX.getSendType(notification.sendType)]}
					</TableCell>
					<TableCell style={tableCellStyle}>
						{notification.email}
					</TableCell>
					<TableCell style={tableCellStyle}>
						{moment(notification.sendDate).isValid()
							? moment(notification.sendDate).format("l LT")
							: "-"}
					</TableCell>
					<TableCell style={tableCellStyle}>
						{moment(notification.refreshDate).isValid()
							? moment(notification.refreshDate).format("l LT")
							: "-"}
					</TableCell>
				</TableRow>
			))}
		</TableBody>
	</Table>
);

export default NotificationsTable;