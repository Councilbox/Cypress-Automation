import React from 'react';
import { AlertConfirm, LoadingSection, AgendaNumber } from '../../displayComponents';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getAgendaTypeLabel, hasVotation, getActPointSubjectType } from '../../utils/CBX';
import { getPrimary, getSecondary } from '../../styles/colors';


const Results = ({ data, translate, requestClose, open, participant, council }) => {

    if(data.loading){
        return <LoadingSection />;
    }

    let agendas;


    if(data.agendas){
        agendas = data.agendas.map(agenda => {
            return {
                ...agenda,
                voting: 
                data.participantVotings.find(voting => voting.agendaId === agenda.id)
            }
        });
    }

    const primary = getPrimary();
    const secondary = getSecondary();

    return(
        <AlertConfirm
            requestClose={requestClose}
            open={open}
            acceptAction={requestClose}
            buttonAccept={translate.accept}
            bodyText={
                <div>
                    {agendas.map((agenda, index) => {
                        return (
                            <div style={{marginBottom: '1.2em'}} key={`agenda_${agenda.id}`}>
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
                                    />
                                    <span style={{fontWeight: '700', marginLeft: '0.6em'}}>
                                        {agenda.agendaSubject}
                                    </span>
                                </div>
                                <div>
                                    {`${translate.type}: ${translate[getAgendaTypeLabel(agenda)]}`}
                                </div>
                                {hasVotation(agenda.subjectType) &&
                                    <React.Fragment>
                                        {agenda.voting?
                                            <VoteDisplay vote={agenda.voting.vote} translate={translate} />
                                        :
                                            translate.not_present_at_time_of_voting
                                        }
                                    </React.Fragment>
                                }
                                {agenda.subjectType === getActPointSubjectType() &&
                                    <React.Fragment>
                                        {agenda.voting?
                                            <VoteDisplay vote={agenda.voting.vote} translate={translate} />
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

const VoteDisplay = ({ vote, translate }) => {
    return (
        <div>
            {`${translate.has_voted}: `}
            <span style={{color: getPrimary(), fontWeight: '700'}}>{`${getVote(vote, translate)}`}</span>
        </div>
    )
}

const getVote = (vote, translate) => {
    switch(vote){
        case 1: 
            return translate.in_favor_btn;

        case 0:
            return translate.against_btn;

        case 2:
            return translate.abstention_btn;
        default:
            return 'No ha votado'
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
            agendaId
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