import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton, AlertConfirm } from '../../../../displayComponents';
import ShareholderEditor from './ShareholderEditor';
import { liveParticipant } from '../../../../queries';
import { getSecondary } from '../../../../styles/colors';
import DelegateOwnVoteModal from '../../live/DelegateOwnVoteModal';
import { PARTICIPANT_STATES } from '../../../../constants';


const DelegateVoteButton = ({ request, client, refetch, setRepresentative, text, translate, inModal, setInModal }) => {
    const [modal, setModal] = React.useState(null);
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const buttonColor = getSecondary();

    const getParticipant = React.useCallback(async () => {
        const response = await client.query({
            query: gql`
                query CouncilParticipant($participantId: Int!, $councilId: Int!){
                    councilParticipant(participantId: $participantId){
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
                    council(id: $councilId) {
                        id
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
                    }
                }
            `,
            variables: {
                participantId: request.participantId,
                councilId: request.councilId
            }
        });
        setData(response.data);
        setLoading(false);

        console.log(response);
    }, [request.participantId]);

    React.useEffect(() => {
        getParticipant();
    }, [getParticipant])

    if (loading) {
        return '';
    }

    const closeModals = () => {
        setModal(request)
        if (!inModal && setInModal) {
            setInModal(true)
        }
    }

    const participant = data.councilParticipant;

    if (participant.live.state === PARTICIPANT_STATES.DELEGATED) {
        setRepresentative(true)
    }
    if (inModal) {
        return (
            <>
                <DelegateOwnVoteModal
                    show={modal}
                    council={data.council}
                    participant={participant.live}
                    refetch={refetch}
                    requestClose={() => setModal(false)}
                    translate={translate}
                    inModal={inModal}
                />
            </>
        )
    } else {
        return (
            <>
                <BasicButton
                    text={text ? text : participant.live.state === PARTICIPANT_STATES.DELEGATED ? 'Voto representado' : "Añadir representación"}
                    onClick={closeModals}
                    buttonStyle={{
                        border: `1px solid ${buttonColor}`,
                        marginLeft: '0.3em'
                    }}
                    color="white"
                    textStyle={{ color: buttonColor }}
                />
                <DelegateOwnVoteModal
                    show={modal}
                    council={data.council}
                    participant={participant.live}
                    refetch={refetch}
                    requestClose={() => setModal(false)}
                    translate={translate}
                    inModal={inModal}
                />
            </>
        )
    }
}

export default withApollo(DelegateVoteButton);