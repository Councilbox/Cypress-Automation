import React from 'react';
import { Table, TableBody, TableCell, TableRow, TableHead } from 'material-ui';
import * as CBX from '../../utils/CBX';
import { moment } from '../../containers/App';
import EmailIcon from '../council/live/participants/EmailIcon';
import TypeIcon from "../council/live/participants/TypeIcon";


const tableCellStyle = { padding: '0.2em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',  };
const tableCellStyleTh = { width: '20%', };

const NotificationsTable = ({ notifications, translate, maxEmail }) => {

	const [state, setState] = React.useState({
		visible: false,
	})

	const toggleVisible = () => {
		setState({
			...state,
			visible: !state.visible
		});
	}


	return (
		<Table style={{ maxWidth: '100%' }}>
			<TableHead>
				<TableRow>
					<TableCell style={{ padding: "0" }}>
						<i onClick={() => toggleVisible()} className={state.visible ? "fa fa-minus-square" : "fa fa-plus-square"} style={{ cursor: 'pointer', padding: "0px 0px 0px 25px", fontSize: "16px", color: state.visible ? "rgb(156, 39, 176)" : "rgb(97, 171, 183)" }}></i>
					</TableCell>
					<TableCell style={tableCellStyleTh}>{translate.current_status}</TableCell>
					<TableCell style={tableCellStyleTh}>{translate.send_type}</TableCell>
					<TableCell style={tableCellStyleTh}>{translate.email}</TableCell>
					<TableCell style={tableCellStyleTh}>{translate.send_date}</TableCell>
					<TableCell style={tableCellStyleTh}>{translate.last_date_updated}</TableCell>
				</TableRow>
			</TableHead>
			<TableBody style={{ display: state.visible ? '' : "none" }} >
				{notifications.map((notification, index) => (
					<TableRow key={`notification_${index}`}>
						<TableCell style={{ padding: "0" }}></TableCell>
						<TableCell style={tableCellStyle}>
							<EmailIcon
								translate={translate}
								reqCode={notification.reqCode}
							/>
						</TableCell>
						<TableCell style={tableCellStyle}>
							{translate[CBX.getSendType(notification.sendType)]}
						</TableCell>
						<TableCell style={{...tableCellStyle, ...maxEmail}}>
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

}


export default NotificationsTable;