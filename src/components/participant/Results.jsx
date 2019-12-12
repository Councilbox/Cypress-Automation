import React from 'react';
import { AlertConfirm, LoadingSection, AgendaNumber } from '../../displayComponents';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getAgendaTypeLabel, hasVotation, getActPointSubjectType, isCustomPoint } from '../../utils/CBX';
import { getPrimary, getSecondary } from '../../styles/colors';
import { AGENDA_TYPES } from '../../constants';


const Results = ({ data, translate, requestClose, open, participant, council, stylesHead, endPage }) => {
    const primary = getPrimary();
    const secondary = getSecondary();

    if (data.loading) {
        return <LoadingSection />;
    }

    let agendas;


    if (data.agendas) {
        agendas = data.agendas.map(agenda => {
            return {
                ...agenda,
                voting: data.participantVotings.find(voting => voting.agendaId === agenda.id)
            }
        });
    }

    if (endPage) {
        return (
            <div style={{ ...stylesHead }}>
                {agendas.map((agenda, index) => {
                    return (
                        <div style={{ marginBottom: '1.2em' }} key={`agenda_${agenda.id}`}>
                            <div
                                style={{
                                    display: 'flex',
                                }}
                            >
                                <AgendaNumber
                                    index={index + 1}
                                    open={agenda.pointState === 1}
                                    active={false}
                                    activeColor={primary}
                                    voting={agenda.votingState === 1 && agenda.subjectType !== 0}
                                    translate={translate}
                                    secondaryColor={secondary}
                                    small={true}
                                    style={{
                                        position: 'static',
                                    }}
                                    moreStyles={{
                                        border: `1px solid ${getSecondary()}`,
                                    }}
                                />
                                <span style={{ marginLeft: '0.6em' }}>
                                    {agenda.agendaSubject}
                                </span>
                            </div>
                            <div style={{ textAlign: "left", paddingLeft: " 33px" }}>
                                {`${translate.type}: ${translate[getAgendaTypeLabel(agenda)]}`}
                            </div>
                            {(hasVotation(agenda.subjectType) && agenda.subjectType !== getActPointSubjectType()) &&
                                <div style={{ textAlign: "left", paddingLeft: " 33px" }}>
                                    {agenda.voting ?
                                        <VoteDisplay voting={agenda.voting} translate={translate} agenda={agenda} endPage={endPage} />
                                        :
                                        translate.not_present_at_time_of_voting
                                    }
                                </div>
                            }
                            {agenda.subjectType === getActPointSubjectType() &&
                                <div style={{ textAlign: "left", paddingLeft: " 33px" }}>
                                    {agenda.voting ?
                                        <VoteDisplay voting={agenda.voting} translate={translate} agenda={agenda} endPage={endPage} />
                                        :
                                        translate.not_present_at_time_of_voting
                                    }
                                </div>
                            }
                        </div>
                    )
                })}
            </div>

        )
    } else {
        return (
            <AlertConfirm
                requestClose={requestClose}
                open={open}
                acceptAction={requestClose}
                buttonAccept={translate.accept}
                bodyText={
                    <div>
                        {agendas.map((agenda, index) => {
                            return (
                                <div style={{ marginBottom: '1.2em' }} key={`agenda_${agenda.id}`}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            width: '22px',
                                            height: '22px'
                                        }}
                                    >
                                        <AgendaNumber
                                            index={index + 1}
                                            open={agenda.pointState === 1}
                                            active={false}
                                            activeColor={primary}
                                            voting={agenda.votingState === 1 && agenda.subjectType !== 0}
                                            translate={translate}
                                            secondaryColor={secondary}
                                            small={true}
                                            style={{
                                                position: 'static',
                                            }}
                                        />
                                        <span style={{ fontWeight: '700', marginLeft: '0.6em' }}>
                                            {agenda.agendaSubject}
                                        </span>
                                    </div>
                                    <div>
                                        {`${translate.type}: ${translate[getAgendaTypeLabel(agenda)]}`}
                                    </div>
                                    {(hasVotation(agenda.subjectType) && agenda.subjectType !== getActPointSubjectType()) &&
                                        <React.Fragment>
                                            {agenda.voting ?
                                                <VoteDisplay voting={agenda.voting} translate={translate} agenda={agenda} />
                                                :
                                                translate.not_present_at_time_of_voting
                                            }
                                        </React.Fragment>
                                    }
                                    {agenda.subjectType === getActPointSubjectType() &&
                                        <React.Fragment>
                                            {agenda.voting ?
                                                <VoteDisplay voting={agenda.voting} translate={translate} agenda={agenda} />
                                                :
                                                translate.not_present_at_time_of_voting
                                            }
                                        </React.Fragment>
                                    }
                                </div>
                            )
                        })}
                    </div>
                }
                title={`${participant.name} ${participant.surname}`}
            />
        )
    }
}

const VoteDisplay = ({ voting, translate, agenda, ballots, endPage }) => {
    const votes = new Set();


    voting.ballots.forEach(ballot => votes.add(ballot.value));
    if (agenda.subjectType === AGENDA_TYPES.PRIVATE_VOTING || agenda.subjectType === AGENDA_TYPES.CUSTOM_PRIVATE) {
        return (
            <div>
                <span style={{ color: getPrimary(), fontWeight: endPage ? "" : '700' }}>{`${voting.vote !== -1 ? translate.has_voted : translate.no_vote_lowercase}`}</span>
            </div>
        )
    }

    if (isCustomPoint(agenda.subjectType) && voting.ballots.length === 0) {
        return (
            <div>
                {`${translate.your_vote_is}: `}
                <span style={{ color: getPrimary(), fontWeight: endPage ? "" : '700' }}>{`${translate.no_vote_lowercase}`}</span>
            </div>
        )
    }

    return (
        <div>
            {`${translate.your_vote_is}: `}
            {(agenda.subjectType === AGENDA_TYPES.CUSTOM_NOMINAL || agenda.subjectType === AGENDA_TYPES.CUSTOM_PUBLIC) ?
                Array.from(votes.values()).map((ballot, index) => <span key={`voting_${index}`}>{index > 0 ? ' / ' : ''}{
                    ballot === 'Abstention' ?
                        translate.abstention_btn
                        :
                        ballot
                }</span>)
                :
                <span style={{ color: getPrimary(), fontWeight: endPage ? "" : '700' }}>{`${getVote(voting.vote, translate)}`}</span>
            }
        </div>
    )
}

const getVote = (vote, translate) => {
    switch (vote) {
        case 1:
            return translate.in_favor_btn;

        case 0:
            return translate.against_btn;

        case 2:
            return translate.abstention_btn;
        default:
            return translate.no_vote_lowercase
    }
}

const agendas = gql`
    query Agendas($councilId: Int!, $participantId: Int!){
        agendas(councilId: $councilId){
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
            options {
                maxSelections
                id
            }
            items {
                id
                value
            }
            councilId
            dateEndVotation
            dateStart
            dateStartVotation
            description
            id
            orderIndex
            pointState
            subjectType
            votingState
        }
        participantVotings(participantId: $participantId){
            id
            comment
            participantId
            delegateId
            agendaId
            ballots {
                participantId
                value
                weight
                itemId
                id
            }
            numParticipations
            author {
                id
                state
                name
                type
                surname
                representative {
                    id
                    type
                    name
                    surname
                }
            }
            vote
        }
    }
`;

export default graphql(agendas, {
    options: props => ({
        variables: {
            councilId: props.council.id,
            participantId: props.participant.id
        }
    })
})(Results);