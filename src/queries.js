import gql from 'graphql-tag';

export const councils = gql `
  query Councils($type: String, $companyID: ID!, $isMeeting: Boolean!) {
    councils(type: $type, companyID: $companyID, isMeeting: $isMeeting) {
      id
      date_start
      name
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

export const getCouncilDataStepOne = gql `
    query getCouncilDataStep($councilInfo: CouncilInfo) {
        council(councilInfo: $councilInfo) {
            council{
              id
              council_type
              convene_text
              name
              street
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