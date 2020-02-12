import React from 'react';
import { AlertConfirm, LoadingSection, AgendaNumber, Scrollbar } from '../../displayComponents';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { getAgendaTypeLabel, hasVotation, getActPointSubjectType, isCustomPoint } from '../../utils/CBX';
import { getPrimary, getSecondary } from '../../styles/colors';
import { AGENDA_TYPES } from '../../constants';
import { Stepper, Step, StepLabel, StepContent, withStyles } from 'material-ui';
import { isMobile } from 'react-device-detect';
import StepConnector from 'material-ui/Stepper/StepConnector';
import { councilTimelineQuery, getTimelineTranslationReverse } from './timeline/TimelineSection';
import { usePolling } from '../../hooks';
import { moment } from '../../containers/App';


const ResultsTimeline = ({ data, translate, requestClose, open, participant, council, stylesHead, classes, client, endPage }) => {
    const primary = getPrimary();
    const secondary = getSecondary();
    const [timeline, setTimeline] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [loaded, setLoaded] = React.useState(false);

    const getData = React.useCallback(async () => {
        const getTimeline = async () => {
            const response = await client.query({
                query: councilTimelineQuery,
                variables: {
                    councilId: council.id
                }
            });

            setLoading(false);
            setLoaded(true);
            setTimeline(response.data.councilTimeline);
        }

        getTimeline();
    }, [council.id, setLoading, setLoaded, setTimeline, client]);

    usePolling(getData, 6000);

    // React.useEffect(() => {
    //     if (loaded && scrollToBottom) {
    //         setTimeout(() => {
    //             // scrollToBottom();
    //         }, 80);
    //     }
    // }, [loaded]);



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
    let datos = []
    datos = [...timeline]

    datos = datos.sort(function (a, b) {
        return moment(a.date ? a.date : a.dateStart).format('X') - moment(b.date ? b.date : b.dateStart).format('X')
    });

    let count = 0;

    return (
        <div style={{ height: "100%" }}>
            <Scrollbar>
                <Stepper
                    connector={
                        <StepConnector
                            classes={{
                                line: classes.line
                            }}
                        />
                    }
                    orientation="vertical"
                    style={{ margin: '0', padding: isMobile ? '20px' : '10px', textAlign: "left" }}
                >
                    {datos.map((event, index) => {
                        let content
                        if (event.content) {
                            content = JSON.parse(event.content);
                        } else {
                            count++
                        }
                        switch (event.type) {
                            case 'START_COUNCIL':
                            case 'END_COUNCIL':
                                return getStepInit(event, content, translate, classes);
                            case 'START_AUTO_COUNCIL':
                            case 'CLOSE_REMOTE_VOTINGS':
                            case 'OPEN_POINT_DISCUSSION':
                            case 'CLOSE_POINT_DISCUSSION':
                            case 'CLOSE_VOTING':
                            case 'REOPEN_VOTING':
                                return getStepColor(event, content, translate, classes);
                            default:
                                return getStepConNumero(content, translate, agendas);
                        }
                    })}
                </Stepper>
            </Scrollbar>
        </div>
    )

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


const getStepInit = (event, content, translate, classes) => {
    return (
        <Step active
            key={event.id}
        >
            <StepLabel
                icon={
                    <div
                        style={{
                            color: 'white',
                            border: '1px solid' + getPrimary(),
                            height: '10px',
                            width: '10px',
                            borderRadius: '15px',
                            marginLeft: '8px',
                        }}
                    >
                    </div>
                }
                style={{ textAlign: "left", fontSize: "13px" }}>
                <span style={{ fontSize: "13px", fontWeight: "normal" }}>{getTimelineTranslationReverse(event.type, content, translate)}</span><br />
                <span style={{ fontSize: '0.9em', color: "grey", fontSize: "13px" }}>{moment(event.date).format('LLL')}</span>
            </StepLabel>
            <StepContent classes={{
                root: classes.root
            }} style={{ fontSize: '0.9em', textAlign: "left" }}>
                {(event.type === 'CLOSE_VOTING' && isValidResult(content.data.agendaPoint.type)) &&
                    <React.Fragment>
                        <span>
                            {`${translate.recount}:`}
                            <div aria-label={`${translate.in_favor_btn}: ${content.data.agendaPoint.results.positive}`}>{translate.in_favor_btn}: {content.data.agendaPoint.results.positive}</div>
                            <div aria-label={`${translate.against_btn}: ${content.data.agendaPoint.results.negative}`}>{translate.against_btn}: {content.data.agendaPoint.results.negative}</div>
                            <div aria-label={`${translate.abstention}: ${content.data.agendaPoint.results.abstention}`}>{translate.abstention}: {content.data.agendaPoint.results.abstention}</div>
                            <div aria-label={`${translate.no_vote_lowercase}: ${content.data.agendaPoint.results.noVote}`}>{translate.no_vote_lowercase}: {content.data.agendaPoint.results.noVote}</div>                                            </span>
                    </React.Fragment>
                }
            </StepContent>
        </Step>
    )
}

const getStepColor = (event, content, translate, classes) => {
    return (
        <Step active key={event.id}>
            <StepLabel icon={
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "23px",
                        width: "23px",
                        margin: '0',
                        marginLeft: '1px',
                        borderRadius: "12px",
                        backgroundColor: getPrimary(),
                        fontSize: "13px"
                    }}
                >
                </div>
            }
                style={{ textAlign: "left", fontSize: "13px" }}>
                <span style={{ fontSize: "13px" }}>{getTimelineTranslation(event.type, content, translate)}</span><br />
                <span style={{ fontSize: '0.9em', fontSize: "13px", color: "grey", }}>{moment(event.date).format('LLL')}</span>
            </StepLabel>
            <StepContent style={{ fontSize: '0.9em' }}>
                {(event.type === 'CLOSE_VOTING' && isValidResult(content.data.agendaPoint.type)) &&
                    <React.Fragment>
                        <span>
                            {`${translate.recount}: `}
                            <div aria-label={`${translate.in_favor_btn}: ${content.data.agendaPoint.results.positive}`}>{translate.in_favor_btn}: {content.data.agendaPoint.results.positive}</div>
                            <div aria-label={`${translate.against_btn}: ${content.data.agendaPoint.results.negative}`}>{translate.against_btn}: {content.data.agendaPoint.results.negative}</div>
                            <div aria-label={`${translate.abstention}: ${content.data.agendaPoint.results.abstention}`}>{translate.abstention}: {content.data.agendaPoint.results.abstention}</div>
                            <div aria-label={`${translate.no_vote_lowercase}: ${content.data.agendaPoint.results.noVote}`}>{translate.no_vote_lowercase}: {content.data.agendaPoint.results.noVote}</div>                                            </span>
                    </React.Fragment>
                }
            </StepContent>
        </Step>
    )
}

