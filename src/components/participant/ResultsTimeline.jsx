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
import { councilTimelineQuery, getTimelineTranslation, getTimelineTranslationReverse } from './timeline/TimelineSection';
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
    datos = [...timeline, ...agendas]

    datos.sort(function (a, b) {
        if (a.date === undefined || b.date === undefined) {
            console.log(a.date)
            console.log(b.date)
        }
        // return new Date(a.plantingDate) - new Date(b.plantingDate)
    })




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
                    {timeline.map((event, index) => {
                        const content = JSON.parse(event.content);

                        return (
                            getStepInit(event, content, translate, classes)
                            // getStepColor(event, content, translate, classes)
                            // getStepConNumero(event, content, translate, classes)

                        )
                    })}
                </Stepper>
            </Scrollbar>
        </div>
    )

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
                style={{ textAlign: "left" }}>
                {getTimelineTranslationReverse(event.type, content, translate)}<br />
                <span style={{ fontSize: '0.9em', color: "grey" }}>{moment(event.date).format('LLL')}</span>
            </StepLabel >
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
        </Step >
    )
}

const getStepColor = (event, content, translate, classes) => {
    return (
        <Step active>
            <StepLabel
                icon={
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
                        }}
                    >
                    </div>
                }
                style={{ textAlign: "left" }}>
                <span style={{ fontSize: '0.9em', color: "grey" }}>645654654654654654</span>
            </StepLabel>
            <StepContent style={{ fontSize: '0.9em', textAlign: "left" }}>

            </StepContent>
        </Step>
    )
}

const getStepConNumero = (event, content, translate, classes) => {
    return (
        <Step active>
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
                            border: `2px solid`,
                            fontWeight: "bold"
                        }}
                    >
                        <div>
                            3
                </div>
                    </div>
                }
                style={{ textAlign: "left" }}>
                <span style={{ fontSize: '0.9em', color: "grey" }}>645654654654654654</span>
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