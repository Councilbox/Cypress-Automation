import gql from 'graphql-tag';
import { companyFragment } from './queries/company';

export const setCompanyAsSelected = gql`
	mutation setCompanyAsSelected($userId: Int!, $companyId: Int!) {
		setCompanyAsSelected(companyId: $companyId, userId: $userId) {
			success
			message
		}
	}
`;

export const sendGraphQLError = gql`
	mutation sendGraphQLError($error: GraphQLErrorInput!) {
		sendGraphQLError(graphQLError: $error) {
			success
			message
		}
	}
`;

export const refreshTokenQuery = gql`
	mutation refreshToken($token: String!) {
		refreshToken(token: $token) {
			token
			refreshToken
		}
	}
`;

export const login = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
			refreshToken
		}
	}
`;

export const getMe = gql`
	query Me {
		me {
			name
			surname
			id
			type
			accessLimitedTo
			actived
			roles
			phone
			email
			preferredLanguage
		}
	}
`;

export const updateUser = gql`
	mutation updateUser($user: UserInput, $companies: [Int]) {
		updateUser(user: $user, companies: $companies) {
			name
			surname
			id
			type
			actived
			roles
			phone
			email
			preferredLanguage
		}
	}
`;

export const updatePassword = gql`
	mutation updatePassword($oldPassword: String!, $newPassword: String!) {
		updatePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
			success
		}
	}
`;

export const getTranslations = gql`
	query getTranslations($language: String!) {
		translations(language: $language) {
			label
			text
		}
	}
`;

export const company = gql`
	query company($id: Int!) {
		company(id: $id) {
			${companyFragment}
		}
	}
`;

export const companies = gql`
	query UserCompanies($userId: Int!) {
		userCompanies(userId: $userId) {
			actived
			company {
				${companyFragment}
			}
		}
	}
`;

export const councils = gql`
	query Councils($companyId: Int!, $state: [Int], $filters: [FilterInput], $options: OptionsInput) {
		councils(companyId: $companyId, state: $state, filters: $filters, options: $options) {
			list{
				id
				dateStart
				companyId
				dateRealStart
				state
				promoCode
				dateEnd
				name
				step
			}
			total
		}
	
	}
`;

export const downloadCertificate = gql`
	mutation DownloadCertificate($id: Int!) {
		downloadCertificate(id: $id)
	}
`;

export const councilCertificates = gql`
	query CouncilCertificates($councilId: Int!) {
		councilCertificates(councilId: $councilId) {
			id
			councilId
			title
			header
			content
			footer
			date
		}

		council(id: $councilId) {
			id
			name
			companyId
			dateStart
			agendas {
				id
				agendaSubject
				description
			}
		}
	}
`;

export const councilActEmail = gql`
	query CouncilActEmail($councilId: Int!) {
		councilAct(councilId: $councilId) {
			emailAct
			document
			type
		}
	}
`;

export const approveAct = gql`
	mutation ApproveAct($councilId: Int!, $closeCouncil: Boolean) {
		approveCouncilAct(councilId: $councilId, closeCouncil: $closeCouncil) {
			success
			message
		}
	}
`;

export const updateCouncil = gql`
	mutation UpdateCouncil($council: CouncilInput) {
		updateCouncil(council: $council) {
			id
		}
	}
`;

export const deleteCouncil = gql`
	mutation DeleteCouncil($councilId: [Int]) {
		deleteCouncil(ids: $councilId) {
			success
			message
		}
	}
`;

export const council = gql`
	query Council($id: Int!) {
		council(id: $id) {
			id
			name
			dateStart
			state
			step
		}
	}
`;


export const sendActDraft = gql`
	mutation SendActDraft($councilId: Int!, $emailList: [String]) {
		sendCouncilActDraft(councilId: $councilId, emailList: $emailList) {
			success
			message
		}
	}
`;

export const sendAct = gql`
	mutation SendActDraft($councilId: Int!, $participantsIds: [Int]!) {
		sendCouncilAct(
			councilId: $councilId
			participantsIds: $participantsIds
		) {
			success
			message
		}
	}
`;

export const sendActToVote = gql`
	mutation SendActDraft(
		$councilId: Int!
		$participants: [LiveParticipantInput]
	) {
		sendCouncilAct(councilId: $councilId, participants: $participants) {
			success
			message
		}
	}
`;

export const councilParticipantsWithActSends = gql`
	query councilParticipantsWithActSends(
		$councilId: Int!
		$filters: [FilterInput]
		$notificationStatus: Int
		$options: OptionsInput
	) {
		councilParticipantsWithActSends(
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
				participantId
				dni
				type
				numParticipations
				socialCapital
				position
				language
				city
				personOrEntity
				actNotifications {
					reqCode
					sendType
				}
			}
			total
		}
	}
`;

export const councilParticipantsActSends = gql`
	query councilParticipantsActSends(
		$councilId: Int!
		$filters: [FilterInput]
		$notificationStatus: Int
		$options: OptionsInput
	) {
		councilParticipantsActSends(
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
				position
				language
				participantId
				city
				personOrEntity
			}
			total
		}
	}
