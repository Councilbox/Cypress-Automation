import React from 'react';
import { Table, TableBody, TableCell, TableRow, TableHead, Tooltip } from 'material-ui';
import * as CBX from '../../utils/CBX';
import { moment } from '../../containers/App';
import EmailIcon from '../council/live/participants/EmailIcon';
EmailIcon

const NotificationsTable = ({ notifications, translate }) => (
	<Table style={{maxWidth: '100%'}}>
		<TableHead>
			<TableRow>
				<TableCell style={{paddingRight:'0.1em'}}>{translate.current_status}</TableCell>
				<TableCell style={{paddingRight:'0.1em'}}>{translate.send_type}</TableCell>
				<TableCell style={{paddingRight:'0.1em'}}>{translate.email}</TableCell>
				<TableCell style={{paddingRight:'0.1em'}}>{translate.send_date}</TableCell>
				<TableCell style={{paddingRight:'0.1em'}}>{translate.last_date_updated}</TableCell>
			</TableRow>
		</TableHead>
		<TableBody>
			{notifications.map((notification, index) => (
				<TableRow key={`notification_${index}`}>
					<TableCell>
						<EmailIcon
							translate={translate}
							reqCode={notification.reqCode}
						/>
					</TableCell>
					<TableCell>
						{translate[CBX.getSendType(notification.sendType)]}
					</TableCell>
					<TableCell>
						{notification.email}
					</TableCell>
					<TableCell>
						{moment(notification.sendDate).isValid()
							? moment(notification.sendDate).format("l LT")
							: "-"}
					</TableCell>
					<TableCell>
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