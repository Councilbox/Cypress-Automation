import gql from 'graphql-tag';

export const login = gql `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password){
        token
    }
  }
`;

export const getMe = gql`
    query Me{
        me {
            name
            surname
            id
            roles
            phone
            email
            preferred_language
        }
    }
`;

export const updateUser = gql`
    mutation updateUser($user: UserInput){
      updateUser(user: $user){
        name
        surname
        id
        roles
        phone
        email
        preferred_language
      }
    }
`;

export const updatePassword = gql`
    mutation updatePassword($oldPassword: String!, $newPassword: String!){
      updatePassword(oldPassword: $oldPassword, newPassword: $newPassword){
        id
      }
    }
`;

export const getTranslations = gql`
    query getTranslations($language: String!){
      translations(language: $language){
        label
        text
      }
    }
`;

export const companies = gql`
    query UserCompanies($userId: Int!){
        userCompanies(userId: $userId){
            company{
                alias
                tin
                logo
                id
                businessName
                address
                city
                zipcode
                country
                countryState
                linkKey
                creatorId
                domain
                demo
                type
                language
                creationDate
                corporationId
            }
        }
    }
`;

export const councils = gql `
  query Councils($companyId: Int!, $state: [Int], $isMeeting: Boolean) {
    councils(companyId: $companyId, state: $state, isMeeting: $isMeeting) {
      id
      dateStart
      name
      step
    }
  }
`;

export const updateCouncil = gql`
  mutation UpdateCouncil($council: CouncilInput){
    updateCouncil(council: $council){
      id
    }
  }
`;

export const cancelCouncil = gql`
  mutation cancelCouncil($councilId: Int!){
    cancelCouncil(councilId: $councilId){
      success
    }
  }
`;

export const rescheduleCouncil = gql`
  mutation rescheduleCouncil($councilId: Int!, $dateStart: String, $dateStart2NdCall: String){
    rescheduleCouncil(councilId: $councilId, dateStart: $dateStart, dateStart2NdCall: $dateStart2NdCall){
      success
    }
  }
`;

export const deleteCouncil = gql`
  mutation DeleteCouncil($councilId: Int!){
    deleteCouncil(councilId: $councilId){
      id
      name
    }
  }
`;

export const council = gql`
  query Council($id: Int!){
    council(id: $id){
      state
      step
    }
  }
`;

export const createCouncil = gql`
  mutation CreateCouncil($companyId: Int!){
    createCouncil(companyId: $companyId){
      id
    }
  }
`;

export const changeStatute = gql`
  mutation changeCouncilStatute($councilId: Int!, $statuteId: Int!){
    changeCouncilStatute(councilId: $councilId, statuteId: $statuteId){
      id
    }
  }
`;

export const councilStepOne = gql`
  query CouncilStepOne($id: Int!, $companyId: Int!){
    council(id: $id){
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
      statute {
        advanceNoticeDays
        existsAdvanceNoticeDays
        existsSecondCall
        id
        minimumSeparationBetweenCall
        statuteId
        title
      }
    }
    companyStatutes(companyId: $companyId){
      id
      title
    }
    countries{
      id
      deno
    }

    draftTypes{
      label
      value
    }
  }
`;

export const councilStepTwo = gql`
  query CouncilStepTwo($id: Int!, $companyId: Int!){
    council(id: $id){
      companyId
      id
      quorumPrototype
      selectedCensusId
    }

    languages{
      desc
      columnName
    }

    councilTotalVotes(councilId: $id)
    councilSocialCapital(councilId: $id)

    censuses(companyId: $companyId){
      list{
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

export const deleteParticipant = gql `
    mutation DeleteParticipant($participantId: Int!, $councilId: Int!) {
        deleteParticipant(participantId: $participantId, councilId: $councilId)
    }