`;

export const updateCouncilAct = gql`
	mutation updateCouncilAct($councilAct: CouncilActInput) {
		updateCouncilAct(councilAct: $councilAct) {
			success
			message
		}
	}
`;

export const changeStatute = gql`
	mutation changeCouncilStatute($councilId: Int!, $statuteId: Int!) {
		changeCouncilStatute(councilId: $councilId, statuteId: $statuteId) {
			id
			title
			conveneFooter
			conveneHeader
		}
	}
`;

export const councilStepOne = gql`
	query CouncilStepOne($id: Int!, $companyId: Int!) {
		council(id: $id) {
			id
			conveneText
			conveneFooter
			name
			street
			councilType
			selectedCensusId
			fullVideoRecord
			remoteCelebration
			country
			countryState
			zipcode
			city
			dateStart
			dateStart2NdCall
			statute {
				id
				censusId
				statuteId
				title
                prototype
                existsSecondCall
                existsQualityVote
                minimumSeparationBetweenCall
                existsAdvanceNoticeDays
                advanceNoticeDays
                quorumPrototype
                firstCallQuorumType
                secondCallQuorumType
                existsDelegatedVote
                existMaxNumDelegatedVotes
                maxNumDelegatedVotes
                limitedAccessRoomMinutes
                existsLimitedAccessRoom
                existsComments
                notifyPoints
                existsQualityVote
                existsPresentWithRemoteVote
                canAddPoints
                canReorderPoints
                canUnblock
                existsAct
                includedInActBook
                includeParticipantsList
                conveneHeader
                intro
                constitution
                conclusion
			}
		}
		companyStatutes(companyId: $companyId) {
			id
			title
			censusId
		}
		countries {
			id
			deno
		}

		quorumTypes {
			label
			value
		}

		draftTypes {
			label
			value
		}
	}
`;

export const meetingStepOne = gql`
	query CouncilStepOne($id: Int!) {
		council(id: $id) {
			id
			councilType
			conveneText
			name
			street
			fullVideoRecord
			remoteCelebration
			country
			countryState
			zipcode
			city
			dateStart
			dateStart2NdCall
		}
	}
`;

export const meetingStepTwo = gql`
	query CouncilStepTwo($id: Int!, $companyId: Int!) {
		council(id: $id) {
			companyId
			id
			quorumPrototype
			selectedCensusId
		}
		languages {
			desc
			columnName
		}
		censuses(companyId: $companyId) {
			list {
				id
				companyId
				censusName
				censusDescription
				defaultCensus
				quorumPrototype
				state
			}
			total
		}
	}
`;

export const councilStepTwo = gql`
	query CouncilStepTwo($id: Int!, $companyId: Int!) {
		council(id: $id) {
			companyId
			id
			quorumPrototype
			selectedCensusId
			name
			councilType
			dateStart
			statute {
				id
				participantValidation
			}
			dateStart2NdCall
		}

		languages {
			desc
			columnName
		}

		councilTotalVotes(councilId: $id)
		councilSocialCapital(councilId: $id)

		censuses(companyId: $companyId) {
			list {
				id
				companyId
				censusName
				censusDescription
				defaultCensus
				quorumPrototype
				state
			}
			total
		}
	}
`;

export const downloadCBXData = gql`
	mutation cbxData($participantId: Int!) {
		cbxData(participantId: $participantId)
	}
`;

export const updateConveneSends = gql`
	mutation updateConveneSends($councilId: Int!) {
		updateConveneSends(councilId: $councilId) {
			success
			message
		}
	}
`;

export const updateParticipantSends = gql`
	mutation updateParticipantSends($participantId: Int!) {
		updateParticipantSends(participantId: $participantId) {
			success
			message
		}
	}
`;

export const platformDrafts = gql`
	query platformDrafts(
		$companyId: Int!
		$filters: [FilterInput]
		$options: OptionsInput
		$companyType: Int
		$tags: [String]
	) {
		platformDrafts(
			companyId: $companyId
			filters: $filters
			options: $options
			companyType: $companyType
			tags: $tags
		) {
			list {
				categories
				companyType
				corporationId
				councilType
				description
				id
				tags
				language
				majority
				majorityDivider
				majorityType
				prototype
				statuteId
				text
				title
				type
				userId
				votationType
			}
			total
		}
		companyDrafts(companyId: $companyId) {
			list {
				draftId
			}
		}
		draftTypes {
			id
			label
			value
		}

		votingTypes {
			label
			value
		}

		majorityTypes {
			label
			value
		}

		companyTypes {
			label
			value
		}
	}
