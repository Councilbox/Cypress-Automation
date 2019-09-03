import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { Scrollbar, LoadingSection } from '../../../displayComponents';
import { Paper } from 'material-ui';
import { Stepper, Step, StepLabel, StepContent } from 'material-ui';
import { moment } from '../../../containers/App';
import { isMobile } from 'react-device-detect';
import CouncilInfoMenu from '../menus/CouncilInfoMenu';
import withTranslations from '../../../HOCs/withTranslations';


const TimelineSection = ({ translate, participant, council, scrollToBottom, isMobile, client }) => {
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

    React.useEffect(() => {
        getData();
        let interval = setInterval(() => getData(), 6000);
        return () => clearInterval(interval);
    }, [getData]);

    React.useEffect(() => {
        if (loaded && scrollToBottom) {
            setTimeout(() => {
                scrollToBottom();
            }, 80);
        }
    }, [loaded]);

    return (
        loading ?
            <LoadingSection />
            :
            <React.Fragment>
                {isMobile &&
                    <div style={{ position: "fixed", top: '50px', right: "15px", background: "gainsboro", width: "47px", height: "32px", borderRadius: "25px" }}>
                        <CouncilInfoMenu
                            translate={translate}
                            participant={participant}
                            council={council}
                            agendaNoSession={true}
                        />
                    </div>
                }
                <Stepper orientation="vertical" style={{ margin: '0', padding: isMobile ? '20px' : '10px' }}>
                    {timeline.map((event, index) => {
                        const content = JSON.parse(event.content);
                        return (
                            <Step active key={`event_${event.id}`} aria-label={getTimelineTranslation(event.type, content, translate) + " Hora: " + moment(event.date).format('LLL')} >
                                <StepLabel>
                                    <b>{getTimelineTranslation(event.type, content, translate)}</b><br />
                                    <span style={{ fontSize: '0.9em' }}>{moment(event.date).format('LLL')}</span>
                                </StepLabel>
                                <StepContent style={{ fontSize: '0.9em' }}>
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
                    })}
                </Stepper>
            </React.Fragment>
    );
}

const isValidResult = type => {
    const types = {
        PUBLIC_CUSTOM: true,
        PRIVATE_CUSTOM: true,
        CUSTOM_NOMINAL: true,
        default: false
    }

    return types[type]? !types[type] : types.default;
}

const councilTimelineQuery = gql`
    query CouncilTimeline($councilId: Int!){
        councilTimeline(councilId: $councilId){
            id
            type
            date
            content
        }
    }
`;


const getTimelineTranslation = (type, content, translate) => {
    const types = {
        'START_COUNCIL': () => translate.council_started,
        'START_AUTO_COUNCIL': () => translate.council_started,
        'OPEN_VOTING': () => `${content.data.agendaPoint.name} - ${translate.voting_open}`,
        'END_COUNCIL': () => translate.end_council,
        'OPEN_POINT_DISCUSSION': () => `${content.data.agendaPoint.name} - ${translate.agenda_begin_discussed}`,
        'CLOSE_POINT_DISCUSSION': () => `${content.data.agendaPoint.name} - ${translate.close_point}`,
        'CLOSE_VOTING': () => `${content.data.agendaPoint.name} - ${translate.closed_votings}`,
        'REOPEN_VOTING': () => `${content.data.agendaPoint.name} - ${translate.reopen_voting}`,
        default: () => 'Tipo no reconocido'
    }

    return types[type] ? types[type]() : types.default();
}

export default withApollo(withTranslations()(TimelineSection));
