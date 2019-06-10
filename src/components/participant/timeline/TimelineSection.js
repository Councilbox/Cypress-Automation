import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { Scrollbar, LoadingSection } from '../../../displayComponents';
import { Paper } from 'material-ui';
import { Stepper, Step, StepLabel, StepContent } from 'material-ui';
import { moment } from '../../../containers/App';
import { isMobile } from 'react-device-detect';
import CouncilInfoMenu from '../menus/CouncilInfoMenu';


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
                            <Step active key={`event_${event.id}`} aria-label={getTimelineTranslation(event.type, content) + " Hora: " + moment(event.date).format('LLL')} >
                                <StepLabel>
                                    <b>{getTimelineTranslation(event.type, content)}</b><br />
                                    <span style={{ fontSize: '0.9em' }}>{moment(event.date).format('LLL')}</span>
                                </StepLabel>
                                <StepContent style={{ fontSize: '0.9em' }}>
                                    {event.type === 'CLOSE_VOTING' &&
                                        <React.Fragment>
                                            <span>
                                                {`Resultados:`}
                                                <div aria-label={"A favor: " + content.data.agendaPoint.results.positive} /*TRADUCCION*/ >A favor: {content.data.agendaPoint.results.positive}</div>
                                                <div aria-label={"En contra: " + content.data.agendaPoint.results.negative}/*TRADUCCION*/ >En contra: {content.data.agendaPoint.results.negative}</div>
                                                <div aria-label={"Abstención: " + content.data.agendaPoint.results.abstention} /*TRADUCCION*/>Abstención: {content.data.agendaPoint.results.abstention}</div>
                                                <div aria-label={"No vota: " + content.data.agendaPoint.results.noVote} /*TRADUCCION*/>No vota: {content.data.agendaPoint.results.noVote}</div>                                            </span>
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



//TRADUCCION
const getTimelineTranslation = (type, content) => {
    const types = {
        'START_COUNCIL': () => 'Comienzo de reunión',
        'OPEN_VOTING': () => `${content.data.agendaPoint.name} - Apertura de votaciones`,
        'END_COUNCIL': () => 'Fin de reunión',
        'OPEN_POINT_DISCUSSION': () => `${content.data.agendaPoint.name} - Apertura de discusión de punto`,
        'CLOSE_POINT_DISCUSSION': () => `${content.data.agendaPoint.name} - Cierre de discusión de punto`,
        'CLOSE_VOTING': () => `${content.data.agendaPoint.name} - Cierre de votaciones`,
        'REOPEN_VOTING': () => `${content.data.agendaPoint.name} - Reapertura de votaciones`,
        default: () => 'Tipo no reconocido'
    }

    return types[type] ? types[type]() : types.default();
}

export default withApollo(TimelineSection);

/*
graphql(councilTimeline, {
    options: props => ({
        variables: {
            councilId: props.council.id
        }
    })
})*/