`;

export const corporationDrafts = gql`
	query platformDrafts(
		$filters: [FilterInput]
		$options: OptionsInput
		$companyType: Int
	) {
		platformDrafts(
			filters: $filters
			options: $options
			companyType: $companyType
		) {
			list {
				categories
				companyType
				corporationId
				councilType
				description
				governingBodyType
				id
				language
				majority
				majorityDivider
				majorityType
				prototype
				statuteId
				text
				title
				type
				userId
				votationType
			}
			total
		}

		languages {
			desc
			columnName
		}

		companyTypes {
			label
			value
		}

		votingTypes {
			label
			value
		}

		majorityTypes {
			label
			value
		}

		draftTypes {
			id
			label
			value
		}
	}
`;

export const corporationDraft = gql`
	query corporationDraft($id: Int!) {
		corporationDraft(id: $id) {
			categories
			companyType
			corporationId
			councilType
			description
			id
			language
			majority
			governingBodyType
			majorityDivider
			majorityType
			prototype
			statuteId
			text
			title
			type
			userId
			votationType
		}

		languages {
			desc
			columnName
		}

		companyTypes {
			label
			value
		}

		votingTypes {
			label
			value
		}

		majorityTypes {
			label
			value
		}

		draftTypes {
			id
			label
			value
		}
	}
`;

export const createCorporationDraft = gql`
	mutation CreateCorporationDraft($draft: CorporationDraftInput!) {
		createCorporationDraft(draft: $draft) {
			success
			message
		}
	}
`;

export const deleteCorporationDraft = gql`
	mutation deleteCorporationDraft($id: Int!) {
		deleteCorporationDraft(id: $id) {
			success
			message
		}
	}
`;

export const updateCorporationDraft = gql`
	mutation updateCorporationDraft($draft: CorporationDraftInput!) {
		updateCorporationDraft(draft: $draft) {
			id
		}
	}
`;

export const statutes = gql`
	query statutes($companyId: Int!) {
		companyStatutes(companyId: $companyId) {
			id
			companyId
			title
			lastEdited
			existPublicUrl
			language
			companyType
			defaultVote
			videoConfig
			autoSendAct
			autoApproveAct
			hideVotingsRecountFinished
			addParticipantsListToAct
			existsAdvanceNoticeDays
			advanceNoticeDays
			existsSecondCall
			minimumSeparationBetweenCall
			firstCallQuorumType
			firstCallQuorum
			secondCallQuorumType
			secondCallQuorum
			existsDelegatedVote
			delegatedVoteWay
			existMaxNumDelegatedVotes
			maxNumDelegatedVotes
			existsPresentWithRemoteVote
			existsLimitedAccessRoom
			limitedAccessRoomMinutes
			existsQualityVote
			qualityVoteOption
			canAddPoints
			canReorderPoints
			existsAct
			includedInActBook
			canUnblock
			includeParticipantsList
			existsWhoSignTheAct
			hasPresident
			hasSecretary
			prototype
			intro
			constitution
			canEarlyVote
			canSenseVoteDelegate
			conclusion
			actTemplate
			conveneHeader
			conveneFooter
			censusId
			requireProxy
			quorumPrototype
			existsComments
			firstCallQuorumDivider
			secondCallQuorumDivider
			canEditConvene
			notifyPoints
			doubleColumnDocs
			proxy
			proxySecondary
			voteLetter
			voteLetterSecondary
			voteLetterWithSense
			voteLetterWithSenseSecondary
			introSecondary
			conclusionSecondary
			constitutionSecondary
		}
	}
`;

export const updateStatute = gql`
	mutation updateStatute($statute: StatuteInput!) {
		updateCompanyStatute(statute: $statute) {
			id
		}
	}
`;

export const deleteStatute = gql`
	mutation deleteStatute($statuteId: Int!) {
		deleteCompanyStatute(statuteId: $statuteId) {
			success
		}
	}
`;

export const createStatute = gql`
	mutation createCompanyStatute($statute: StatuteInput!) {
		createCompanyStatute(statute: $statute) {
			id
		}
	}