`;

export const councilParticipants = gql`
  query participants($councilId: Int!, $filters: [FilterInput], $options: OptionsInput){
    councilParticipants(councilId: $councilId, filters: $filters, options: $options){
      list{
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

export const updateParticipant = gql `
  mutation updateParticipant($participant: ParticipantInput, $representative: RepresentativeInput) {
    updateCouncilParticipant(participant: $participant, representative: $representative){
      success
    }
  }
`;

export const updateConvenedParticipant = gql `
  mutation updateConvenedParticipant($participant: ParticipantInput, $representative: RepresentativeInput) {
    updateConvenedParticipant(participant: $participant, representative: $representative){
      success
    }
  }
`;

export const convenedcouncilParticipants = gql`
  query participants($councilId: Int!, $filters: [FilterInput], $notificationStatus: Int, $options: OptionsInput){
    councilParticipantsWithNotifications(councilId: $councilId, filters: $filters, notificationStatus: $notificationStatus, options: $options){
      list{
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
          notifications{
            reqCode
            refreshDate
          }
        }
        city
        personOrEntity
        notifications{
          reqCode
          refreshDate
        }
      }
      total
    }
  }
`;

export const downloadCBXData = gql`
  mutation cbxData($participantId: Int!){
    cbxData(participantId: $participantId)
  }
`;

export const agendaManager = gql`
  query AgendaManagerFields($companyId: Int!){
    languages{
      desc
      columnName
    }

    companyStatutes(companyId: $companyId){
      title
      id
    }

    majorityTypes {
      value
      label
    }

    quorumTypes{
      label
      value
    }

    votingTypes {
      label
      value
    }

    draftTypes{
      id
      label
    }
  }
`;

export const updateNotificationsStatus = gql`
  mutation updateNotificationsStatus($councilId: Int!){
    updateNotificationsStatus(councilId: $councilId){
      success
      message
    }
  }
`;

export const censuses = gql`
  query censuses($companyId: Int!, $filters: [FilterInput], $options: OptionsInput){
    censuses(companyId: $companyId, filters: $filters, options: $options){
      list{
        id
        companyId
        censusName
        censusDescription
        defaultCensus
        quorumPrototype
        state
        creatorId
        creationDate
        lastEdit
      }
      total
    }
  }
`;

export const deleteCensus = gql`
  mutation deleteCensus($censusId: Int!){
    deleteCensus(censusId: $censusId){
      id
    }
  }
`;

export const census = gql`
  query census($id: Int!){
    census(id: $id){
      id
      companyId
      censusName
      censusDescription
      defaultCensus
      quorumPrototype
      state
      creatorId
      creationDate
      lastEdit
    }
  }
`;

export const censusParticipants = gql`
  query censusParticipants($censusId: Int!, $filters: [FilterInput], $options: OptionsInput){
    censusParticipants(censusId: $censusId, filters: $filters, options: $options){
      list{
        id
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
      total

    }
  }
`;


export const addCensusParticipant = gql`
  mutation addCensusParticipant($participant: CensusParticipantInput!, $representative: CensusParticipantInput){
    addCensusParticipant(participant: $participant, representative: $representative){
      id
    }
  }
`;

export const createCensus = gql`
  mutation createCensus($census: CensusInput!){
    createCensus(census: $census){
      id
    }
  }
`;

export const platformDrafts = gql`
  query platformDrafts($companyId: Int!, $filters: [FilterInput], $options: OptionsInput){
    platformDrafts(filters: $filters, options: $options){
      list{
        categories
        companyType
        corporationId
        councilType
        description
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
    companyDrafts(companyId: $companyId){
      list{
        draftId
      }
    }
    draftTypes{
      id
      label
      value
    }
  }
`;

export const statutes = gql`
  query statutes($companyId: Int!){
    companyStatutes(companyId: $companyId){
      id
      companyId
      title
      existPublicUrl
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
      whoCanVote
      canReorderPoints
      existsAct
      existsWhoWasSentAct
      includedInActBook
      whoWasSentActWay
      canUnblock
      includeParticipantsList
      existsWhoSignTheAct
      prototype
      intro
      constitution
      conclusion
      actTemplate
      conveneHeader
      censusId
      quorumPrototype
      existsComments
      firstCallQuorumDivider
      secondCallQuorumDivider
      canEditConvene
      notifyPoints
    }
  }
`;

export const updateStatute = gql`
  mutation updateStatute($statute: StatuteInput!){
    updateCompanyStatute(statute: $statute){
      id
    }
  }
`;

export const deleteStatute = gql`
  mutation deleteStatute($statuteId: Int!){
    deleteCompanyStatute(statuteId: $statuteId)
  }
`;

export const createStatute = gql`
  mutation createCompanyStatute($statute: StatuteInput!){
    createCompanyStatute(statute: $statute){
      id
    }
  }
`;

export const setDefaultCensus = gql`
  mutation setDefaultCensus($censusId: Int!){
    setDefaultCensus(censusId: $censusId){
      id
    }
  }
`;

export const cloneCensus = gql`
  mutation cloneCensus($census: CensusInput!){
    cloneCensus(census: $census){
      id
    }
  }
`;

export const sendConveneTest = gql`
  mutation sendConveneTest($councilId: Int!, $email: String!){
    sendConveneTest(councilId: $councilId, email: $email){
      success
    }
  }
`;

export const sendPreConvene = gql`
  mutation sendPreConvene($councilId: Int!){
    sendPreConvene(councilId: $councilId){
      success
    }
  }
`;

export const conveneWithoutNotice = gql`
  mutation conveneWithoutNotice($councilId: Int!){
    conveneWithoutNotice(councilId: $councilId){
      success
    }
  }
`;

export const councilStepThree = gql`
  query CouncilStepThree($id: Int!, $companyId: Int!){
    council(id: $id){
      businessName
      city
      country
      companyId
      countryState
      dateStart
      dateStart2NdCall
      id
      step
      street
      zipcode

      agendas{
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
        whoCanVote
      }
    }

    companyStatutes(companyId: $companyId){
      id
      title
    }

    majorityTypes{
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

export const sendConvene = gql `
  mutation sendConvene($councilId: Int!) {
    sendConvene(councilId: $councilId) {
        success
      }
  }
`;

export const councilStepFour = gql`
  query CouncilStepFour($id: Int!){
    council(id: $id){
      id
      companyId
      attachments{
        filename
        filesize
        filetype
        id
      }
    }
  }
`;

export const addCouncilAttachment = gql`
  mutation AddCouncilAttachment($attachment: CouncilAttachmentInput){
    addCouncilAttachment(attachment: $attachment){
      id
    }
  }
`;

export const updateCouncilAttachment = gql`
  mutation updateCouncilAttachment($id: Int!, $filename: String!){
    updateCouncilAttachment(id: $id, filename: $filename){
      filename
    }
  }
`;

export const removeCouncilAttachment = gql`
  mutation removeCouncilAttachment($councilId: Int!, $attachmentId: Int!){
    removeCouncilAttachment(councilId: $councilId, attachmentId: $attachmentId)
  }
`;

export const councilStepFive = gql`
  query CouncilStepFive($id: Int!){
    council(id: $id){
      actPointMajority
      actPointMajorityDivider
      actPointMajorityType
      actPointQuorum
      actPointQuorumDivider
      actPointQuorumType
      approveActDraft
      autoClose
      closeDate
      companyId
      confirmAssistance
      councilType
      dateStart
      fullVideoRecord
      id
      securityType
      step
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
        councilId
        existPublicUrl
        existsAct
        existsAdvanceNoticeDays
        existsSecondCall
        id
        minimumSeparationBetweenCall
        prototype
        statuteId
        title
        whoCanVote
      }
    }
    majorityTypes{
      label
      value
    }
  }
`;


export const conveneCouncil = gql`
  mutation conveneCouncil($councilId: Int!){
    conveneCouncil(councilId: $councilId){
      success
    }
  }
`;

/*
  platforms {
    act
    company_id
    council_id
    emails
    id
    room
    room_access
    security_email
    security_sms
    signature
    video
  }

  previewHtml
}*/

export const councilStepSix = gql`
  query CouncilStepSix($id: Int!, $companyId: Int!){
    council(id: $id){
      actPointMajority
      actPointMajorityDivider
      actPointMajorityType
      actPointQuorum
      actPointQuorumDivider
      actPointQuorumType
      approveActDraft
      autoClose
      closeDate
      companyId
      confirmAssistance
      councilType
      fullVideoRecord
      id
      name
      remoteCelebration
      state
      step
    }
    councilPreviewHTML(id: $id, companyId: $companyId)
  }
`;

export const councilDetails = gql `
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
      participants{
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
        whoCanVote
        canReorderPoints
        existsAct
        existsWhoWasSentAct
        whoWasSentActWay
        whoWasSentAct
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

export const councilLiveQuery =  gql`
  query CouncilLiveQuery($councilID: Int!) {
    council(id: $councilID) {
      active
      agendas {
        abstentionManual
        abstentionVotings
        agendaSubject
        attachments{
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
      president
      proposedActSent
      prototype
      quorumPrototype
      room {
        htmlVideoCouncil
      }
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
        whoCanVote
        canReorderPoints
        existsAct
        existsWhoWasSentAct
        whoWasSentActWay
        whoWasSentAct
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
  }
`;

export const addRepresentative = gql`
  mutation addRepresentative($representative: LiveRepresentativeInput, $participantId: Int!){
    addRepresentative(representative: $representative, participantId: $participantId){
      success
      message
    }
  }
`;


export const downloadCouncilAttachment = gql`
  query downloadCouncilAttachment($attachmentId: Int!){
    councilAttachment(id: $attachmentId){
      base64
      filename
      filetype
    }
  }
`;

export const downloadConvenePDF = gql`
  query downloadConvenePDF($councilId: Int!){
    downloadConvenePDF(councilId: $councilId)
  }
`;

export const sendConveneReminder = gql`
  mutation sendConveneReminder($councilId: Int!, $includeAgenda: Int, $confirmAssistance: Int){
    sendConveneReminder(councilId: $councilId, includeAgenda: $includeAgenda, confirmAssistance: $confirmAssistance){
      success
      message
    }
  }
`;

export const majorityTypes = gql`
  query majorityTypes{
    majorityTypes{
      label
      value
    }
  }
`;

export const votingTypes = gql`
  query votingTypes{
    votingTypes{
      label
      value
    }
  }
`;

export const quorumTypes = gql`
  query quorumTypes {
    quorumTypes{
      label
      value
    }
  }
`;

export const councilVideoHTML = gql`
  query councilVideoHTML($councilId: Int!){
    councilVideoHTML(councilId: $councilId){
      councilId
      htmlVideoCouncil
      htmlVideoParticipant
      id
      videoLink
    }
  }
`;

export const addAgendaAttachment = gql`
  mutation addAgendaAttachment($attachment: AgendaAttachmentInput!){
    addAgendaAttachment(attachment: $attachment){
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
  mutation removeAgendaAttachment($attachmentId: Int!, $agendaId: Int!){
    removeAgendaAttachment(attachmentId: $attachmentId, agendaId: $agendaId)
  } 
`;

export const openAgenda = gql`
  mutation openAgenda($agendaId: Int!, $councilId: Int!){
    openAgenda(agendaId: $agendaId councilId: $councilId)
  }
`;

export const closeAgenda = gql`
  mutation closeAgenda($agendaId: Int!, $councilId: Int!){
    closeAgenda(agendaId: $agendaId councilId: $councilId){
      id
      pointState
    }
  }
`;

export const openAgendaVoting = gql`
  mutation openAgendaVoting($agenda: AgendaInput){
    openAgendaVoting(agenda: $agenda){
      id
    }
  }
`;

export const closeAgendaVoting = gql`
  mutation closeAgendaVoting($agenda: AgendaInput){
    closeAgendaVoting(agenda: $agenda){
      id
    }
  }
`;

export const startCouncil = gql `
  mutation startCouncil($council: CouncilInput) {
    startCouncil(council: $council) {
      id
    }
  }
`;

export const endCouncil = gql `
  mutation endCouncil($councilId: Int!) {
      endCouncil(councilId: $councilId) {
        id
      }
  }
`;

export const openCouncilRoom = gql `
  mutation openCouncilRoom($council: CouncilInput) {
      openCouncilRoom(council: $council) {
        id
      }
  }
`;

export const liveParticipants = gql `
  query liveParticipants($councilId: Int!, $filters: [FilterInput], $notificationStatus: Int, $options: OptionsInput){
    liveParticipants(councilId: $councilId, filters: $filters, notificationStatus: $notificationStatus, options: $options){
      list{
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
        videoPassword
        representative{
          id
          name
          surname
        }
        blocked
        lastDateConnection
        videoMode
        notifications{
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

export const participantsToDelegate = gql`
  query liveParticipantsToDelegate($councilId: Int!, $filters: [FilterInput], $options: OptionsInput){
    liveParticipantsToDelegate(councilId: $councilId, filters: $filters, options: $options){
      list{
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

export const participantsWhoCanDelegate = gql`
query liveParticipantsToDelegate($councilId: Int!, $filters: [FilterInput], $options: OptionsInput){
  liveParticipantsWhoCanDelegate(councilId: $councilId, filters: $filters, options: $options){
    list{
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

export const liveParticipant = gql`
  query liveParticipant($participantId: Int!){
    liveParticipant(liveId: $participantId){
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
      videoPassword
      blocked
      lastDateConnection
      videoMode
      notifications{
        participantId
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
        email
        phone
        position
        language
        numParticipations
        socialCapital
      }
      delegatedVotes {
        id
        name
        surname
        dni
        email
        phone
        position
        language
        numParticipations
        socialCapital
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

export const updateLiveParticipant = gql`
  mutation updateLiveParticipant($participant: LiveParticipantInput, $representative: LiveRepresentativeInput){
    updateLiveParticipant(participant: $participant, representative: $representative){
      success
      message
    }
  }
`;


export const iframeURLTEMP = gql`
  query councilRoomTEMP($councilId: Int!, $participantId: String!){
    roomVideoURL(councilId: $councilId, participantId: $participantId)
  }
`;

export const iframeParticipant = gql`
  query iframeURL($participantId: String!){
    participantVideoURL(participantId: $participantId)
  }
`;

export const companyTypes = gql `
  query CompanyTypes {
    companyTypes {
      label
      value
    }
  }
`;

export const draftDetails = gql`
  query draftDetails{
    companyTypes{
      label
      value
    }

    draftTypes{
      id
      label
      value
    }

    majorityTypes{
      label
      value
    }

    votingTypes{
      value
      label
    }
  }
`;

export const cloneDrafts = gql`
  mutation clonePlatformDrafts($ids: [Int], $companyId: Int!){
    clonePlaftormDrafts(platformDraftIds: $ids, companyId: $companyId)
  }
`;


export const agendaComments = gql`
  query agendaVotings($agendaId: Int!){
    agendaVotings(agendaId: $agendaId){
      comment
      name
      surname
      email
      position
    }
  }
`;






//OLD VERSION

export const participantsQuery = gql `
  query Participants($councilID: ID!){
    participants(councilID: $councilID){
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

export const saveCouncilData = gql `
  mutation saveCouncilData($data: String!) {
      saveCouncil(data: $data) {
        code
        msg
      }
  }
`



export const saveAttachmentMutation = gql `
  mutation saveAttachmentM($data: String!) {
      saveAttachment(data: $data) {
        code
        msg
      }
  }
`

export const deleteAttachmentMutation = gql `
  mutation deleteAttachmentM($attachment: AttachmentInfo) {
      deleteAttachment(attachment: $attachment) {
        code
        msg
      }
  }
`

export const sendAgendaAttachment = gql `
  mutation sendAgendaAttachment($data: String!) {
      sendAgendaAttachment(data: $data) {
        code
        msg
      }
  }
`

export const deleteAgendaAttachment = gql `
  mutation deleteAgendaAttachment($attachment: AttachmentInfo!) {
      deleteAgendaAttachment(attachment: $attachment) {
        code
        msg
      }
  }
`

export const getComments = gql `
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
`

export const getCompanies = gql `
  query getCompanies{
    companies{
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

export const getVotings = gql `
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
`



export const changeRequestWord = gql `
  mutation changeRequestWord($wordState: WordState) {
      changeRequestWord(wordState: $wordState) {
        code
        msg
      }
  }
`


export const updateOrder = gql `
  mutation updateOrder($data: String!) {
      updateOrder(data: $data) {
        code
        msg
      }
  }
`

export const liveRecount = gql `
  query liveRecount($councilID: ID!) {
      liveRecount(councilID: $councilID) {
        council_id
        num_current_remote
        num_no_participate
        num_present
        num_remote
        num_right_voting
        num_total
        part_current_remote
        part_no_participate
        part_present
        part_remote
        part_right_voting
        part_total
        social_capital_current_remote
        social_capital_no_participate
        social_capital_present
        social_capital_remote
        social_capital_right_voting
        social_capital_total
      }
  }
`


export const getVideoHTML = gql `
  query getVideoHTML($councilID: ID!) {
      getVideoHTML(councilID: $councilID) {
        council_id
        html_video_council
        html_video_participant
        id
        video_link
      }
  }
`

export const openVoting = gql `
  mutation openVoting($agenda: AgendaInfo) {
      openVoting(agenda: $agenda) {
        code
        msg
      }
  }
`;

export const closeVoting = gql `
  mutation closeVoting($agenda: AgendaInfo) {
      closeVoting(agenda: $agenda) {
        code
        msg
      }
  }
`;