import gql from 'graphql-tag';

export const login = gql `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password){
        token
    }
  }
`;

export const languages = gql`
  query languages{
    languages{
      desc
      columnName
    }
  }
`;

export const getMe = gql`
    query Me{
        me {
            name
            surname
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
  query Councils($companyId: Int!, $state: Int, $isMeeting: Boolean) {
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

export const deleteCouncil = gql`
  mutation DeleteCouncil($councilId: Int!){
    deleteCouncil(councilId: $councilId){
      id
      name
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

export const councilStepOne = gql`
  query CouncilStepOne($id: Int!){
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
    }
    countries{
      id
      deno
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
    }

    censuses(companyId: $companyId){
      id
      companyId
      censusName
      censusDescription
      defaultCensus
      quorumPrototype
      state
    }
  }
`;

export const councilStepThree = gql`
  query CouncilStepThree($id: Int!){
    council(id: $id){
      businessName
      city
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
        existsSecondCall
        id
        minimumSeparationBetweenCall
        prototype
        statuteId
        title
        whoCanVote
      }
    }
    votingTypes {
      label
      value
    }
  }
`;

export const addAgenda = gql `
  mutation addAgenda($agenda: AgendaInput) {
      addAgenda(agenda: $agenda) {
        id
      }
  }
`

export const removeAgenda = gql`
  mutation removeAgenda($councilId: Int!, $agendaId: Int!){
    removeAgenda(councilId: $councilId, agendaId: $agendaId){
      id
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
  mutation AddCouncilAttachment($attachment: NewCouncilAttachment){
    addCouncilAttachment(attachment: $attachment){
      id
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

export const provinces = gql`
  query ProvinceList($countryId: Int!){
    provinces(countryId: $countryId){
      id
      deno
    }
  }
`;

export const conveneCouncil = gql`
  mutation conveneCouncil($council: CouncilInput){
    conveneCouncil(council: $council)
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

export const updateAgendas = gql`
  mutation updateAgendas($agendaList: [AgendaInput]){
    updateAgendas(agendaList: $agendaList){
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
  mutation updateAgenda($agenda: AgendaInput){
    updateAgenda(agenda: $agenda){
      id
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
  query liveParticipants($councilId: Int!){
    liveParticipants(councilId: $councilId){
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
      uuid
      assistanceComment
      assistanceLastDateConfirmed
      assistanceIntention
      videoPassword
      blocked
      lastDateConnection
      videoMode
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

export const countries = gql `
  query countries {
    countries {
      deno
      id
    }
  }
`;












//OLD VERSION


export const majorities = gql `
  query majorities{
    majorities {
      value
      label
    }
  }
`;

export const quorums = gql `
  query quorums{
    quorums 
  }
`;

export const votationTypes = gql `
  query votationTypes{
    votingTypes {
      label
      value
    }
  }
`;

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

export const sendConvene = gql `
  mutation sendConvene($data: String!) {
      sendConvene(data: $data) {
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