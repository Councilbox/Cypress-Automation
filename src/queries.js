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
  mutation UpdateCouncil($council: NewCouncil){
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
  mutation addAgenda($agenda: NewAgenda) {
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
    conveneCouncil(council: $council){
      id
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















//OLD VERSION

export const councilDetails = gql `
  query CouncilDetails($councilInfo: CouncilInfo) {
    councilDetails(councilInfo: $councilInfo) {
      active
      agendas {
        abstention_manual
        abstention_votings
        agenda_subject
        comment
        council_id
        current_remote_census
        date_end
        date_end_votation
        date_start
        date_start_votation
        description
        id
        majority
        majority_divider
        majority_type
        negative_manual
        negative_votings
        no_participate_census
        no_vote_manual
        no_vote_votings
        num_abstention_manual
        num_abstention_votings
        num_current_remote_census
        num_negative_manual
        num_negative_votings
        num_no_participate_census
        num_no_vote_manual
        num_no_vote_votings
        num_positive_manual
        num_positive_votings
        num_present_census
        num_remote_census
        num_total_manual
        num_total_votings
        order_index
        point_state
        positive_manual
        positive_votings
        present_census
        remote_census
        social_capital_current_remote
        social_capital_no_participate
        social_capital_present
        social_capital_remote
        sortable
        subject_type
        total_manual
        total_votings
        voting_state
      }
      approve_act_draft
      attachments {
        council_id
        filename
        filesize
        filetype
        id
      }
      business_name
      city
      company_id
      confirm_assistance
      convene_text
      council_started
      council_type
      country
      country_state
      current_quorum
      date_end
      date_open_room
      date_real_start
      date_start
      date_start_2nd_call
      duration
      email_text
      first_or_second_convene
      full_video_record
      has_limit_date
      header_logo
      id
      limit_date_response
      name
      needed_quorum
      no_celebrate_comment
      president
      proposed_act_sent
      prototype
      quorum_prototype
      satisfy_quorum
      secretary
      security_key
      security_type
      selected_census_id
      send_date
      send_points_mode
      shortname
      state
      statutes {
        id
        prototype
        council_id
        statute_id
        title
        exist_public_url
        add_participants_list_to_act
        exists_advance_notice_days
        advance_notice_days
        exists_second_call
        minimum_separation_between_call
        can_edit_convene
        first_call_quorum_type
        first_call_quorum
        first_call_quorum_divider
        second_call_quorum_type
        second_call_quorum
        second_call_quorum_divider
        exists_delegated_vote
        delegated_vote_way
        exist_max_num_delegated_votes
        max_num_delegated_votes
        exists_limited_access_room
        limited_access_room_minutes
        exists_quality_vote
        quality_vote_option
        can_unblock
        can_add_points
        who_can_vote
        can_reorder_points
        exists_act
        exists_who_was_sent_act
        who_was_sent_act_way
        who_was_sent_act
        exists_who_sign_the_act
        included_in_act_book
        include_participants_list
        exists_comments
        convene_header
        intro
        constitution
        conclusion
        act_template
        census_id
      }
      street
      tin
      video_emails_date
      video_mode
      video_recoding_initialized
      votation_type
      weighted_voting
      zipcode
    }
  }
`;

export const councilFullData = gql `
  query councilFullData($councilInfo: CouncilInfo) {
    councilData(councilInfo: $councilInfo) {
      active
      agenda_attachments{
        agenda_id
        council_id
        filename
        filesize
        filetype
        id
        state
      }
      agendas {
        abstention_manual
        abstention_votings
        agenda_subject
        comment
        council_id
        current_remote_census
        date_end
        date_end_votation
        date_start
        date_start_votation
        description
        id
        majority
        majority_divider
        majority_type
        negative_manual
        negative_votings
        no_participate_census
        no_vote_manual
        no_vote_votings
        num_abstention_manual
        num_abstention_votings
        num_current_remote_census
        num_negative_manual
        num_negative_votings
        num_no_participate_census
        num_no_vote_manual
        num_no_vote_votings
        num_positive_manual
        num_positive_votings
        num_present_census
        num_remote_census
        num_total_manual
        num_total_votings
        order_index
        point_state
        positive_manual
        positive_votings
        present_census
        remote_census
        social_capital_current_remote
        social_capital_no_participate
        social_capital_present
        social_capital_remote
        sortable
        quality_vote_sense
        subject_type
        total_manual
        total_votings
        voting_state
      }
      approve_act_draft
      attachments {
        council_id
        filename
        filesize
        filetype
        id
      }
      business_name
      city
      company_id
      confirm_assistance
      convene_text
      council_started
      council_type
      country
      country_state
      current_quorum
      date_end
      date_open_room
      date_real_start
      date_start
      date_start_2nd_call
      duration
      email_text
      first_or_second_convene
      full_video_record
      has_limit_date
      header_logo
      id
      language
      limit_date_response
      name
      needed_quorum
      no_celebrate_comment
      president
      proposed_act_sent
      prototype
      quorum_prototype
      satisfy_quorum
      secretary
      security_key
      security_type
      selected_census_id
      send_date
      send_points_mode
      shortname
      state
      statutes {
        id
        prototype
        council_id
        statute_id
        title
        exist_public_url
        add_participants_list_to_act
        exists_advance_notice_days
        advance_notice_days
        exists_second_call
        minimum_separation_between_call
        can_edit_convene
        first_call_quorum_type
        first_call_quorum
        first_call_quorum_divider
        second_call_quorum_type
        second_call_quorum
        second_call_quorum_divider
        exists_delegated_vote
        delegated_vote_way
        exist_max_num_delegated_votes
        max_num_delegated_votes
        exists_limited_access_room
        limited_access_room_minutes
        exists_quality_vote
        quality_vote_option
        can_unblock
        can_add_points
        who_can_vote
        can_reorder_points
        exists_act
        exists_who_was_sent_act
        who_was_sent_act_way
        who_was_sent_act
        exists_who_sign_the_act
        included_in_act_book
        include_participants_list
        exists_comments
        convene_header
        intro
        constitution
        conclusion
        act_template
        census_id
      }
      street
      tin
      video_emails_date
      video_mode
      video_recoding_initialized
      votation_type
      weighted_voting
      zipcode
    }
  }
`;

export const countriesQuery = gql `
  query CountriesList {
    countries {
      deno
      id
    }
  }
`;

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
    votationTypes {
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

export const openRoom = gql `
  mutation openRoom($data: String!) {
      openRoom(data: $data) {
        code
        msg
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

export const startCouncil = gql `
  mutation startCouncil($data: String!) {
      startCouncil(data: $data) {
        code
        msg
      }
  }
`

export const endCouncil = gql `
  mutation endCouncil($data: String!) {
      endCouncil(data: $data) {
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

export const openAgenda = gql `
  mutation openDiscussion($agenda: AgendaInfo) {
      openDiscussion(agenda: $agenda) {
        code
        msg
      }
  }
`

export const closeAgenda = gql `
  mutation closeAgenda($agenda: AgendaInfo) {
      closeAgenda(agenda: $agenda) {
        code
        msg
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
`


export const closeVoting = gql `
  mutation closeVoting($agenda: AgendaInfo) {
      closeVoting(agenda: $agenda) {
        code
        msg
      }
  }
`


export const liveParticipants = gql `
  query liveParticipants($councilID: ID!){
    liveParticipants(councilID: $councilID){
      blocked
      council_id
      council_prototype
      council_video_mode
      date
      dni
      email
      id
      last_date_connection
      name
      num_participations
      participant_id
      phone
      position
      real_position
      request_word
      state
      surname
    }
  }

`;