const getStepConNumero = (event, translate, agendas) => {
    const agenda = agendas.find(agenda => agenda.id === event.data.agendaPoint.id);
    return (
        <Step active key={agenda.id}>
            <StepLabel
                icon={
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "24px",
                            filter: "opacity(50%)",
                            width: "24px",
                            fontSize: "15px",
                            cursor: "pointer",
                            userSelect: "none",
                            position: 'relative',
                            margin: 0,
                            color: getSecondary(),
                            borderRadius: "12px",
                            backgroundColor: "white",
                            border: `1px solid`,
                            fontWeight: "bold",
                        }}
                    >
                        <div>
                            {agenda.orderIndex}
                        </div>
                    </div>
                }
                style={{ textAlign: "left" }}>
                <span style={{ fontSize: "13px", color: "black" }}>
                    <span style={{ color: getPrimary() }}>{translate.opened_votings}: </span>
                    <span style={{ color: getSecondary(), fontWeight: "bold" }}>{agenda.agendaSubject}</span>
                </span>
                <div style={{ textAlign: "left", fontSize: "13px", color: "grey", }}>
                    <span style={{ fontSize: '0.9em', fontSize: "13px", color: "grey", }}>{agenda.dateStartVotation ? moment(agenda.dateStartVotation).format('LLL') : ""}</span><br />
                    {`${translate.type}: ${translate[getAgendaTypeLabel(agenda)]}`}
                </div>
                {(hasVotation(agenda.subjectType) && agenda.subjectType !== getActPointSubjectType()) &&
                    <div style={{ textAlign: "left" }}>
                        {agenda.voting ?
                            <VoteDisplay voting={agenda.voting} translate={translate} agenda={agenda} endPage={true} />
                            :
                            translate.not_present_at_time_of_voting
                        }
                    </div>
                }
                {agenda.subjectType === getActPointSubjectType() &&
                    <div style={{ textAlign: "left" }}>
                        {agenda.voting ?
                            <VoteDisplay voting={agenda.voting} translate={translate} agenda={agenda} endPage={true} />
                            :
                            translate.not_present_at_time_of_voting
                        }
                    </div>
                }
            </StepLabel>
            <StepContent style={{ fontSize: '0.9em', textAlign: "left" }}>
            </StepContent>
        </Step>
    )
}

