import React from 'react';
import { Table, TableBody, TableCell, TableRow, TableHead, CardHeader, Card, CardContent } from 'material-ui';
import * as CBX from '../../utils/CBX';
import { moment } from '../../containers/App';
import EmailIcon from '../council/live/participants/EmailIcon';
import TypeIcon from "../council/live/participants/TypeIcon";

const tableCellStyle = { padding: '0.2em' };
const tableCellStyleTh = { width: '20%' };

const NotificationsTable = ({ notifications, translate, handleToggleVisib, visib }) => (
	<Table style={{ maxWidth: '100%' }}>
		<TableHead>
			<TableRow>
				<TableCell style={{ padding: "0" }}>
					<i onClick={() => handleToggleVisib()} className={ visib ? "fa fa-minus-square" : "fa fa-plus-square" } style={{ cursor: 'pointer', padding: "0px 0px 0px 25px", fontSize: "16px", color:  visib ?"rgb(156, 39, 176)":"rgb(97, 171, 183)" }}></i>
				</TableCell>
				<TableCell style={tableCellStyleTh}>{translate.current_status}</TableCell>
				<TableCell style={tableCellStyleTh}>{translate.send_type}</TableCell>
				<TableCell style={tableCellStyleTh}>{translate.email}</TableCell>
				<TableCell style={tableCellStyleTh}>{translate.send_date}</TableCell>
				<TableCell style={tableCellStyleTh}>{translate.last_date_updated}</TableCell>
			</TableRow>
		</TableHead>
		<TableBody style={{ display: visib ? '': "none" }} >
			{notifications.map((notification, index) => (
				<TableRow key={`notification_${index}`}>
					<TableCell style={{ padding: "0" }}></TableCell>
					<TableCell style={tableCellStyle}>
						<EmailIcon
							translate={translate}
							reqCode={notification.reqCode}
						/>
					</TableCell>
					<TableCell style={tableCellStyleTh}>{translate.current_status}</TableCell>
					<TableCell style={tableCellStyleTh}>{translate.send_type}</TableCell>
					<TableCell style={tableCellStyleTh}>{translate.email}</TableCell>
					<TableCell style={tableCellStyleTh}>{translate.send_date}</TableCell>
					<TableCell style={tableCellStyleTh}>{translate.last_date_updated}</TableCell>
				</TableRow>
			))}
		</TableBody>
	</Table>
);

}


export default NotificationsTable;