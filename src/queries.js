import gql from 'graphql-tag';

export const councils = gql `
  query Councils($type: String, $companyID: ID!, $isMeeting: Boolean!) {
    councils(type: $type, companyID: $companyID, isMeeting: $isMeeting) {
      id
      date_start
      name
      step
    }
  }
`;

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

export const getCouncilDataStepOne = gql `
    query getCouncilDataStep($councilInfo: CouncilInfo) {
        council(councilInfo: $councilInfo) {
            council{
              id
              council_type
              convene_text
              name
              street
              remote_celebration
              country
              country_state
              zipcode
              city
              date_start
            }
        }
    }
`

export const getCouncilDataStepTwo = gql `
    query getCouncilDataStep($councilInfo: CouncilInfo) {
        council(councilInfo: $councilInfo) {
            council{
              company_id
              id
              quorum_prototype
              selected_census_id
            }

            censuses {
              id
              company_id
              census_name
              census_description
              default_census
              quorum_prototype
              state
            }
        }
    }
`

export const getCouncilDataStepThree = gql `
    query getCouncilDataStep($councilInfo: CouncilInfo) {
        council(councilInfo: $councilInfo) {
            council{
              business_name
              city
              company_id
              country_state
              date_start
              date_start_2nd_call
              id
              step
              street
              zipcode
            }

            agendas{
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

            statute {
              advance_notice_days
              can_add_points
              can_edit_convene
              can_reorder_points
              can_unblock
              census_id
              convene_header
              council_id
              exist_public_url
              exists_act
              exists_advance_notice_days
              exists_second_call
              id
              minimum_separation_between_call
              prototype
              statute_id
              title
              who_can_vote
            }
        }
    }
`

export const getCouncilDataStepFour = gql `
    query getCouncilDataStep($councilInfo: CouncilInfo) {
        council(councilInfo: $councilInfo) {
            council{
              company_id
              id
            }

            attachments{
              council_id
              filename
              filesize
              filetype
              id
            }
        }
    }
`

export const getCouncilDataStepFive = gql `
    query getCouncilDataStep($councilInfo: CouncilInfo) {
        council(councilInfo: $councilInfo) {
            council{
              act_point_majority
              act_point_majority_divider
              act_point_majority_type
              act_point_quorum
              act_point_quorum_divider
              act_point_quorum_type
              approve_act_draft
              auto_close
              close_date
              company_id
              confirm_assistance
              council_type
              date_start
              full_video_record
              id
              security_type
              step
            }

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

            statute {
              advance_notice_days
              can_add_points
              can_edit_convene
              can_reorder_points
              can_unblock
              census_id
              convene_header
              council_id
              exist_public_url
              exists_act
              exists_advance_notice_days
              exists_second_call
              id
              minimum_separation_between_call
              prototype
              statute_id
              title
              who_can_vote
            }
        }
    }
`

export const getCouncilDataStepSix = gql `
    query getCouncilDataStep($councilInfo: CouncilInfo) {
        council(councilInfo: $councilInfo) {
            council{
              act_point_majority
              act_point_majority_divider
              act_point_majority_type
              act_point_quorum
              act_point_quorum_divider
              act_point_quorum_type
              approve_act_draft
              auto_close
              close_date
              company_id
              confirm_assistance
              council_type
              full_video_record
              id
              name
              remote_celebration
              state
              step
            }

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

export const openRoom = gql `
  mutation openRoom($data: String!) {
      openRoom(data: $data) {
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