const isValidResult = type => {
    const types = {
        PUBLIC_CUSTOM: true,
        PRIVATE_CUSTOM: true,
        CUSTOM_NOMINAL: true,
        default: false
    }

    return types[type] ? !types[type] : types.default;
}


export const getTimelineTranslation = (type, content, translate) => {
    const types = {
        'START_COUNCIL': () => translate.council_started,
        'START_AUTO_COUNCIL': () => translate.council_started,
        'OPEN_VOTING': () => (<span>
            <span style={{ color: getPrimary() }}>{`${translate.voting_open}: ` }</span>
            <span style={{ color: "black" }}>{content.data.agendaPoint.name}</span>
            </span>
        ),
        'END_COUNCIL': () => translate.end_council,
        'OPEN_POINT_DISCUSSION': () => (
            <span>
                <span style={{ color: getPrimary() }}>{`${translate.agenda_begin_discussed}: `}</span>
                <span style={{ color: "black" }}>{content.data.agendaPoint.name}</span>
            </span>
        ),
        'CLOSE_POINT_DISCUSSION': () => (
            <span>
                <span style={{ color: getPrimary() }}>{`${translate.close_point}: `}</span>
                <span style={{ color: "black" }}>{content.data.agendaPoint.name}</span>
            </span>
        ),
        'CLOSE_VOTING': () => (
            <span>
                <span style={{ color: getPrimary() }}>{`${translate.closed_votings}: `}</span>
                <span style={{ color: "black" }}>{content.data.agendaPoint.name}</span>
            </span>
        ),
        'REOPEN_VOTING': () => (
            <span>
                <span style={{ color: getPrimary() }}>{`${translate.reopen_voting}: `}</span>
                <span style={{ color: "black" }}>{content.data.agendaPoint.name}</span>
            </span>
        ),
        default: () => 'Tipo no reconocido'
    }

    return types[type] ? types[type]() : types.default();
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

const stepperStyles = {
    line: {
        borderColor: getPrimary(),
        borderLeftStyle: 'dashed',
        borderLeftWidth: '1px'
    },
    root: {
        borderColor: getPrimary(),
        borderLeftStyle: 'dashed',
        borderLeftWidth: '1px'
    },
}

export default graphql(agendas, {
    options: props => ({
        variables: {
            councilId: props.council.id,
            participantId: props.participant.id
        }
    })
})(withApollo((withStyles(stepperStyles)(ResultsTimeline))));