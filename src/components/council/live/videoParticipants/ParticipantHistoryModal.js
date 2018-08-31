import React from "react";
import {
	AlertConfirm,
	LoadingSection,
	Table
} from "../../../../displayComponents";
import { TableRow, TableCell } from "material-ui";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { moment } from '../../../../containers/App';

const ParticipantHistory = ({ data, participant, translate, requestClose }) => (
	<AlertConfirm
		requestClose={requestClose}
		open={participant}
		acceptAction={requestClose}
		buttonAccept={translate.accept}
		bodyText={
			<div>
				{!!participant && (
					<React.Fragment>
						{`${participant.name} ${participant.surname} - ${
							participant.email
						} - ${participant.position? participant.position : ''}`}

						{data.loading ? (
							<LoadingSection />
						) : (
							<Table
								headers={[
									{ name: translate.table_councils_date },
									{ name: translate.connection_type },
									{ name: translate.test_browser },
									{ name: translate.os },
									{ name: translate.ip }
								]}
							>
								{data.participantHistory.map(history => {
									return (
										<TableRow key={`history_${history.id}`}>
											<TableCell>
												{moment(
													new Date(history.date)
												).format("LLL")}
											</TableCell>
											<TableCell>
												{history.typeText}
											</TableCell>
											<TableCell>
												{`${history.trackInfo.ua.browser
													.name || "-"} ${history
													.trackInfo.ua.browser
													.version || "-"}`}
											</TableCell>
											<TableCell>
												{`${history.trackInfo.ua.os
													.name || "-"} ${history
													.trackInfo.ua.os.version ||
													"-"}`}
											</TableCell>
											<TableCell>
												{history.trackInfo.ip}
											</TableCell>
										</TableRow>
									);
								})}
							</Table>
						)}
					</React.Fragment>
				)}
			</div>
		}
		title={translate.state_logs}
	/>
);

const participantHistory = gql`
	query participantHistory($participantId: Int!) {
		participantHistory(participantId: $participantId) {
			date
			type
			trackInfo
			id
			typeText
		}
	}
`;

export default graphql(participantHistory, {
	options: props => ({
		variables: {
			participantId: props.participant.id
		}
	})
})(ParticipantHistory);
