import gql from "graphql-tag";

export const deleteParticipant = gql`
	mutation DeleteParticipant($participantId: [Int]) {
		deleteParticipant(ids: $participantId){
			success
		}
	}
`;

export const councilParticipants = gql`
	query participants(
		$councilId: Int!
		$filters: [FilterInput]
		$options: OptionsInput
	) {
		councilParticipants(
			councilId: $councilId
			filters: $filters
			options: $options
		) {
			list {
				id
				councilId
				name
				surname
				position
				email
				phone
				secondaryEmail
				dni
				type
				numParticipations
				socialCapital
				initialState
				uuid
				delegateUuid
				delegateId
				representatives {
					id
					name
					surname
				}
				representative {
					id
					name
					initialState
					surname
					dni
					secondaryEmail
					email
					phone
					position
					language
				}
				position
				language
				city
				personOrEntity
			}
			total
		}
	}
`;

export const councilParticipantsFilterIds = gql`
	query participants(
		$councilId: Int!
		$filters: [FilterInput]
		$options: OptionsInput
	) {
		councilParticipantsFilterIds(
			councilId: $councilId
			filters: $filters
			options: $options
		) {
			list {
				id
				councilId
				name
				surname
				position
				email
				phone
				dni
				secondaryEmail
				type
				numParticipations
				socialCapital
				uuid
				delegateUuid
				delegateId
				representative {
					id
					name
					surname
					dni
					secondaryEmail
					email
					phone
					position
					language
				}
				position
				language
				city
				personOrEntity
			}
			total
		}
	}
`;

export const addParticipant = gql`
	mutation addCouncilParticipant(
		$participant: ParticipantInput
		$representative: RepresentativeInput
	) {
		addCouncilParticipant(
			participant: $participant
			representative: $representative
		) {
			success
		}
	}
`;

export const checkUniqueCouncilEmails = gql`
query checkUniqueCouncilEmails($emailList: [String], $councilId: Int!){
	checkUniqueCouncilEmails(emailList: $emailList, councilId: $councilId){
		success
		message
	}
}
`;

export const updateCouncilParticipant = gql`
	mutation updateParticipant(
		$participant: ParticipantInput
		$representative: RepresentativeInput
	) {
		updateCouncilParticipant(
			participant: $participant
			representative: $representative
		) {
			success
		}
	}
`;

export const upsertConvenedParticipant = gql`
	mutation upsertConvenedParticipant(
		$participant: ParticipantInput
		$representative: RepresentativeInput
		$sendConvene: Boolean
	) {
		updateConvenedParticipant(
			participant: $participant
			representative: $representative
			sendConvene: $sendConvene
		) {
			success
		}
	}
`;

export const addConvenedParticipant = gql`
	mutation upsertConvenedParticipant(
		$participant: ParticipantInput
		$representative: RepresentativeInput
		$sendConvene: Boolean
	) {
		addConvenedParticipant(
			participant: $participant
			representative: $representative
			sendConvene: $sendConvene
		) {
			success
			message
		}
	}
`;


export const convenedcouncilParticipants = gql`
	query participants(
		$councilId: Int!
		$filters: [FilterInput]
		$notificationStatus: Int
		$attendanceIntention: Int
		$options: OptionsInput
	) {
		councilParticipantsWithNotifications(
			councilId: $councilId
			filters: $filters
			attendanceIntention: $attendanceIntention
			notificationStatus: $notificationStatus
			options: $options
		) {
			list {
				id
				councilId
				name
				surname
				position
				email
				phone
				dni
				type
				secondaryEmail
				initialState
				numParticipations
				socialCapital
				uuid
				delegateUuid
				delegateId
				position
				language
				representatives {
					id
					name
					surname
					dni
					email
					initialState
					secondaryEmail
					phone
					position
					language
					notifications {
						id
						reqCode
						refreshDate
					}
					live {
						name
						id
						surname
						assistanceComment
						assistanceLastDateConfirmed
						assistanceIntention
					}
				}
				representing {
					id
					name
					surname
					numParticipations
					socialCapital
					dni
					email
					type
					phone
					position
					language
					notifications {
						reqCode
						refreshDate
						sendDate
					}
					live {
						name
						id
						surname
						assistanceComment
						assistanceLastDateConfirmed
						assistanceIntention
					}
				}
				live {
					name
					id
					state
					surname
					delegationProxy {
						signedBy
						id
						participantId
						delegateId
					}
					voteLetter {
						signedBy
						id
						participantId
					}
					delegateId
					assistanceComment
					assistanceLastDateConfirmed
					assistanceIntention
					representative {
						id
						name
						surname
						dni
						position
					}
				}
				city
				personOrEntity
				notifications {
					id
					reqCode
					sendDate
					refreshDate
				}
			}
			total
		}
		councilTotalVotes(councilId: $councilId)
		councilSocialCapital(councilId: $councilId)
	}
`;