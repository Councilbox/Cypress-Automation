import React from 'react';
import { Table, TableBody, TableCell, TableRow, TableHead, Tooltip } from 'material-ui';
import * as CBX from '../../utils/CBX';
import { moment } from '../../containers/App';

const NotificationsTable = ({ notifications, translate }) => (
	<Table>
		<TableHead>
			<TableRow>
				<TableCell>{translate.current_status}</TableCell>
				<TableCell>{translate.send_type}</TableCell>
				<TableCell>{translate.send_date}</TableCell>
				<TableCell>{translate.last_date_updated}</TableCell>
			</TableRow>
		</TableHead>
		<TableBody>
			{notifications.map((notification, index) => (
				<TableRow key={`notification_${index}`}>
					<TableCell>
						<Tooltip
							title={
								translate[
								CBX.getTranslationReqCode(
									notification.reqCode
								)
								]
							}
						>
							<img
								style={{
									height: "2.1em",
									width: "auto"
								}}
								src={CBX.getEmailIconByReqCode(
									notification.reqCode
								)}
								alt="email-state-icon"
							/>
						</Tooltip>
					</TableCell>
					<TableCell>
						{translate[CBX.getSendType(notification.sendType)]}
					</TableCell>
					<TableCell>
						{moment(notification.sendDate).isValid()
							? moment(notification.sendDate).format("LLL")
							: "-"}
					</TableCell>
					<TableCell>
						{moment(notification.refreshDate).isValid()
							? moment(notification.refreshDate).format("LLL")
							: "-"}
					</TableCell>
				</TableRow>
			))}
		</TableBody>
	</Table>
);

export default NotificationsTable;