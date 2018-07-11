import gql from "graphql-tag";

export const deleteParticipant = gql`
	mutation DeleteParticipant($participantId: Int!) {
		deleteParticipant(participantId: $participantId){
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
				dni
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
	mutation addParticipant(
		$participant: NewParticipant
		$representative: NewRepresentative
	) {
		addCouncilParticipant(
			participant: $participant
			representative: $representative
		) {
			id
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
		upsertConvenedParticipant(
			participant: $participant
			representative: $representative
			sendConvene: $sendConvene
		) {
			success
		}
	}
`;

export const convenedcouncilParticipants = gql`
	query participants(
		$councilId: Int!
		$filters: [FilterInput]
		$notificationStatus: Int
		$options: OptionsInput
	) {
		councilParticipantsWithNotifications(
			councilId: $councilId
			filters: $filters
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
				numParticipations
				socialCapital
				uuid
				delegateUuid
				delegateId
				position
				language
				representative {
					id
					name
					surname
					dni
					email
					phone
					position
					language
					notifications {
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
				live {
					name
					id
					surname
					assistanceComment
					assistanceLastDateConfirmed
					assistanceIntention
				}
				city
				personOrEntity
				notifications {
					reqCode
					refreshDate
				}
			}
			total
		}
		councilTotalVotes(councilId: $councilId)
		councilSocialCapital(councilId: $councilId)
	}
`;