`;

export const councilStepThree = gql`
	query CouncilStepThree($id: Int!, $companyId: Int!) {
		council(id: $id) {
			businessName
			city
			name
			councilType
			country
			companyId
			countryState
			dateStart
			dateStart2NdCall
			id
			step
			street
			zipcode

			agendas {
				abstentionManual
				abstentionVotings
				agendaSubject
				comment
				councilId
				attachments{
					id
					filename
					filesize
				}
				items {
					id
					value
				}
				options {
					id
					maxSelections
					minSelections
				}
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

			statute {
				advanceNoticeDays
				canAddPoints
				canEditConvene
				canReorderPoints
				canUnblock
				censusId
				conveneHeader
				councilId
				existPublicUrl
				existsAct
				existsAdvanceNoticeDays
				existsPresentWithRemoteVote
				existsSecondCall
				id
				minimumSeparationBetweenCall
				prototype
				statuteId
				title
			}
		}

		companyStatutes(companyId: $companyId) {
			id
			title
		}

		majorityTypes {
			label
			value
		}
		draftTypes {
			label
			value
		}
		votingTypes {
			label
			value
		}
	}
`;

export const loadDraftInfo = gql`
	query LoadDraftInfo($companyId: Int!) {
		companyStatutes(companyId: $companyId) {
			id
			title
		}
		draftTypes {
			label
			value
		}
	}
`;

export const sendConvene = gql`
	mutation sendConvene($councilId: Int!) {
		sendConvene(councilId: $councilId) {
			success
		}
	}
`;

export const councilStepFour = gql`
	query CouncilStepFour($id: Int!) {
		council(id: $id) {
			id
			name
			companyId
			attachments {
				filename
				filesize
				filetype
				id
			}
		}
	}
`;

export const addCouncilAttachment = gql`
	mutation AddCouncilAttachment($attachment: CouncilAttachmentInput) {
		addCouncilAttachment(attachment: $attachment) {
			id
		}
	}
`;

export const updateCouncilAttachment = gql`
	mutation updateCouncilAttachment($id: Int!, $filename: String!) {
		updateCouncilAttachment(id: $id, filename: $filename) {
			filename
		}
	}
`;

export const updateAgendaAttachment = gql`
	mutation updateAgendaAttachment($id: Int!, $filename: String!) {
		updateAgendaAttachment(id: $id, filename: $filename) {
			filename
		}
	}
`;

export const removeCouncilAttachment = gql`
	mutation removeCouncilAttachment($councilId: Int!, $attachmentId: Int!) {
		removeCouncilAttachment(
			councilId: $councilId
			attachmentId: $attachmentId
		) {
			success
		}
	}
`;

export const councilStepFive = gql`
	query CouncilStepFive($id: Int!) {
		council(id: $id) {
			name
			actPointMajority
			actPointMajorityDivider
			actPointMajorityType
			actPointQuorum
			actPointQuorumDivider
			actPointQuorumType
			approveActDraft
			autoClose
			promoCode
			dateStart
			askWordMenu
			closeDate
			companyId
			wallActive
			confirmAssistance
			councilType
			contactEmail
			supportEmail
			presentVoteOverwrite
			dateStart
			fullVideoRecord
			id
			securityType
			step
			room {
				videoConfig
			}
			platform {
				act
				companyId
				councilId
				emails
				id
				room
				roomAccess
				securityEmail
				securitySms
				signature
				video
			}

			statute {
				advanceNoticeDays
				canAddPoints
				canEditConvene
				canReorderPoints
				canUnblock
				censusId
				conveneHeader
				canEarlyVote
				councilId
				existPublicUrl
				existsAct
				existsDelegatedVote
				existsAdvanceNoticeDays
				existsSecondCall
				id
				attendanceText
				minimumSeparationBetweenCall
				prototype
				statuteId
				title
			}
		}
		majorityTypes {
			label
			value
		}
	}
`;

export const councilStepSix = gql`
	query CouncilStepSix($id: Int!, $timezone: String) {
		council(id: $id) {
			actPointMajority
			actPointMajorityDivider
			actPointMajorityType
			actPointQuorum
			actPointQuorumDivider
			actPointQuorumType
			approveActDraft
			autoClose
			dateStart
			closeDate
			councilType
			companyId
			sendPointsMode
			confirmAssistance
			fullVideoRecord
			id
			name
			remoteCelebration
			state
			step
		}
		councilPreviewHTML(id: $id, timezone: $timezone)
	}
`;

export const councilDetails = gql`
	query CouncilDetails($councilID: Int!) {
		council(id: $councilID) {
			active
			agendas {
				abstentionManual
				abstentionVotings
				agendaSubject
				comment
				councilId
				currentRemoteCensus
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
			approveActDraft
			attachments {
				councilId
				filename
				filesize
				filetype
				id
			}
			businessName
			city
			companyId
			confirmAssistance
			conveneText
			councilStarted
			councilType
			country
			countryState
			currentQuorum
			dateEnd
			dateOpenRoom
			dateRealStart
			dateStart
			dateStart2NdCall
			duration
			emailText
			firstOrSecondConvene
			fullVideoRecord
			hasLimitDate
			headerLogo
			id
			limitDateResponse
			name
			neededQuorum
			noCelebrateComment
			participants {
				id
				councilId
				name
				surname
				position
				email
				phone
				dni
				type
				delegateId
				numParticipations
				socialCapital
				uuid
				delegateUuid
				position
				language
				city
				personOrEntity
			}
			president
			proposedActSent
			prototype
			quorumPrototype
			satisfyQuorum
			secretary
			securityKey
			securityType
			selectedCensusId
			sendDate
			sendPointsMode
			shortname
			state
			statute {
				id
				prototype
				councilId
				statuteId
				title
				existPublicUrl
				addParticipantsListToAct
				existsAdvanceNoticeDays
				advanceNoticeDays
				existsSecondCall
				minimumSeparationBetweenCall
				canEditConvene
				requireProxy
				firstCallQuorumType
				firstCallQuorum
				firstCallQuorumDivider
				secondCallQuorumType
				secondCallQuorum
				secondCallQuorumDivider
				existsDelegatedVote
				delegatedVoteWay
				existMaxNumDelegatedVotes
				maxNumDelegatedVotes
				existsLimitedAccessRoom
				limitedAccessRoomMinutes
				existsQualityVote
				qualityVoteOption
				canUnblock
				canAddPoints
				canReorderPoints
				existsAct
				existsWhoSignTheAct
				includedInActBook
				includeParticipantsList
				existsComments
				conveneHeader
				intro
				constitution
				conclusion
				actTemplate
				censusId
			}
			street
			tin
			videoEmailsDate
			videoMode
			videoRecodingInitialized
			votationType
			weightedVoting
			zipcode
		}

		councilTotalVotes(councilId: $councilID)
		councilSocialCapital(councilId: $councilID)

		votingTypes {
			label
			value
		}
	}
`;

export const councilAndAgendaAttachments = gql`
	query council($councilId: Int!) {
		council(id: $councilId) {
			id
			attachments {
				id
				filename
				filesize
				filetype
			}
			agendas {
				id
				agendaSubject
				orderIndex
				description
				attachments {
					id
					filename
					agendaId
					filetype
					filesize
				}
			}
		}
	}
`;

export const liveCouncilAgendas = gql`
	query CouncilLiveAgendas($councilId: Int!){
		agendas(councilId: $councilId){
			agendas {
				abstentionManual
				abstentionVotings
				agendaSubject
				attachments {
					id
					agendaId
					filename
					filesize
					filetype
					councilId
					state
				}
				comment
				councilId
				currentRemoteCensus
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
	}
`;

export const councilLiveQuery = gql`
	query CouncilLiveQuery($councilID: Int!) {
		council(id: $councilID) {
			act{
				id
				intro
				conclusion
				constitution
			}
			active
			autoClose
			initialQuorum
			wallActive
			approveActDraft
			attachments {
				councilId
				participantId
				filename
				filesize
				filetype
				id
			}
			businessName
			city
			companyId
			confirmAssistance
			conveneSendDate
			conveneText
			councilStarted
			presentVoteOverwrite
			councilType
			closeDate
			country
			countryState
			currentQuorum
			dateEnd
			dateOpenRoom
			dateRealStart
			dateStart
			dateStart2NdCall
			duration
			emailText
			firstOrSecondConvene
			fullVideoRecord
			hasLimitDate
			headerLogo
			id
			language
			limitDateResponse
			remoteCelebration
			name
			neededQuorum
			noCelebrateComment
			president
			presidentId
			proposedActSent
			prototype
			qualityVoteId
			quorumPrototype
			room {
				id
				videoLink
				type
				htmlVideoCouncil
				videoConfig
			}
			satisfyQuorum
			secretary
			secretaryId
			securityKey
			securityType
			selectedCensusId
			sendDate
			sendPointsMode
			shortname
			state
			statute {
				id
				prototype
				councilId
				autoApproveAct
				autoSendAct
				statuteId
				title
				participantValidation
				existPublicUrl
				addParticipantsListToAct
				decimalDigits
				existsAdvanceNoticeDays
				advanceNoticeDays
				hideAbstentionButton
				hideNoVoteButton
				existsSecondCall
				hasPresident
				hasSecretary
				minimumSeparationBetweenCall
				canEditConvene
				doubleColumnDocs
				firstCallQuorumType
				firstCallQuorum
				firstCallQuorumDivider
				secondCallQuorumType
				secondCallQuorum
				secondCallQuorumDivider
				existsDelegatedVote
				existsPresentWithRemoteVote
				existMaxNumDelegatedVotes
				maxNumDelegatedVotes
				existsLimitedAccessRoom
				limitedAccessRoomMinutes
				existsQualityVote
				qualityVoteOption
				canUnblock
				canAddPoints
				canReorderPoints
				existsAct
				existsWhoSignTheAct
				includedInActBook
				canEarlyVote
				includeParticipantsList
				existsComments
				conveneHeader
				quorumPrototype
				intro
				constitution
				conclusion
				actTemplate
				censusId
			}
			street
			tin
			videoEmailsDate
			videoMode
			videoRecodingInitialized
			votationType
			weightedVoting
			zipcode
		}

		councilRecount(councilId: $councilID) {
			socialCapitalTotal
			partTotal
			numTotal
			weighedPartTotal
			socialCapitalRightVoting
			numRightVoting
			partRightVoting
			treasuryShares
		}
	}
`;

export const addRepresentative = gql`
	mutation addRepresentative(
		$representative: LiveRepresentativeInput
		$participantId: Int!
	) {
		addRepresentative(
			representative: $representative
			participantId: $participantId
		) {
			success
			message
		}
	}
`;

export const downloadCouncilAttachment = gql`
	query downloadCouncilAttachment($attachmentId: Int!) {
		councilAttachment(id: $attachmentId) {
			base64
			filename
			filetype
		}
	}
`;

export const downloadAgendaAttachment = gql`
	query downloadAgendaAttachment($attachmentId: Int!) {
		agendaAttachment(id: $attachmentId) {
			base64
			filename
			filetype
		}
	}
`;

export const downloadConvenePDF = gql`
	query downloadConvenePDF($councilId: Int!) {
		downloadConvenePDF(councilId: $councilId)
	}
`;

export const downloadAct = gql`
	query downloadAct($councilId: Int!, $clean: Boolean) {
		downloadAct(councilId: $councilId, clean: $clean)
	}
`;

export const majorityTypes = gql`
	query majorityTypes {
		majorityTypes {
			label
			value
		}
	}
`;

export const votingTypes = gql`
	query votingTypes {
		votingTypes {
			label
			value
		}
	}
`;

export const quorumTypes = gql`
	query quorumTypes {
		quorumTypes {
			label
			value
		}
	}
`;

export const councilVideoHTML = gql`
	query councilVideoHTML($councilId: Int!) {
		councilVideoHTML(councilId: $councilId) {
			councilId
			htmlVideoCouncil
			htmlVideoParticipant
			id
			videoLink
		}
	}
`;

export const addAgendaAttachment = gql`
	mutation addAgendaAttachment($attachment: AgendaAttachmentInput!) {
		addAgendaAttachment(attachment: $attachment) {
			id
			agendaId
			filename
			base64
			filesize
			filetype
			councilId
			state
		}
	}
`;

export const removeAgendaAttachment = gql`
	mutation removeAgendaAttachment($attachmentId: Int!, $agendaId: Int!) {
		removeAgendaAttachment(
			attachmentId: $attachmentId
			agendaId: $agendaId
		) {
			success
			message
		}
	}
`;

export const openAgenda = gql`
	mutation openAgendaPoint($agendaId: Int!) {
		openAgendaPoint(agendaId: $agendaId) {
			success
			message
		}
	}
`;

export const openActPoint = gql`
	mutation OpenActPoint($councilId: Int!) {
		openActPoint(councilId: $councilId) {
			success
			message
		}
	}
`;

export const closeAgenda = gql`
	mutation closeAgenda($agendaId: Int!) {
		closeAgendaPoint(agendaId: $agendaId) {
			success
			message
		}
	}
`;

export const openAgendaVoting = gql`
	mutation openAgendaVoting($agendaId: Int!) {
		openAgendaVoting(agendaId: $agendaId) {
			success
			message
		}
	}
`;

export const closeAgendaVoting = gql`
	mutation closeAgendaVoting($agendaId: Int!) {
		closeAgendaVoting(agendaId: $agendaId) {
			success
			message
		}
	}
`;

export const startCouncil = gql`
	mutation startCouncil($council: CouncilInput) {
		startCouncil(council: $council) {
			success
			message
		}
	}
`;

export const endCouncil = gql`
	mutation endCouncil($councilId: Int!) {
		endCouncil(councilId: $councilId) {
			id
		}
	}
`;

export const openCouncilRoom = gql`
	mutation openCouncilRoom(
		$council: CouncilInput
		$sendCredentials: Boolean
		$timezone: String
	) {
		openCouncilRoom(
			council: $council
			sendCredentials: $sendCredentials
			timezone: $timezone
		) {
			success
		}
	}
`;

export const updateCredentialsSends = gql`
	mutation updateCredentialsSends($councilId: Int!) {
		updateCredentialsSends(councilId: $councilId) {
			success
			message
		}
	}
`;

export const wallComments = gql`
	query councilRoomMessages($councilId: Int!) {
		councilRoomMessages(councilId: $councilId) {
			id
			participantId
			text
			date
			author {
				name
				surname
				position
				id
			}
		}
	}
`;

export const downloadAttendPDF = gql`
	query downloadAttendPDF($councilId: Int!, $timezone: String!) {
		downloadAttendPDF(
			councilId: $councilId 
			timezone: $timezone
		)
	}
`;

export const downloadParticipantsPDF = gql`
	query downloadParticipantsPDF($councilId: Int!, $timezone: String!) {
		downloadParticipantsPDF(
			councilId: $councilId 
			timezone: $timezone
		)
	}
`;

export const downloadConnectionsExcel = gql`
	query downloadConnectionsExcel($councilId: Int!) {
		downloadConnectionsExcel(councilId: $councilId)
	}
`;

export const liveParticipants = gql`
	query liveParticipants(
		$councilId: Int!
		$filters: [FilterInput]
		$notificationStatus: Int
		$options: OptionsInput
	) {
		liveParticipants(
			councilId: $councilId
			filters: $filters
			notificationStatus: $notificationStatus
			options: $options
		) {
			list {
				id
				delegateId
				state
				audio
				video
				councilId
				name
				position
				email
				phone
				dni
				date
				type
				participantId
				online
				requestWord
				numParticipations
				surname
				assistanceComment
				assistanceLastDateConfirmed
				assistanceIntention
				representative {
					id
					name
					surname
				}
				blocked
				lastDateConnection
				videoMode
				notifications {
					participantId
					reqCode
					refreshDate
				}
				firstLoginDate
				firstLoginCurrentPointId
				language
				signed
				socialCapital
				address
				city
				country
				countryState
				zipcode
				delegateUuid
				actived
				personOrEntity
			}
			total
		}
	}
`;

export const videoParticipants = gql`
	query videoParticipants(
		$councilId: Int!
		$filters: [FilterInput]
		$options: OptionsInput
	) {
		videoParticipants(
			councilId: $councilId
			filters: $filters
			options: $options
		) {
			list {
				id
				state
				audio
				video
				videoParticipant{
					mutedMic
					mutedCam
					online
					id
				}
				councilId
				name
				email
				position
				date
				geoLocation
				participantId
				online
				requestWord
				type
				surname
				blocked
				lastDateConnection
				videoMode
				firstLoginDate
				firstLoginCurrentPointId
				signed
				actived
			}
			total
		}
		videoParticipantsStats(councilId: $councilId)
	}
`;

export const councilOfficials = gql`
	query councilOfficials(
		$councilId: Int!
		$filters: [FilterInput]
		$options: OptionsInput
	) {
		councilOfficials(
			councilId: $councilId
			filters: $filters
			options: $options
		) {
			list {
				id
				delegateId
				state
				audio
				video
				councilId
				name
				position
				email
				phone
				dni
				date
				type
				participantId
				online
				requestWord
				surname
				blocked
				lastDateConnection
				videoMode
				firstLoginDate
				firstLoginCurrentPointId
				language
				signed
				address
				actived
			}
			total
		}
	}
`;

export const addGuest = gql`
	mutation addGuest($guest: LiveParticipantInput) {
		addGuest(guest: $guest) {
			success
			message
		}
	}
`;

export const sendVideoEmails = gql`
	mutation sendVideoEmails($councilId: Int!, $timezone: String, $type: String) {
		sendRoomEmails(councilId: $councilId, timezone: $timezone, type: $type) {
			success
			message
		}
	}
`;

export const sendVideoEmailTest = gql`
	mutation sendVideoEmailTest($councilId: Int!, $email: String!, $phone: String, $timezone: String!) {
		sendRoomEmailTest(councilId: $councilId, email: $email, phone: $phone, timezone: $timezone) {
			success
			message
		}
	}
`;

export const noCelebrateCouncil = gql`
	mutation noCelebrateCouncil($councilId: Int!, $comment: String) {
		noCelebrateCouncil(councilId: $councilId, comment: $comment) {
			success
			message
		}
	}
`;

export const participantsToDelegate = gql`
	query liveParticipantsToDelegate(
		$councilId: Int!
		$participantId: Int
		$filters: [FilterInput]
		$options: OptionsInput
	) {
		liveParticipantsToDelegate(
			councilId: $councilId,
			participantId: $participantId
			filters: $filters
			options: $options
		) {
			list {
				id
				name
				surname
				phone
				assistanceIntention
				delegatedVotes {
					id
					type
					state
					name
				}
				email
				dni
				position
			}
			total
		}
	}
`;

export const participantsWhoCanDelegate = gql`
	query liveParticipantsToDelegate(
		$councilId: Int!
		$filters: [FilterInput]
		$options: OptionsInput
		$participantId: Int
	) {
		liveParticipantsWhoCanDelegate(
			councilId: $councilId
			filters: $filters
			participantId: $participantId
			options: $options
		) {
			list {
				id
				name
				surname
				phone
				email
				dni
				position
			}
			total
		}
	}
`;

export const liveParticipantsCount = gql`
	query liveParticipantsCount($councilId: Int!) {
		liveParticipantsCount(councilId: $councilId) {
			state
			count
		}
	}
`;

export const liveParticipant = gql`
	query liveParticipant($participantId: Int!) {
		liveParticipant(liveId: $participantId) {
			id
			delegateId
			state
			audio
			hasDelegatedVotes
			video
			firstLoginDate
			councilId
			name
			position
			email
			phone
			dni
			date
			type
			participantId
			online
			requestWord
			numParticipations
			surname
			voteDenied
			voteDeniedReason
			assistanceComment
			assistanceLastDateConfirmed
			assistanceIntention
			blocked
			lastDateConnection
			videoMode
			represented {
				name
				surname
			}
			notifications {
				participantId
				email
				reqCode
				refreshDate
				sendDate
				sendType
			}
			firstLoginDate
			firstLoginCurrentPointId
			language
			signed
			socialCapital
			address
			city
			representative {
				id
				name
				surname
				dni
				hasDelegatedVotes
				email
				state
				signed
				type
				phone
				position
				language
				numParticipations
				socialCapital
			}
			representatives {
				id
				name
				surname
				dni
				email
				phone
				state
				signed
				position
				language
				numParticipations
				socialCapital
				notifications {
					participantId
					email
					reqCode
					refreshDate
					sendDate
					sendType
				}
			}
			country
			countryState
			zipcode
			delegateUuid
			actived
			personOrEntity
		}
	}
`;

export const banParticipant = gql`
	mutation banParticipant($participantId: Int!) {
		banParticipant(participantId: $participantId) {
			success
			message
		}
	}
`;

export const unbanParticipant = gql`
	mutation unbanParticipant($participantId: Int!) {
		unbanParticipant(participantId: $participantId) {
			success
			message
		}
	}
`;

export const iframeURLTEMP = gql`
	query councilRoomTEMP($councilId: Int!, $participantId: String!) {
		roomVideoURL(councilId: $councilId, participantId: $participantId)
	}
`;

export const iframeParticipant = gql`
	query iframeURL($participantId: String!) {
		participantVideoURL(participantId: $participantId)
	}
`;

export const companyTypes = gql`
	query CompanyTypes {
		companyTypes {
			label
			value
		}
	}
`;

export const draftDetails = gql`
	query draftDetails {
		companyTypes {
			label
			value
		}

		quorumTypes {
			label
			value
		}

		draftTypes {
			id
			label
			value
		}

		majorityTypes {
			label
			value
		}

		languages {
			desc
			columnName
		}

		votingTypes {
			value
			label
		}


	}
`;

export const cloneDrafts = gql`
	mutation clonePlatformDrafts($ids: [Int], $companyId: Int!) {
		clonePlaftormDrafts(platformDraftIds: $ids, companyId: $companyId)
	}
`;

export const agendaComments = gql`
	query agendaVotings($agendaId: Int!) {
		agendaVotings(agendaId: $agendaId) {
			comment
			author {
				name
				surname
				email
				position
			}
		}
	}
`;

export const participantsQuery = gql`
	query Participants($councilID: ID!) {
		participants(councilID: $councilID) {
			id
			council_id
			name
			surname
			position
			email
			phone
			dni
			date
			type
			delegate_id
			num_participations
			social_capital
			uuid
			delegate_uuid
			video_password
			real_position
			language
			address
			city
			country
			country_state
			zipcode
			person_or_entity
			actived
		}
	}
`;

export const saveCouncilData = gql`
	mutation saveCouncilData($data: String!) {
		saveCouncil(data: $data) {
			code
			msg
		}
	}
`;

export const saveAttachmentMutation = gql`
	mutation saveAttachmentM($data: String!) {
		saveAttachment(data: $data) {
			code
			msg
		}
	}
`;

export const deleteAttachmentMutation = gql`
	mutation deleteAttachmentM($attachment: AttachmentInfo) {
		deleteAttachment(attachment: $attachment) {
			code
			msg
		}
	}
`;

export const sendAgendaAttachment = gql`
	mutation sendAgendaAttachment($data: String!) {
		sendAgendaAttachment(data: $data) {
			code
			msg
		}
	}
`;

export const deleteAgendaAttachment = gql`
	mutation deleteAgendaAttachment($attachment: AttachmentInfo!) {
		deleteAgendaAttachment(attachment: $attachment) {
			code
			msg
		}
	}
`;

export const getComments = gql`
	query getComments($request: Request) {
		getComments(request: $request) {
			agenda_id
			be_on_record
			cfs_code
			code
			comment
			council_id
			date
			delegate_email
			delegate_id
			delegate_name
			delegate_position
			delegate_surname
			email
			id
			name
			num_participations
			participant_email
			participant_id
			position
			present_vote
			req_code
			req_text
			state
			subject_type
			surname
			vote
		}
	}
`;

export const getCompanies = gql`
	query getCompanies {
		companies {
			address
			alias
			business_name
			city
			country
			country_state
			creator_id
			demo
			domain
			id
			language
			link_key
			logo
			tin
			type
			zipcode
		}
	}
`;

export const getVotings = gql`
	query getVotings($request: Request) {
		getVotings(request: $request) {
			agenda_id
			be_on_record
			cfs_code
			code
			comment
			council_id
			date
			delegate_email
			delegate_id
			delegate_name
			delegate_position
			delegate_surname
			email
			id
			name
			num_participations
			participant_email
			participant_id
			position
			present_vote
			req_code
			req_text
			state
			subject_type
			surname
			vote
		}
	}
`;

export const changeRequestWord = gql`
	mutation changeRequestWord($participantId: Int!, $requestWord: Int!) {
		changeRequestWord(
			participantId: $participantId
			requestWord: $requestWord
		) {
			success
			message
		}
	}
`;

export const updateOrder = gql`
	mutation updateOrder($data: String!) {
		updateOrder(data: $data) {
			code
			msg
		}
	}
`;

export const getVideoHTML = gql`
	query getVideoHTML($councilID: ID!) {
		getVideoHTML(councilID: $councilID) {
			council_id
			html_video_council
			html_video_participant
			id
			video_link
		}
	}
`;

export const openVoting = gql`
	mutation openVoting($agenda: AgendaInfo) {
		openVoting(agenda: $agenda) {
			code
			msg
		}
	}
`;

export const closeVoting = gql`
	mutation closeVoting($agenda: AgendaInfo) {
		closeVoting(agenda: $agenda) {
			code
			msg
		}
	}
`;
