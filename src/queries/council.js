import gql from "graphql-tag";

export const addAgenda = gql`
	mutation addAgenda($councilID: Int!) {
		council(id: $councilID) {
			id
			attachments {
				councilId
				filename
				filesize
				filetype
				id
			}
		}
	}
`;

export const removeAgenda = gql`
	mutation removeAgenda($councilId: Int!, $agendaId: Int!) {
		removeAgenda(councilId: $councilId, agendaId: $agendaId) {
			id
		}
	}
`;

export const updateAgendas = gql`
	mutation updateAgendas($agendaList: [AgendaInput]) {
		updateAgendas(agendaList: $agendaList) {
			abstentionManual
			abstentionVotings
			agendaSubject
			comment
			councilId
			currentRemoteCensus
			dateEnd
			dateEndVotation
			dateStart
			dateStartVotation
			description
			id
			majority
			majorityDivider
			majorityType
			negativeManual
			negativeVotings
			noParticipateCensus
			noVoteManual
			noVoteVotings
			numAbstentionManual
			numAbstentionVotings
			numCurrentRemoteCensus
			numNegativeManual
			numNegativeVotings
			numNoParticipateCensus
			numNoVoteManual
			numNoVoteVotings
			numPositiveManual
			numPositiveVotings
			numPresentCensus
			numRemoteCensus
			numTotalManual
			numTotalVotings
			orderIndex
			pointState
			positiveManual
			positiveVotings
			presentCensus
			remoteCensus
			socialCapitalCurrentRemote
			socialCapitalNoParticipate
			socialCapitalPresent
			socialCapitalRemote
			sortable
			subjectType
			totalManual
			totalVotings
			votingState
		}
	}
`;

export const updateAgenda = gql`
	mutation updateAgenda($agenda: AgendaInput) {
		updateAgenda(agenda: $agenda) {
			id
		}
	}
`;


export const sendReminder = gql`
	mutation sendReminder(
		$councilId: Int!
	) {
		sendReminder(
			councilId: $councilId
		) {
			success
		}
	}
`;

export const rescheduleCouncil = gql`
	mutation rescheduleCouncil(
		$councilId: Int!
		$dateStart: String
		$dateStart2NdCall: String
		$timezone: String!
	) {
		rescheduleCouncil(
			councilId: $councilId
			dateStart: $dateStart
			dateStart2NdCall: $dateStart2NdCall
			timezone: $timezone
		) {
			success
		}
	}
`;

export const cancelCouncil = gql`
	mutation cancelCouncil($councilId: Int!, $timezone: String!) {
		cancelCouncil(councilId: $councilId, timezone: $timezone) {
			success
		}
	}
`;


export const conveneWithNotice = gql`
	mutation conveneWithNotice($councilId: Int!, timezone: String!) {
		conveneWithNotice(councilId: $councilId, timezone: $timezone) {
			success
		}
	}
`;

export const sendConveneTest = gql`
	mutation sendConveneTest($councilId: Int!, $email: String!, timezone: String!) {
		sendConveneTest(councilId: $councilId, email: $email, timezone: $timezone) {
			success
		}
	}
`;

export const sendPreConvene = gql`
	mutation sendPreConvene($councilId: Int!, timezone: String!) {
		sendPreConvene(councilId: $councilId, timezone: $timezone) {
			success
		}
	}
`;

export const conveneWithoutNotice = gql`
	mutation conveneWithoutNotice($councilId: Int!, timezone: String!) {
		conveneWithoutNotice(councilId: $councilId, timezone: $timezone) {
			success
		}
	}
`;