import React from 'react';
import { TableRow, TableCell } from 'material-ui';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {
	AlertConfirm,
	LoadingSection,
	Table
} from '../../../../../displayComponents';
import { moment } from '../../../../../containers/App';

const ParticipantHistory = ({
	data, participant, translate, requestClose
}) => (
	<AlertConfirm
		requestClose={requestClose}
		open={!!participant}
		acceptAction={requestClose}
		buttonAccept={translate.accept}
		bodyText={
			<div>
				{!!participant && (
					<React.Fragment>
						{`${participant.name} ${participant.surname || ''} - ${participant.email
							} - ${participant.position ? participant.position : ''}`}

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
								{data.participantHistory.map(history => (
									<TableRow key={`history_${history.id}`}>
										<TableCell>
											{moment(
												new Date(history.date)
											).format('LLL')}
										</TableCell>
										<TableCell>
											{getLogText(history.typeText, translate)}
										</TableCell>
										<TableCell>
											{`${history.trackInfo.ua.browser
												.name || '-'} ${history
													.trackInfo.ua.browser
													.version || '-'}`}
										</TableCell>
										<TableCell>
											{`${history.trackInfo.ua.os
												.name || '-'} ${history
													.trackInfo.ua.os.version
												|| '-'}`}
										</TableCell>
										<TableCell>
											{history.trackInfo.ip}
										</TableCell>
									</TableRow>
								))}
							</Table>
						)}
					</React.Fragment>
				)}
			</div>
		}
		title={translate.state_logs}
	/>
);

export const getLogText = (type, translate) => {
	switch (type) {
		case 'CONNECT':
			return translate.connected;

		case 'DISCONNECT':
			return translate.absent;

		case 'ASKED WORD':
			return translate.ask_word;

		case 'CANCELED WORD PETITION':
			return translate.canceled_word_petition;

		case 'CANCELED WORD BY ADMIN':
			return translate.canceled_word_by_admin;

		case 'GRANTED WORD':
			return translate.granted_word;

		default:
			return type;
	}
};

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
		},
		notifyOnNetworkStatusChange: true,
		fetchPolicy: 'network-only'
	})
})(ParticipantHistory);
